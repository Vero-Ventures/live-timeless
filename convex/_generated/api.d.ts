/* prettier-ignore-start */

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as ResendOTP from "../ResendOTP.js";
import type * as actions from "../actions.js";
import type * as auth from "../auth.js";
import type * as challenges from "../challenges.js";
import type * as emails_LTLoginOTP from "../emails/LTLoginOTP.js";
import type * as emails_LTWelcome from "../emails/LTWelcome.js";
import type * as goalLogs from "../goalLogs.js";
import type * as goals from "../goals.js";
import type * as http from "../http.js";
import type * as organizations from "../organizations.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  ResendOTP: typeof ResendOTP;
  actions: typeof actions;
  auth: typeof auth;
  challenges: typeof challenges;
  "emails/LTLoginOTP": typeof emails_LTLoginOTP;
  "emails/LTWelcome": typeof emails_LTWelcome;
  goalLogs: typeof goalLogs;
  goals: typeof goals;
  http: typeof http;
  organizations: typeof organizations;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

/* prettier-ignore-end */
