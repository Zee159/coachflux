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
import type * as coach_base from "../coach/base.js";
import type * as coach_compass from "../coach/compass.js";
import type * as coach_grow from "../coach/grow.js";
import type * as coach_index from "../coach/index.js";
import type * as coach_types from "../coach/types.js";
import type * as coach from "../coach.js";
import type * as embeddings from "../embeddings.js";
import type * as embeddingsInternal from "../embeddingsInternal.js";
import type * as frameworks_compass from "../frameworks/compass.js";
import type * as frameworks_grow from "../frameworks/grow.js";
import type * as frameworks_registry from "../frameworks/registry.js";
import type * as frameworks_types from "../frameworks/types.js";
import type * as metrics from "../metrics.js";
import type * as mutations from "../mutations.js";
import type * as nudges from "../nudges.js";
import type * as prompts_base from "../prompts/base.js";
import type * as prompts_compass from "../prompts/compass.js";
import type * as prompts_grow from "../prompts/grow.js";
import type * as prompts_index from "../prompts/index.js";
import type * as queries from "../queries.js";
import type * as reports_base from "../reports/base.js";
import type * as reports_compass from "../reports/compass.js";
import type * as reports_grow from "../reports/grow.js";
import type * as reports_index from "../reports/index.js";
import type * as reports_types from "../reports/types.js";
import type * as reports from "../reports.js";
import type * as safety from "../safety.js";
import type * as seed from "../seed.js";
import type * as types from "../types.js";
import type * as utils_cssCalculator from "../utils/cssCalculator.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "coach/base": typeof coach_base;
  "coach/compass": typeof coach_compass;
  "coach/grow": typeof coach_grow;
  "coach/index": typeof coach_index;
  "coach/types": typeof coach_types;
  coach: typeof coach;
  embeddings: typeof embeddings;
  embeddingsInternal: typeof embeddingsInternal;
  "frameworks/compass": typeof frameworks_compass;
  "frameworks/grow": typeof frameworks_grow;
  "frameworks/registry": typeof frameworks_registry;
  "frameworks/types": typeof frameworks_types;
  metrics: typeof metrics;
  mutations: typeof mutations;
  nudges: typeof nudges;
  "prompts/base": typeof prompts_base;
  "prompts/compass": typeof prompts_compass;
  "prompts/grow": typeof prompts_grow;
  "prompts/index": typeof prompts_index;
  queries: typeof queries;
  "reports/base": typeof reports_base;
  "reports/compass": typeof reports_compass;
  "reports/grow": typeof reports_grow;
  "reports/index": typeof reports_index;
  "reports/types": typeof reports_types;
  reports: typeof reports;
  safety: typeof safety;
  seed: typeof seed;
  types: typeof types;
  "utils/cssCalculator": typeof utils_cssCalculator;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
