import type {
  RepoImprovementPlan,
  AvatarMotionSpec
} from "../../core/src/index.js";

/**
 * OpenAI Responses API function-tool definitions for the two skills.
 * These are plain JSON-schema tool specs you can pass to `responses.create`.
 * The handler contract (what your application returns from each tool) is the
 * Zod-validated shape in `@premium-agent-skills/core`.
 */

export const repoImprovementTool = {
  type: "function",
  function: {
    name: "plan_repo_improvements",
    description:
      "Analyze repository context and return a bounded improvement plan with evidence and verification steps. Prefer the smallest safe change; do not propose broad rewrites unless explicitly asked.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        repo_summary: { type: "string" },
        failing_log: { type: "string" },
        constraints: { type: "array", items: { type: "string" } }
      },
      required: ["repo_summary"],
      additionalProperties: false
    }
  }
} as const;

export const avatarMotionTool = {
  type: "function",
  function: {
    name: "generate_avatar_motion_spec",
    description:
      "Generate an ORIGINAL premium mascot spec with SVG concept directions and animation states. Reject prompts that ask to clone an existing product mascot.",
    strict: true,
    parameters: {
      type: "object",
      properties: {
        mascot: { type: "string" },
        traits: { type: "array", items: { type: "string" } },
        states: { type: "array", items: { type: "string" } }
      },
      required: ["mascot", "states"],
      additionalProperties: false
    }
  }
} as const;

export const tools = [repoImprovementTool, avatarMotionTool] as const;

export type ToolName = (typeof tools)[number]["function"]["name"];

/** Look up a tool definition by its function name. */
export function getToolByName(name: ToolName) {
  return tools.find((t) => t.function.name === name);
}

/**
 * Implementation contract your application fulfils when a tool call fires.
 * Return values must satisfy the matching `@premium-agent-skills/core` schema.
 */
export interface ToolHandlers {
  plan_repo_improvements: (args: {
    repo_summary: string;
    failing_log?: string;
    constraints?: string[];
  }) => Promise<RepoImprovementPlan>;
  generate_avatar_motion_spec: (args: {
    mascot: string;
    traits?: string[];
    states: string[];
  }) => Promise<AvatarMotionSpec>;
}

/** Tool names exposed when serving these skills over a remote MCP server. */
export const mcpAllowedTools = [
  "scan_repo",
  "analyze_failure",
  "plan_improvements",
  "verify_commands",
  "parse_brief",
  "generate_svg_concepts",
  "create_motion_spec",
  "build_lottie_starter",
  "emit_rive_storyboard"
] as const;
