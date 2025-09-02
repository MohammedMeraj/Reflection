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
import type * as classes from "../classes.js";
import type * as classesSimple from "../classesSimple.js";
import type * as faculty from "../faculty.js";
import type * as labs from "../labs.js";
import type * as labsSimple from "../labsSimple.js";
import type * as subjects from "../subjects.js";
import type * as superAdmin from "../superAdmin.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  classes: typeof classes;
  classesSimple: typeof classesSimple;
  faculty: typeof faculty;
  labs: typeof labs;
  labsSimple: typeof labsSimple;
  subjects: typeof subjects;
  superAdmin: typeof superAdmin;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
