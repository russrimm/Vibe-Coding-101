# Lab 13: Custom agents, automations, and your capstone

**Time:** 60–90 minutes, plus your capstone. **Prerequisite:** [Lab 12](lab-12-autopilot-and-parallel-sessions.md). [Lab 06](lab-06-instructions-and-skills.md) explains instructions and skills, which this lab builds on.

## What you will learn

- Tell project instructions, skills, and **custom agents** apart, and pick the right one.
- Create a read-only custom agent that reviews tests but cannot change files.
- Create a **manual automation** that runs a repeatable check on demand.
- Plan your own capstone project with a spec, tests, and a definition of done.

## Before you start

You now have several ways to teach Copilot how you work. They overlap, so here is when to use each:

| Tool | What it is | Use it for | Example |
| --- | --- | --- | --- |
| **Project instructions** | Rules for every session in a project | Things that are always true | "Use fictional data. Say NOT RUN for unrun checks." |
| **Skill** (`SKILL.md`) | A recipe Copilot loads when a task matches | A repeatable procedure | "How to review this app for beginners" |
| **Custom agent** (`.agent.md`) | A specialist with its own instructions and optionally **limited tools** | A role that should only do certain things | "A test reviewer that can read but never edit" |
| **Automation** | A saved prompt that runs on a schedule, on an event, or on demand | Recurring work | "Every morning, run the checks and summarize" |

The key advantage of a custom agent is the `tools` list. A reviewer that physically cannot edit files is safer than a reviewer that was merely asked not to.

## Step 1: Create a read-only test-reviewer agent

1. In your learner project's session (Interactive mode), **Copilot chat:**

   ```prompt
   Create one file: .github/agents/test-reviewer.agent.md with exactly the
   content I paste next. Do not change any other file. Show me the result.
   ```

2. Paste this as your next message:

   ```markdown
   ---
   name: test-reviewer
   description: Reviews this learner app's unit tests for missing cases and weak assertions. Use when asked to review tests or test coverage.
   tools: ["read", "search"]
   ---

   You are a careful test reviewer for a small beginner React app.
   You only read and search files. You never edit files or run commands.

   When asked to review tests:
   1. List each pure function in src/ and the tests that cover it.
   2. For each function, name the most important missing case, if any:
      empty input, spaces only, boundary values (for example 40 and 41 characters),
      invalid stored data, and case-insensitive search.
   3. Flag weak assertions, such as checking only that something is "truthy".
   4. Suggest at most five new tests, each as one plain-English sentence.
   5. If you cannot verify something without running code, write NOT RUN.

   Keep the answer short and use plain language.
   ```

3. **What the parts mean:** the block between the `---` lines is the **frontmatter**. `description` tells Copilot when this agent fits a task. `tools: ["read", "search"]` limits the agent to reading and searching. With no `tools` line, an agent can use all tools. Everything below the frontmatter is the agent's instructions.
4. Review **Changes**. Commit it: `chore: add read-only test-reviewer agent`.

## Step 2: Use the agent and test its limits

1. Type `/agent` in the prompt box and choose **test-reviewer**, or pick it from the agent picker in the prompt box. If it does not appear, type `/restart-session` and try again.
2. **Copilot chat:**

   ```prompt
   Review the tests for src/records.ts.
   ```

3. **Expected:** a short list of covered functions, missing cases, and suggested tests. Compare its suggestions with your own spec. Are they real gaps?
4. Now test the boundary on purpose:

   ```prompt
   Add the first test you suggested to src/records.test.ts.
   ```

5. **Expected:** the agent says it cannot edit files, or offers the test as text. ✅ That is the tool limit working. ❌ If it edits the file, check that the `tools` line saved exactly as shown and that you selected **test-reviewer**. Then switch to the default agent and ask it to show the diff and restore only that file (`git restore -- src/records.test.ts`).
6. Switch back to the default agent and ask it to add the most useful suggested test with the red → green loop.

> **Tip:** you can also let Copilot choose. A prompt like "review my tests" may pick **test-reviewer** automatically because of its description. Selecting it explicitly is more predictable while you learn.

## Step 3: Create a manual automation

**Automations** save a prompt so it can run again without retyping. This lab uses a **local, manual** automation: it runs only when you press play, on your own computer.

1. In the app sidebar, open **Automations**, then click **New automation**.
2. **Name:** `Learner app health check`.
3. **Trigger:** choose **Manual**.
4. Leave **Run in the cloud** off.
5. **Prompt:**

   ```prompt
   In this project, run npm ci, npm run lint, npm test, and npm run build.
   Report each command's exit code in a table. If anything fails, show the
   first error and the file it names, then stop. Do not change any files,
   do not commit, and do not push.
   ```

6. Click **Select project** and choose your learner project.
7. Open the dropdown next to **Create** and choose **Create and run**.
8. **Verify:** a new session starts and reports four exit codes of 0. On the **Automations** page, the card shows the last run status. Next time, press its play button to run it on demand.

**Before you schedule anything:** automations can also run **hourly**, **daily**, **weekly**, on a **CRON** schedule, or when issues or pull requests change. Cloud automations can run while your computer is off and can be given tools such as pushing changes or creating pull requests. Each run uses your plan's allowance, and each tool you grant is something it can do without asking. Start with manual, read-only automations, and grant only the tools a task truly needs.

### Optional: try a canvas

A **canvas** is a shared work surface that opens in the app's right side panel, such as a checklist, a board, or a document. You and Copilot can both change it, so you can steer visible work instead of describing every change in chat.

1. Open **Customize** in the sidebar, then **Canvas**, to browse featured canvases. Some need a plugin; install one only if you recognize its publisher and your organization allows it.
2. To build your own, open a session and send this **Copilot chat** prompt:

   ```prompt
   /create-canvas Create a simple checklist canvas for my capstone's definition of done.
   Let me check items off and add new items. Keep it personal to my computer, not shared
   with a team repository. Do not install packages and do not change my app's source files.
   ```

3. **Expected:** Copilot asks about scope (choose **user** or personal, not project) and opens the canvas in the side panel. Review **Changes**; a personal canvas lives outside your project folder.
4. **Verify:** check one item in the canvas, then ask Copilot "Which items are checked?" It should answer from the canvas. Skip this step if **Canvas** is missing; it is optional.

## Step 4: Plan your capstone

You have used every major part of the workflow on a practice app. Now plan something **you** care about, using the same guardrails.

1. **Pick a small idea.** Good capstones fit in a weekend: a reading log, a chore chart, a recipe scaler, a habit tracker, or a workshop sign-up list using fictional names. Avoid logins, payments, real personal data, and public hosting for your first one.
2. Create a **new empty folder** and a new project in the app, as in Lab 00. Do not build inside this practice app or the portal.
3. Start in a **chat** to sharpen the idea, then switch to a session in **Plan** mode:

   ```prompt
   Help me plan a small local web app: [your idea in two sentences].
   Use React, TypeScript, and Vite with fictional data only.
   Produce: a one-screen spec with Goal, Rules, Out of scope, and Given/When/Then
   acceptance checks; a list of four to six small increments, each with one check
   I can run in the browser; and which logic should be pure functions with unit tests.
   No accounts, payments, external APIs, or deployment. Do not create files yet.
   ```

4. Save the spec as `docs/spec.md` in the new project and commit it before writing any app code.
5. Write your **definition of done**. Copy this and fill it in:

   ```markdown
   ## Definition of done
   - [ ] Every acceptance check in docs/spec.md passes in the browser, run by me.
   - [ ] npm test, npm run lint, and npm run build all exit with code 0.
   - [ ] At least one test was seen failing before it passed.
   - [ ] Keyboard-only use works and focus is visible.
   - [ ] Only fictional data. No secrets anywhere in the repository.
   - [ ] Each increment is its own commit (or pull request) with a clear message.
   - [ ] I can explain what the app does NOT do yet.
   ```

6. Build it one increment at a time using every level: Interactive or Plan for anything new, tests first, `/review` before each commit, and Autopilot only for well-specified increments that meet the Lab 12 checklist.

## Common issues

- **The agent does not appear in `/agent`:** check the path is exactly `.github/agents/test-reviewer.agent.md`, the frontmatter starts and ends with `---` lines, and `description` is present. Then `/restart-session`.
- **The agent still edited a file:** confirm you selected it, and that `tools` reads `["read", "search"]`. Unrecognized tool names are ignored, so a typo can leave the agent with fewer tools, not more. If it still edits, report it and rely on reviewing **Changes**.
- **No Automations section:** your app version or organization policy may not include it. Save the health-check prompt in a text file and paste it when needed instead.
- **The automation tried to fix things:** your prompt said not to change files. Read what it did, restore with Git if needed, and make the prompt's limits more explicit.
- **The capstone plan is too big:** cut it to one record type and four increments, exactly like Store Inventory Practice. You can add more after the first version works.

## Verification and summary

You are done when your learner project has a committed read-only custom agent that reviewed your tests and declined to edit, a manual automation that ran and reported four exit codes, and a new capstone project with a committed spec and a definition of done.

**What you learned:** instructions, skills, custom agents, and automations each encode a different kind of know-how. Limiting tools is a real safety boundary. And the same small loop — spec, test, build, review, save — scales from a two-record practice list to your own projects.

**Source check:** 2026-10-07. Canvases follow [Working with canvas extensions in the GitHub Copilot app](https://docs.github.com/en/copilot/how-tos/github-copilot-app/working-with-canvas-extensions); this course did not test `/create-canvas` on every app version. Custom agent format and tool aliases follow [About custom agents](https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-custom-agents), [custom agents configuration](https://docs.github.com/en/copilot/reference/custom-agents-configuration), and [creating custom agents for Copilot CLI](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/create-custom-agents-for-cli), which the app is built on. Automations follow [Using automations in the GitHub Copilot app](https://docs.github.com/en/copilot/how-tos/github-copilot-app/using-automations). This course did not run the automation or agent picker on every app version; labels may differ.

**Next:** you have completed the learning path. 🎉 Keep the [vibe coding playbook](vibe-coding-playbook.md) open while you build your capstone, and revisit the [learning path](learning-path.md) whenever you want to sharpen one skill.
