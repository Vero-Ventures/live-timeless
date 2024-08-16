import { httpRouter } from "convex/server";

import { generateHabitPlan } from "./ai";
import { handleKindeWebhook } from "./webhook/kinde";

// Initializing the HTTP router
const http = httpRouter();

// Configuring the webhook route
http.route({
  path: "/webhook/kinde",
  method: "POST",
  handler: handleKindeWebhook,
});

http.route({
  path: "/ai/habit-plan",
  method: "POST",
  handler: generateHabitPlan,
});

export default http;
