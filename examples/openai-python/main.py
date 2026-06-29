"""OpenAI Responses API with function tools for premium-agent-skills.

Run:
    OPENAI_API_KEY=... python main.py

Set OPENAI_MODEL to your preferred model (defaults to gpt-4.1).
"""

import json
import os

from openai import OpenAI

client = OpenAI()
MODEL = os.environ.get("OPENAI_MODEL", "gpt-4.1")

tools = [
    {
        "type": "function",
        "function": {
            "name": "generate_avatar_motion_spec",
            "description": (
                "Create an original premium mascot spec with SVG directions "
                "and motion states."
            ),
            "strict": True,
            "parameters": {
                "type": "object",
                "properties": {
                    "mascot": {"type": "string"},
                    "traits": {"type": "array", "items": {"type": "string"}},
                    "states": {"type": "array", "items": {"type": "string"}},
                },
                "required": ["mascot", "states"],
                "additionalProperties": False,
            },
        },
    }
]

response = client.responses.create(
    model=MODEL,
    input=(
        "Use the avatar motion tool for a premium owl mascot with idle, hover, "
        "active, success, and error states."
    ),
    tools=tools,
)

print(json.dumps(response.output, indent=2, default=str))
