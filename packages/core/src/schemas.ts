import { z } from "zod";

/**
 * Output contracts for the two skills, expressed as Zod schemas.
 * These are the single source of truth for:
 *  - validating model/tool output before it is trusted,
 *  - generating the JSON Schema used in OpenAI function tools,
 *  - documenting the shape in each SKILL.md.
 */

/* ------------------------------------------------------------------ */
/* Repo Improvement Architect                                          */
/* ------------------------------------------------------------------ */

export const ConfidenceSchema = z.enum(["high", "medium", "low"]);
export type Confidence = z.infer<typeof ConfidenceSchema>;

export const RiskSchema = z.enum(["low", "medium", "high"]);
export type Risk = z.infer<typeof RiskSchema>;

export const EvidenceItemSchema = z.object({
  path: z.string().min(1),
  finding: z.string().min(1),
  confidence: ConfidenceSchema
});
export type EvidenceItem = z.infer<typeof EvidenceItemSchema>;

export const RecommendedChangeSchema = z.object({
  scope: z.string().min(1),
  files: z.array(z.string()),
  risk: RiskSchema
});

export const VerificationSchema = z.object({
  commands: z.array(z.string()),
  manual_checks: z.array(z.string())
});

export const RepoImprovementPlanSchema = z.object({
  summary: z.string().min(1),
  evidence: z.array(EvidenceItemSchema),
  recommended_next_change: RecommendedChangeSchema,
  verification: VerificationSchema,
  optional_followups: z.array(z.string()).default([])
});
export type RepoImprovementPlan = z.infer<typeof RepoImprovementPlanSchema>;

/* ------------------------------------------------------------------ */
/* Avatar Motion Forge                                                 */
/* ------------------------------------------------------------------ */

export const MotionStateSchema = z.enum([
  "idle",
  "hover",
  "active",
  "success",
  "error"
]);
export type MotionState = z.infer<typeof MotionStateSchema>;

export const AvatarConceptSchema = z.object({
  name: z.string().min(1),
  svg: z.string().min(1),
  design_notes: z.array(z.string())
});

export const MotionTimingsSchema = z.object({
  idle_loop: z.number().int().positive(),
  hover_in: z.number().int().positive(),
  active_pulse: z.number().int().positive(),
  success: z.number().int().positive(),
  error: z.number().int().positive()
});

export const MotionSpecSchema = z.object({
  states: z.array(MotionStateSchema).min(1),
  timings_ms: MotionTimingsSchema
});

export const RiveInputSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["boolean", "number", "trigger"])
});

export const RiveTransitionSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  on: z.string().min(1)
});

export const RivePlanSchema = z.object({
  inputs: z.array(RiveInputSchema),
  transitions: z.array(RiveTransitionSchema)
});

export const AvatarMotionSpecSchema = z.object({
  concepts: z.array(AvatarConceptSchema).min(1),
  motion_spec: MotionSpecSchema,
  lottie_json: z.record(z.string(), z.unknown()).default({}),
  rive_plan: RivePlanSchema
});
export type AvatarMotionSpec = z.infer<typeof AvatarMotionSpecSchema>;
