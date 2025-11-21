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
import type * as checkKnowledge from "../checkKnowledge.js";
import type * as coach_base from "../coach/base.js";
import type * as coach_career from "../coach/career.js";
import type * as coach_communication from "../coach/communication.js";
import type * as coach_compass from "../coach/compass.js";
import type * as coach_grow from "../coach/grow.js";
import type * as coach_index from "../coach/index.js";
import type * as coach_leadership from "../coach/leadership.js";
import type * as coach_productivity from "../coach/productivity.js";
import type * as coach_types from "../coach/types.js";
import type * as coach from "../coach.js";
import type * as debug from "../debug.js";
import type * as deleteLegacyKnowledge from "../deleteLegacyKnowledge.js";
import type * as embeddings from "../embeddings.js";
import type * as embeddingsInternal from "../embeddingsInternal.js";
import type * as frameworks_career from "../frameworks/career.js";
import type * as frameworks_compass from "../frameworks/compass.js";
import type * as frameworks_grow from "../frameworks/grow.js";
import type * as frameworks_leadership from "../frameworks/leadership.js";
import type * as frameworks_productivity from "../frameworks/productivity.js";
import type * as frameworks_registry from "../frameworks/registry.js";
import type * as frameworks_types from "../frameworks/types.js";
import type * as knowledgeRecommendations from "../knowledgeRecommendations.js";
import type * as knowledgeSearch from "../knowledgeSearch.js";
import type * as metrics from "../metrics.js";
import type * as mutations from "../mutations.js";
import type * as nudges from "../nudges.js";
import type * as prompts_base from "../prompts/base.js";
import type * as prompts_career from "../prompts/career.js";
import type * as prompts_communication from "../prompts/communication.js";
import type * as prompts_compass from "../prompts/compass.js";
import type * as prompts_grow from "../prompts/grow.js";
import type * as prompts_index from "../prompts/index.js";
import type * as prompts_leadership from "../prompts/leadership.js";
import type * as prompts_productivity from "../prompts/productivity.js";
import type * as queries from "../queries.js";
import type * as reports_base from "../reports/base.js";
import type * as reports_career from "../reports/career.js";
import type * as reports_communication from "../reports/communication.js";
import type * as reports_compass from "../reports/compass.js";
import type * as reports_grow from "../reports/grow.js";
import type * as reports_index from "../reports/index.js";
import type * as reports_leadership from "../reports/leadership.js";
import type * as reports_leadership_backup from "../reports/leadership_backup.js";
import type * as reports_productivity from "../reports/productivity.js";
import type * as reports_types from "../reports/types.js";
import type * as reports from "../reports.js";
import type * as safety from "../safety.js";
import type * as seed from "../seed.js";
import type * as seedCareerDevelopment from "../seedCareerDevelopment.js";
import type * as seedCareerDevelopmentEnhanced from "../seedCareerDevelopmentEnhanced.js";
import type * as seedFinance from "../seedFinance.js";
import type * as seedFinanceEnhanced from "../seedFinanceEnhanced.js";
import type * as seedHealth from "../seedHealth.js";
import type * as seedHealthEnhanced from "../seedHealthEnhanced.js";
import type * as seedKnowledge from "../seedKnowledge.js";
import type * as seedKnowledgeEnhanced from "../seedKnowledgeEnhanced.js";
import type * as seedPersonalDevelopment from "../seedPersonalDevelopment.js";
import type * as seedPersonalDevelopmentEnhanced from "../seedPersonalDevelopmentEnhanced.js";
import type * as seedProductivity from "../seedProductivity.js";
import type * as seedProductivityEnhanced from "../seedProductivityEnhanced.js";
import type * as seedRelationships from "../seedRelationships.js";
import type * as seedRelationshipsEnhanced from "../seedRelationshipsEnhanced.js";
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
  checkKnowledge: typeof checkKnowledge;
  "coach/base": typeof coach_base;
  "coach/career": typeof coach_career;
  "coach/communication": typeof coach_communication;
  "coach/compass": typeof coach_compass;
  "coach/grow": typeof coach_grow;
  "coach/index": typeof coach_index;
  "coach/leadership": typeof coach_leadership;
  "coach/productivity": typeof coach_productivity;
  "coach/types": typeof coach_types;
  coach: typeof coach;
  debug: typeof debug;
  deleteLegacyKnowledge: typeof deleteLegacyKnowledge;
  embeddings: typeof embeddings;
  embeddingsInternal: typeof embeddingsInternal;
  "frameworks/career": typeof frameworks_career;
  "frameworks/compass": typeof frameworks_compass;
  "frameworks/grow": typeof frameworks_grow;
  "frameworks/leadership": typeof frameworks_leadership;
  "frameworks/productivity": typeof frameworks_productivity;
  "frameworks/registry": typeof frameworks_registry;
  "frameworks/types": typeof frameworks_types;
  knowledgeRecommendations: typeof knowledgeRecommendations;
  knowledgeSearch: typeof knowledgeSearch;
  metrics: typeof metrics;
  mutations: typeof mutations;
  nudges: typeof nudges;
  "prompts/base": typeof prompts_base;
  "prompts/career": typeof prompts_career;
  "prompts/communication": typeof prompts_communication;
  "prompts/compass": typeof prompts_compass;
  "prompts/grow": typeof prompts_grow;
  "prompts/index": typeof prompts_index;
  "prompts/leadership": typeof prompts_leadership;
  "prompts/productivity": typeof prompts_productivity;
  queries: typeof queries;
  "reports/base": typeof reports_base;
  "reports/career": typeof reports_career;
  "reports/communication": typeof reports_communication;
  "reports/compass": typeof reports_compass;
  "reports/grow": typeof reports_grow;
  "reports/index": typeof reports_index;
  "reports/leadership": typeof reports_leadership;
  "reports/leadership_backup": typeof reports_leadership_backup;
  "reports/productivity": typeof reports_productivity;
  "reports/types": typeof reports_types;
  reports: typeof reports;
  safety: typeof safety;
  seed: typeof seed;
  seedCareerDevelopment: typeof seedCareerDevelopment;
  seedCareerDevelopmentEnhanced: typeof seedCareerDevelopmentEnhanced;
  seedFinance: typeof seedFinance;
  seedFinanceEnhanced: typeof seedFinanceEnhanced;
  seedHealth: typeof seedHealth;
  seedHealthEnhanced: typeof seedHealthEnhanced;
  seedKnowledge: typeof seedKnowledge;
  seedKnowledgeEnhanced: typeof seedKnowledgeEnhanced;
  seedPersonalDevelopment: typeof seedPersonalDevelopment;
  seedPersonalDevelopmentEnhanced: typeof seedPersonalDevelopmentEnhanced;
  seedProductivity: typeof seedProductivity;
  seedProductivityEnhanced: typeof seedProductivityEnhanced;
  seedRelationships: typeof seedRelationships;
  seedRelationshipsEnhanced: typeof seedRelationshipsEnhanced;
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
