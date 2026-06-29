export * from "./schemas.js";

import {
  RepoImprovementPlanSchema,
  AvatarMotionSpecSchema,
  type RepoImprovementPlan,
  type AvatarMotionSpec
} from "./schemas.js";

/** Parse and validate a Repo Improvement Architect plan. Throws on invalid input. */
export function validateRepoPlan(input: unknown): RepoImprovementPlan {
  return RepoImprovementPlanSchema.parse(input);
}

/** Non-throwing variant returning a Zod SafeParse result. */
export function safeValidateRepoPlan(input: unknown) {
  return RepoImprovementPlanSchema.safeParse(input);
}

/** Parse and validate an Avatar Motion Forge spec. Throws on invalid input. */
export function validateAvatarSpec(input: unknown): AvatarMotionSpec {
  return AvatarMotionSpecSchema.parse(input);
}

/** Non-throwing variant returning a Zod SafeParse result. */
export function safeValidateAvatarSpec(input: unknown) {
  return AvatarMotionSpecSchema.safeParse(input);
}
