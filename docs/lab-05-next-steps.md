# Lab 05: Optional next steps

**Time:** 15–30 minutes for one small local extension; cloud and identity projects need separate planning.

**Prerequisite:** finish the core lab and keep its working commit. This stage is optional and does not add requirements to core completion.

## What you will learn

- Choose one improvement, not a rewrite.
- Preserve a known working version.
- Separate a local learning extension from a real deployment.

## Choose your next learning goal

You do not need to install everything. Read one module, finish its checks, and stop before adding the next tool.

| Goal | Walkthrough | What you will verify |
| --- | --- | --- |
| Make Copilot follow project rules and a repeatable review recipe | [Lab 06: Instructions and skills](lab-06-instructions-and-skills.md) | Correct project scope, skill discovery/load, honest evidence table |
| Give Copilot one public documentation source | [Lab 07: MCP](lab-07-mcp.md) | Real search/fetch calls, supported citations, no private data, connection removal |
| Improve your local app | Continue with Step 1 below | One small feature and its tests |
| Go further with specs, automated tests, debugging, pull requests, Autopilot, and custom agents | The [learning path](learning-path.md): Level 2 (Labs 08–10) and Level 3 (Labs 11–13) | A spec, tests you watched fail and pass, a merged pull request with green checks |

The tool modules are readable before core completion, but finishing your first local app before adding tools is recommended. A plugin, skill, or MCP connection is not required to be a successful beginner.

## Step 1: Choose one local extension

1. Pick **one**:
   - A visible count of records by status. Verify the totals equal the list count.
   - A character limit on Name. Test the limit and one character beyond it.
   - An automated test for whitespace-only names. See it fail before the fix and pass afterward.
   - A simple print layout for fictional records. Check print preview before printing.
2. Avoid a second entity, account system, or library unless the chosen improvement genuinely requires it.
3. **Chat prompt:**

   ```prompt
   I have a verified local Store Inventory Practice prototype.
   Plan one extension: [choose a single improvement above].
   State what will change, what must stay unchanged, and one positive and
   one negative test. Keep the current synthetic-data boundary.
   Do not implement until I approve the plan. No cloud, accounts, or new APIs.
   ```

4. Review, approve, implement, preview, rerun the affected acceptance tests plus build/lint, and review a new local commit.

## Step 2: Treat integrations as separate projects

1. For Graph, identity, databases, or AI services, first write down who owns the data, what permissions are needed, and where secrets would live.
2. Use a sandbox and synthetic data. Do not connect the beginner app to your employer's records merely because you can sign in.
3. The retained [Graph integration reference](Lab04-EnterpriseGraphMCP.md), [Graph UI reference](Lab05-UniversalGraphComponents.md), [service-health reference](Bonus-ServiceHealthPortal.md), and [AI assistant reference](Bonus-AzureOpenAIChatbot.md) are **advanced design notes**, not validated copy-and-run beginner labs.
4. No generated interface, checklist, badge, or successful login proves business fitness, security, or regulatory compliance.

## Step 3: Consider publishing only after a separate approval

1. A local app is not a public app. Publishing changes who can access it and may create costs.
2. Before any deployment, agree on the owner, subscription/account, budget, resource names, region, permissions, data allowed, authentication need, rollback, and cleanup.
3. Review current platform documentation and an estimate with your facilitator. A “free” offer may have limits; a budget alert is not a guaranteed spending cap.
4. Review [optional deployment planning](Lab09-DeployToAzure.md). That reference does not authorize resource creation.
5. Never put a secret into browser code or a `VITE_` variable. Anything shipped to a browser can be inspected.

## Verification, common issues, and summary

- **The extension breaks the core app:** pause, inspect the diff, and restore only the unwanted changes with an understood recovery plan. Do not run a destructive reset blindly.
- **The request grows:** return to one improvement and one measurable result.
- **You are out of time:** stop at your verified core commit. You already completed the required lab.

**Next:** repeat the same loop in a new learner folder with another [use case](use-cases.md), continue on the [learning path](learning-path.md), or stop here.
