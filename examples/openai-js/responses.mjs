// OpenAI Responses API with function tools for the two skills.
// Run: OPENAI_API_KEY=... node responses.mjs
// Set OPENAI_MODEL to your preferred model (defaults to gpt-4.1).
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL ?? "gpt-4.1";

const tools = [
  {
    type: "function",
    function: {
      name: "plan_repo_improvements",
      description:
        "Analyze repository context and return a bounded improvement plan with evidence and verification steps.",
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
  },
  {
    type: "function",
    function: {
      name: "generate_avatar_motion_spec",
      description:
        "Generate an original premium mascot spec with SVG directions and animation states.",
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
  }
];

async function run() {
  const response = await client.responses.create({
    model: MODEL,
    input:
      "Use the repo improvement tool for a TypeScript repo with flaky CI and no framework migration allowed.",
    tools
  });

  console.log(JSON.stringify(response.output, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
