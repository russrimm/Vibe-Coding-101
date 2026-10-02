# Lab 06: Teach Copilot your rules and one reusable skill

**Time:** 20–30 minutes. **Prerequisite:** a working local Copilot session and the saved core app from [Lab 03](lab-03-test-and-save.md). You may read ahead; this optional module does not change core completion.

## What you will learn

- Tell a prompt, instruction file, skill, and MCP server apart.
- Add rules for just your learner project.
- Create and load one small skill without downloading someone else's code.
- Check that a review reports evidence, not invented success.

## Before you start

Keep your current app and commit. We will add a small review recipe, not more app features. No extra npm package, model-provider key, CLI installation, or cloud account is needed.

| Tool | Plain-English meaning | Use it when |
| --- | --- | --- |
| Prompt | Your request for this turn | "Add one labeled Name field" |
| Project instructions | Rules relevant to most work in this project | "Use fictional records; explain unfamiliar terms" |
| Skill | A reusable recipe loaded for a matching task | "Review this app with the beginner-review recipe" |
| MCP server | A connection that gives the AI tools or information | "Search official documentation with a tool" |
| Plugin | An installable bundle that can include skills, tools, and more | Later, after reviewing every included capability |

None of these is proof of correctness or a reason to approve every tool request. A skill containing scripts can run code through the agent's tools; a skill's popularity is not a safety review.

## Step 1: Set project rules without changing every project

1. In the **GitHub Copilot desktop app**, open app settings. Under **Projects**, choose your learner project. Find its **Instructions** field.
2. Read any existing instructions first. Do not replace your organization's rules. For an empty field, paste the following. If the field already contains rules, add only compatible guidance after reviewing it.

   ```markdown
   Explain new technical terms in one short sentence.
   Work on one small change at a time, then stop for my check.
   Use fictional records only. Never request secrets or real customer data.
   Keep this practice app local. Ask before installing packages or publishing.
   Preserve the working build and lint scripts.
   Report expected and actual results. Say NOT RUN when a check was not run.
   Never call an app production-ready based only on a successful build.
   ```

3. Return to the same local session. If your current session has not picked up the change, use `/restart-session` in the chat box; this restarts that session while keeping its history. Do not use `/clear`, which clears the transcript.
4. **Copilot chat:**

   ```prompt
   Without changing files or running commands, explain our learner project's
   rules and what you would report if a requested browser check had not been run.
   Give one short example of a technical term explained for a beginner.
   ```

5. **Expected:** plain language, a local/fictional-data boundary, and **NOT RUN** for an unrun check. If the answer conflicts with the field, reopen settings, check the selected project, and review competing instructions. Repeating your rules in a chat reply does not prove they will always be followed.
6. Do not put these rules in **Settings → Sessions → App instructions** unless you want them in every project. That is the global setting, not this project's setting.

**Settings can change a file:** if `.github\github-app.yml` already exists, desktop project-setting edits write back to it. Review **Changes** afterward. That YAML configuration can also contain scripts; do not approve scripts or other settings you have not reviewed. A repository configuration changed outside the app requires review and acceptance before it applies. See [desktop repository configuration](https://docs.github.com/en/copilot/reference/github-copilot-app-reference/repository-configuration).

**Portable instruction files:** you may also encounter `.github\copilot-instructions.md`, the repository-wide Markdown convention documented for Copilot's shared CLI engine. It is **not** the same file as `.github\github-app.yml`, and the Instructions field does not necessarily edit it. This exercise uses the documented desktop setting above; automatic discovery of a Markdown file must be checked on your app build. Explicitly asking Copilot to read a file is not proof of automatic discovery. The desktop `/init` command can generate or improve repository instructions; review what it proposes. Do not copy this portal's enterprise instructions or duplicate conflicting rules.

## Step 2: Create one local review skill

1. Confirm the **actual session workspace**, including any worktree. Ask Copilot to show existing `.github` files without changing them. The dot in `.github` is part of the folder name; some file browsers hide dot-folders.
2. The file we want is `.github\skills\beginner-review\SKILL.md`. Read that as folders **.github → skills → beginner-review**, then a file named **SKILL.md**. The exact filename matters: `SKILL.md.txt` will not work.
3. Send this preparation request in **Copilot chat**:

   ```prompt
   In this learner repository only, prepare to add
   .github/skills/beginner-review/SKILL.md.
   First show the actual workspace and check whether that path already exists.
   Do not overwrite an existing file or change app code.
   Wait for me to send the exact file content next.
   Then create only the needed folders and that file, with my approval.
   Do not install tools, add scripts, or change global settings.
   ```

4. Once Copilot confirms the path is safe, send the **entire file content** below as a chat message so Copilot can save it. This is Markdown to save, **not a command**. The two `---` lines enclose **YAML frontmatter**: a small block of settings naming and describing the skill.

   ```markdown
   ---
   name: beginner-review
   description: Review a small local practice tracker with a first-time learner. Use when asked for a beginner review or to review the core lab evidence.
   ---

   # Beginner review

   Start with: "Beginner review: evidence before confidence."
   Do not modify files, install packages, commit, or publish during this review.
   Use only the current learner workspace and fictional records.

   1. Confirm the app name, actual workspace, and one-record scope.
   2. Inspect package.json and identify the existing build and lint commands.
      Do not run them unless the learner separately approves those commands.
   3. Ask for browser evidence for: sample records, a valid add, blank and
      spaces-only rejection, status change, combined search/filter, and refresh.
   4. Report a table: Check | Expected | Actual | Evidence source | Result.
      Distinguish your tool output from learner-reported observations.
      Use PASS only with evidence, FAIL for a mismatch, and NOT RUN otherwise.
   5. An invented quote or a confident explanation is not evidence.
      Do not infer working buttons from source inspection or a passing build.
   6. Finish with one smallest next action and explain one unfamiliar term.
   ```

5. Review the resulting file in **Changes**. If it is untracked, ask Copilot to display its content too. **Expected:** `name` matches `beginner-review`, the description says when to use it, and there are no scripts, credentials, or `allowed-tools` pre-approvals.
6. Keep it project-scoped. Do not install it into your home folder's `.copilot` directory for this exercise. Project skills live under `.github\skills`; personal skills would affect other projects.

## Step 3: Load the skill and prove it is used

1. In the active session's chat box, type `/skills reload` and send it. The desktop app documents this command for reloading skills mid-session.
2. Open **Customize → Skills** in the app sidebar. Use **Installed** to review available customizations. You can also type `/skills` in the session. Check for **beginner-review** in the project/session context.
3. **Expected:** the skill is discovered, not just a file with a plausible name. If it is missing, check the workspace, exact filename, and frontmatter. Reload once after correcting the file; do not install a plugin to hide the problem.
4. Return to the same learner session and send:

   ```prompt
   Use the beginner-review skill to review my core lab evidence.
   First load its SKILL.md and identify the skill you loaded.
   I have not supplied browser test evidence for this review.
   Do not edit files or run build/lint yet.
   ```

5. **Verify:** the transcript shows the skill being loaded or its file being read from the expected project path. The reply begins **Beginner review: evidence before confidence.** It uses the requested table and marks missing evidence **NOT RUN**. The opening phrase alone is not proof of skill discovery: inspect the load/read record too.
6. If the reply claims unrun tests passed, stop and ask it to correct the report. Do not mark the module verified. Using a skill does not eliminate hallucinations, which are plausible but unsupported AI statements.

## Step 4: Supply evidence and review the result

1. Repeat one test in your app, such as submitting a spaces-only Name. Record the action, expected result, and actual result.
2. Give Copilot that **learner-reported** result. Separately approve the existing build and lint commands if you want fresh tool-observed results.
3. **Expected:** the table distinguishes your observation from actual command output. Other unrun rows stay **NOT RUN**. Compare every claimed PASS with its evidence.
4. Repeat any failed check after a fix in a separate build turn. Do not let a review silently repair the app and claim the original version passed.
5. Review and intentionally commit the new skill file using [Lab 03's save process](lab-03-test-and-save.md). No push is required. A commit of only `SKILL.md` does not back up project settings. If the settings changed `.github\github-app.yml`, review that file separately and decide whether to include it; do not commit secrets or unreviewed automatic scripts.

## Common issues

| Symptom | What to do |
| --- | --- |
| Skill is not listed | Confirm the actual session workspace, `.github\skills\beginner-review\SKILL.md`, spelling, and frontmatter, then `/skills reload` |
| Copilot ignores the skill | Ask for it by name and inspect the load/read action; do not infer use from the answer's style |
| Rules affect another app | Check whether you edited global App instructions instead of your project's Instructions |
| Downloaded skill asks for secrets or broad shell approval | Do not install it; inspect all files and scripts with your facilitator |
| Review claims every test passed instantly | Ask for concrete outputs; keep unsupported results NOT RUN |

## Verification and summary

Keep a short record: project instructions selected, skill path, discovery/load evidence, one evidence table, and any unrun checks. This module is complete for you only when you observed the skill load and checked its evidence claims.

In the portal, confirm only the matching **Optional checkpoints** below the lessons. Record details in **Evidence and recovery**, then use **Download evidence** to keep a copy. These saved confirmations do not change core completion.

**Source check:** 2026-09-09. These steps follow the [desktop customization guide](https://docs.github.com/en/copilot/how-tos/github-copilot-app/customize-github-copilot-app), [desktop slash commands](https://docs.github.com/en/copilot/reference/github-copilot-app-reference/slash-commands), [agent skills overview](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills), and [skill file format](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills). UI placement may change. Documentation review is not a fresh installation test on your computer.

**Next:** [Lab 07: Connect one documentation MCP server](lab-07-mcp.md), or return to [optional next steps](lab-05-next-steps.md).
