import { httpRouter } from "convex/server";

import { handleKindeWebhook } from "./webhook/kinde";

// Initializing the HTTP router
const http = httpRouter();

// Configuring the webhook route
http.route({
  path: "/webhook/kinde",
  method: "POST",
  handler: handleKindeWebhook,
});

export default http;
