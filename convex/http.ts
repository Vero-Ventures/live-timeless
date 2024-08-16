import { z } from "zod";

import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { ConvexError } from "convex/values";

const userEventSchema = z.object({
  data: z.object({
    user: z.object({
      id: z.string(),
      first_name: z.string(),
      last_name: z.string(),
      email: z.string().email(),
    }),
  }),
  type: z.string(),
});

// Function to validate and decode JWT from the incoming request
async function validateRequest(request: Request) {
  const jwt = await request.text();
  if (!jwt) {
    console.error("JWT not found.");
    return null;
  }

  const base64Url = jwt.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  const payload = JSON.parse(jsonPayload);
  const result = userEventSchema.safeParse(payload);
  if (!result.success) {
    throw new ConvexError(result.error.message);
  } else {
    return result.data;
  }
}

async function isWebhookProcessed(ctx: any, webhookId: string) {
  const processed = await ctx.runQuery(internal.webhooks.getProcessedWebhook, {
    webhookId,
  });
  return processed !== null;
}

async function markWebhookProcessed(ctx: any, webhookId: string) {
  await ctx.runMutation(internal.webhooks.markWebhookProcessed, { webhookId });
}

// Defining the webhook handler
const handleKindeWebhook = httpAction(async (ctx, request) => {
  // Extract the webhook-id from headers
  const webhookId = request.headers.get("webhook-id");
  if (!webhookId) {
    throw new ConvexError("Missing webhook-id header");
  }

  // Check if we've already processed this webhook
  if (await isWebhookProcessed(ctx, webhookId)) {
    console.log(`Webhook ${webhookId} already processed. Skipping.`);
    return new Response("Already processed", { status: 200 });
  }

  const event = await validateRequest(request);
  if (!event) {
    return new Response("Error occurred", { status: 400 });
  }

  switch (event.type) {
    case "user.created": {
      const { user } = event.data;
      await ctx.runMutation(internal.users.createUser, {
        kindeId: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
      });
      break;
    }
    default: {
      console.log("ignored Kinde webhook event", event.type);
    }
  }

  // Mark the webhook as processed
  await markWebhookProcessed(ctx, webhookId);

  return new Response(null, { status: 200 });
});

// Initializing the HTTP router
const http = httpRouter();

// Configuring the webhook route
http.route({
  path: "/kinde-users-webhook",
  method: "POST",
  handler: handleKindeWebhook,
});

export default http;
