import { describe, it, expect } from "vitest";
import {
  validateRepoPlan,
  safeValidateRepoPlan,
  validateAvatarSpec,
  safeValidateAvatarSpec
} from "../src/index.js";

describe("RepoImprovementPlan", () => {
  const valid = {
    summary: "Normalize CI install/test commands to cut flaky failures.",
    evidence: [
      {
        path: ".github/workflows/test.yml",
        finding: "Two jobs use different install steps (npm i vs npm ci).",
        confidence: "high"
      }
    ],
    recommended_next_change: {
      scope: "Unify install + test commands in the workflow",
      files: [".github/workflows/test.yml"],
      risk: "low"
    },
    verification: {
      commands: ["npm ci", "npm test"],
      manual_checks: ["Re-run the workflow twice and confirm both pass"]
    }
  };

  it("accepts a well-formed plan and defaults optional_followups", () => {
    const parsed = validateRepoPlan(valid);
    expect(parsed.summary).toContain("CI");
    expect(parsed.optional_followups).toEqual([]);
  });

  it("rejects a plan missing the summary", () => {
    const { summary, ...rest } = valid;
    void summary;
    const result = safeValidateRepoPlan(rest);
    expect(result.success).toBe(false);
  });

  it("rejects an invalid confidence value", () => {
    const bad = {
      ...valid,
      evidence: [{ ...valid.evidence[0], confidence: "certain" }]
    };
    expect(safeValidateRepoPlan(bad).success).toBe(false);
  });
});

describe("AvatarMotionSpec", () => {
  const valid = {
    concepts: [
      {
        name: "Aperture Owl",
        svg: "<svg xmlns='http://www.w3.org/2000/svg'></svg>",
        design_notes: ["Original silhouette", "Low facial detail"]
      }
    ],
    motion_spec: {
      states: ["idle", "hover", "active", "success", "error"],
      timings_ms: {
        idle_loop: 2400,
        hover_in: 160,
        active_pulse: 220,
        success: 360,
        error: 280
      }
    },
    rive_plan: {
      inputs: [{ name: "isHover", type: "boolean" }],
      transitions: [{ from: "idle", to: "hover", on: "isHover == true" }]
    }
  };

  it("accepts a well-formed spec and defaults lottie_json", () => {
    const parsed = validateAvatarSpec(valid);
    expect(parsed.concepts).toHaveLength(1);
    expect(parsed.lottie_json).toEqual({});
  });

  it("rejects an unknown motion state", () => {
    const bad = {
      ...valid,
      motion_spec: { ...valid.motion_spec, states: ["idle", "wiggle"] }
    };
    expect(safeValidateAvatarSpec(bad).success).toBe(false);
  });

  it("rejects a non-positive timing", () => {
    const bad = {
      ...valid,
      motion_spec: {
        ...valid.motion_spec,
        timings_ms: { ...valid.motion_spec.timings_ms, idle_loop: 0 }
      }
    };
    expect(safeValidateAvatarSpec(bad).success).toBe(false);
  });
});
