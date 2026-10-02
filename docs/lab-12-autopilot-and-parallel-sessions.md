# Lab 12: Autopilot, parallel sessions, and sandboxing

**Time:** 60–75 minutes. **Prerequisite:** [Lab 11](lab-11-branches-prs-and-review.md), with CI running on pull requests. Without tests and CI, do not use Autopilot on your own projects yet.

## What you will learn

- Decide when a task is ready for **Autopilot** and when it is not.
- Limit what agent-run commands can reach with **local sandboxing**.
- Write an Autopilot brief with a clear goal, limits, and stop conditions.
- Run two independent sessions at the same time without conflicts.
- Review agent-made work like a pull request from a teammate, and keep an eye on usage.

## Before you start

The Copilot app has three session modes:

| Mode | How much the agent does alone | Good for |
| --- | --- | --- |
| **Interactive** | Suggests changes and waits for you | Learning, risky changes, anything new to you |
| **Plan** | Writes a plan; you approve it before work starts | Features with several steps |
| **Autopilot** | Writes code, runs tests, and iterates without waiting | Well-defined tasks with strong automated checks |

Autopilot is powerful because it does not stop. That is also the risk. Your **spec, tests, CI, and commits** from Levels 2 and 3 are what make it safe. They catch mistakes when you are not watching every step.

## Step 1: Check that the task is Autopilot-ready

Use this checklist before every Autopilot run. If any box is unchecked, use **Plan** or **Interactive** instead.

- ✅ The task is written down with acceptance checks (a spec or an issue).
- ✅ `npm test`, `npm run lint`, and `npm run build` all pass right now.
- ✅ Everything is committed, so you can see and undo exactly what Autopilot changes.
- ✅ The work happens on its own branch or working tree, not directly on `main`.
- ✅ No secrets, real data, deployments, or account changes are involved.
- ✅ You know how you will check the result yourself.

**This lab's task:** add a **"Clear filters"** button that resets search to empty and the status filter to **All**. It is small, testable, and easy to check by hand. Write a three-line spec for it in `docs/spec-clear-filters.md` first, using Lab 08's format, and commit it.

## Step 2: Turn on local sandboxing

Without a sandbox, commands an agent runs have **the same access as your user account**: your files, your network, and your Git credentials. **Local sandboxing** runs agent commands inside an operating-system sandbox that limits that access.

> Local sandboxing is in **public preview** and may change. It is off by default. Support depends on your operating system version.

1. Start a **new session** for your learner project and choose **new working tree** as the location.
2. Before sending a task, **Copilot chat:**

   ```prompt
   /sandbox on
   ```

3. **What changes:** in an active session, this turns sandboxing on for that session only. If you type it before the session has started, it changes the project's default for new sessions instead, which is also fine. By default a sandboxed session can still read and write its own workspace, reach the internet (for packages), use your local dev server, and use Git credentials for pushing. You can tighten this per project in app settings under **Sandbox**.
4. If a command needs more access, the app asks **Run outside the sandbox?** You can cancel, run it once outside, or turn the sandbox off for the rest of the session. **Read the command first.** "Run once" is almost always enough.
5. **Verify:** ask Copilot to run `npm ci` and then `npm test` in this session. `npm ci` installs packages into the new working tree, which starts without `node_modules`, and also confirms the sandbox allows package downloads. Both should succeed inside the sandbox.

**If the app shows "Sandbox unavailable":** your operating system may not support it yet. Read the reported problem and try **Retry sandbox**. If it still fails, you can continue this lab without the sandbox, but keep the task small and watch every step.

To make sandboxing the default for every new local session in this project, open the app settings, select your project, and under **Sandbox** turn on **Sandbox new sessions**.

## Step 3: Write the Autopilot brief

An Autopilot brief is a spec plus rules of engagement. Because the agent will not stop to ask, everything it needs must be in the message.

1. Attach the spec with `@docs/spec-clear-filters.md`. Then **Copilot chat:**

   ```prompt
   /autopilot Implement the attached spec: a "Clear filters" button.
   Goal: one button that sets search to empty and the status filter to All.
   Definition of done: a new unit test for any new pure function, written first
   and seen failing; npm test, npm run lint, and npm run build all exit 0;
   the button is a real <button>, keyboard accessible, with visible focus.
   Limits: change only files under src/. Do not add
   packages. Do not change existing tests' expected values. Do not change
   lint, TypeScript, or CI settings. Do not push, open a pull request, or deploy.
   Stop conditions: if a check fails three times in a row, or the task needs
   anything outside these limits, stop and explain instead of continuing.
   When finished, summarize every changed file and how you verified the work.
   ```

2. Watch the first minute. You will see it read files, write a test, run commands, and iterate. You can still type a message to steer it.
3. **Verify:** when it stops, its summary names each changed file and reports the exit codes of all three checks.

> **Why the stop conditions matter:** without them, an agent stuck on a failing check may keep trying bigger and bigger changes. "Stop and explain after three failures" turns a runaway loop into a useful bug report.

## Step 4: Review Autopilot's work like a teammate's pull request

Never merge Autopilot's work because it said "done."

1. Click **Changes**. Every changed file should be inside the limits you set. A changed test expectation, config file, or new package is a red flag. Ask why.
2. **Copilot chat:**

   ```prompt
   /review
   ```

3. Ask for fresh evidence rather than trusting Autopilot's summary. **Copilot chat:**

   ```prompt
   Run npm test, npm run lint, and npm run build in this session, one at a time.
   Show me the full output and exit code of each. Do not change any files.
   ```

   **Expected:** tests report `Tests ... passed`, and all three commands exit with code 0.

4. Open the preview. Type a search, choose **Done**, then press **Clear filters** with the mouse and again with the keyboard (Tab to it, press Enter). Both must reset the search and the filter.
5. If everything is good, commit and open a pull request, as in Lab 11. Let CI confirm it.

## Step 5: Run two sessions in parallel

Each session runs in its own isolated workspace, so you can work on several tasks at once. This works well when the tasks touch **different files**.

1. Pick two independent tasks. For example:
   - **Session A:** add a short "How to use this app" paragraph to the README.
   - **Session B:** add a test that the stored-data parser rejects an unknown status, such as `"Archived"`.
2. Start each one as a **new session** on a **new working tree** for your learner project. Ask each to run `npm ci` first, then give it its own clear prompt. Use **Interactive** or **Plan** if you are not yet comfortable with Autopilot.
3. Switch between them in the sidebar. Sessions are grouped by repository.
4. Finish each with its own commit and pull request. Merge one, then update the other branch (ask Copilot: "Pull the latest main into this branch and rerun all checks") before merging the second.
5. **Verify:** both pull requests merged with green checks, and `main` passes all checks after both merges.

**Other ways to split work:**

| Command | What it does | When to use it |
| --- | --- | --- |
| `/fork` | Copies the current session at its latest turn | Try two approaches to the same problem |
| `/spawn [PROMPT]` | Creates a focused child session for delegated work | Hand off a side task without losing your place |
| `/fleet [PROMPT]` | Launches multiple agents in parallel for one task | Large tasks that split cleanly into parts; use only after you are comfortable reviewing many changes |

⚠️ **Parallel work multiplies review.** Two sessions mean two sets of changes to read. Start with two, not ten.

## Step 6: Keep an eye on usage and choose models deliberately

Autopilot and parallel sessions can use more of your plan's allowance.

1. **Copilot chat:**

   ```prompt
   /usage
   ```

   This shows usage and rate-limit details for your plan.
2. For personal tips based on your own history, try `/chronicle cost-tips`.
3. Below the prompt box you can choose a model and reasoning effort. **Auto** picks a model based on task complexity. Higher reasoning effort can help with hard problems but takes longer. For small, well-specified tasks, Auto is a sensible default.
4. **Cloud sandbox sessions** run on GitHub's computers and are billed based on usage. They are useful for heavy parallel work, but this course does not require them.

## Common issues

- **Autopilot changed a test to make it pass:** reject the change. Restate the limit "Do not change existing tests' expected values" and ask it to fix the code.
- **Autopilot keeps going far beyond the task:** stop it by typing a message such as "Stop. Summarize what you changed." Restore unwanted files with `git restore -- <file>` after reading the diff. Next time, write tighter limits.
- **Two sessions changed the same file:** the second pull request may show a merge conflict. Ask Copilot to explain both versions before resolving it, then rerun all checks.
- **A sandboxed command fails with a permission or network error:** read the message. If the command truly needs access, choose **run once outside the sandbox** after reading it. Do not turn the sandbox off just to make an error disappear.
- **`/autopilot`, `/sandbox`, `/spawn`, or `/fleet` is missing:** commands vary by app version and policy. Type `/` to see what you have. You can switch modes from the dropdown below the prompt box instead.

## Verification and summary

You are done when you completed the readiness checklist, ran one Autopilot task with written limits and stop conditions (sandboxed if your OS supports it), reviewed its changes with **Changes**, `/review`, and your own checks, and merged two parallel sessions' pull requests with green CI.

**What you learned:** Autopilot is only as safe as the guardrails around it. Specs, tests, CI, commits, sandboxing, and your own review let an agent work independently without losing control.

**Source check:** 2026-10-02. Session modes, working trees, parallel sessions, models, and sandboxing follow GitHub's [agent sessions guide](https://docs.github.com/en/copilot/how-tos/github-copilot-app/agent-sessions), [local sandboxing guide](https://docs.github.com/en/copilot/how-tos/github-copilot-app/configure-local-sandboxing), and [about cloud and local sandboxes](https://docs.github.com/en/copilot/concepts/security-governance-and-network-settings/about-cloud-and-local-sandboxes). Commands follow the [slash command reference](https://docs.github.com/en/copilot/reference/github-copilot-app-reference/slash-commands). Sandboxing is in public preview; this course did not test it on every operating system.

**Next:** [Lab 13: Custom agents, automations, and your capstone](lab-13-custom-agents-and-automations.md).
