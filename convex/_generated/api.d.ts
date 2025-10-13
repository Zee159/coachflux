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
import type * as coach from "../coach.js";
import type * as metrics from "../metrics.js";
import type * as mutations from "../mutations.js";
import type * as prompts from "../prompts.js";
import type * as queries from "../queries.js";
import type * as seed from "../seed.js";
import type * as types from "../types.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  coach: typeof coach;
  metrics: typeof metrics;
  mutations: typeof mutations;
  prompts: typeof prompts;
  queries: typeof queries;
  seed: typeof seed;
  types: typeof types;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
