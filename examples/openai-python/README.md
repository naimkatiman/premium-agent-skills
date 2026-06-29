# OpenAI Python example

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
export OPENAI_API_KEY=sk-...      # Windows PowerShell: $env:OPENAI_API_KEY="sk-..."
python main.py
```

The script defines `generate_avatar_motion_spec` as a JSON-schema function tool
and calls the Responses API. Swap in `plan_repo_improvements` (see the JS
example) for the repo-improvement workflow. Validate returned JSON against the
contracts in `skills/*/references/`.
