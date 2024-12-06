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
import type * as auth from "../auth.js";
import type * as challengeHabits from "../challengeHabits.js";
import type * as challenges from "../challenges.js";
import type * as dateUtils from "../dateUtils.js";
import type * as emails_LTLoginOTP from "../emails/LTLoginOTP.js";
import type * as emails_LTUserInvitation from "../emails/LTUserInvitation.js";
import type * as emails_LTWelcome from "../emails/LTWelcome.js";
import type * as habitLogs from "../habitLogs.js";
import type * as habitStats from "../habitStats.js";
import type * as habits from "../habits.js";
import type * as http from "../http.js";
import type * as invitations from "../invitations.js";
import type * as organizations from "../organizations.js";
import type * as singleHabitStats from "../singleHabitStats.js";
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
  auth: typeof auth;
  challengeHabits: typeof challengeHabits;
  challenges: typeof challenges;
  dateUtils: typeof dateUtils;
  "emails/LTLoginOTP": typeof emails_LTLoginOTP;
  "emails/LTUserInvitation": typeof emails_LTUserInvitation;
  "emails/LTWelcome": typeof emails_LTWelcome;
  habitLogs: typeof habitLogs;
  habitStats: typeof habitStats;
  habits: typeof habits;
  http: typeof http;
  invitations: typeof invitations;
  organizations: typeof organizations;
  singleHabitStats: typeof singleHabitStats;
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
