// OpenAI Agents SDK example wiring the Repo Improvement Architect as a tool.
// Run: OPENAI_API_KEY=... npx tsx agents-sdk.ts
import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";

const repoImprovementTool = tool({
  name: "repo_improvement_architect",
  description: "Create a bounded repo improvement plan with evidence.",
  parameters: z.object({
    repoSummary: z.string(),
    constraints: z.array(z.string()).default([])
  }),
  async execute({ repoSummary, constraints }) {
    // In a real integration, hand `repoSummary` to the skill and return its
    // validated JSON (see @premium-agent-skills/core `validateRepoPlan`).
    return {
      summary: `Top improvement for: ${repoSummary}`,
      evidence: [
        "Multiple workflow files use inconsistent install/test sequences.",
        "No single documented verification ladder exists."
      ],
      recommended_next_change: {
        scope: "Normalize install + test commands in CI",
        risk: "low"
      },
      verification: {
        commands: ["npm ci", "npm test"],
        constraints
      }
    };
  }
});

const agent = new Agent({
  name: "Skill Demo Agent",
  instructions:
    "Use the repo_improvement_architect tool when a user asks for repo audits, bounded refactor plans, or CI stabilization.",
  tools: [repoImprovementTool]
});

const result = await run(
  agent,
  "Audit a Node repo with flaky CI and recommend the smallest safe next change."
);

console.log(result.finalOutput);
