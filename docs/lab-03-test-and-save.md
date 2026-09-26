# Lab 03: Test, review, and save

**Time:** 20–30 minutes. **Prerequisite:** finish [Lab 02](lab-02-build.md).

## What you will learn

- Check visible behavior, including bad inputs.
- Check keyboard and narrow-screen use.
- Run build and lint checks.
- Review a change before making a local Git commit.

## Step 1: Run this acceptance test

1. Open the generated app at its **actual preview URL**, not the learning portal.
2. Choose **All** and clear the search. Keep one **Blue notebook** test record; reuse it if you added it earlier rather than adding a duplicate.
3. Run each row in order. Record **Pass** or **Fail**, plus what you observed, in your session notes. A failed row stays unchecked in the portal.

| Test | Action | Expected result |
| --- | --- | --- |
| Sample list | Find Notebook pack and Desk organizer | Both appear; original statuses are New and Done |
| Valid add | If missing, add Blue notebook | Exactly one Blue notebook record is present |
| Empty name | Submit a blank Name, then a spaces-only Name | Both attempts show an error; record count does not grow |
| Status update | Set Blue notebook to In progress | Only that record's status changes |
| Search | Search for the full Blue notebook name in lowercase | Only that record appears |
| Combined filter | Keep the search and choose Done | No matching records; no crash |
| Clear controls | Clear search and choose All | All three records return |
| Persistence | Reload the same browser URL | Three records remain, including Blue notebook — In progress; no duplicate seeds |

## Step 2: Test keyboard and narrow-screen use

1. **Browser action:** use **Tab** and **Shift+Tab** to move between Name, Add record, record status controls, Search by name, and Filter by status.
2. **Verify:** you can see the focused control; focus moves in a sensible order; no control traps you. Use arrow keys for selects and Enter or Space for buttons.
3. Submit an empty Name with the keyboard. The error must be visible and associated with the input, not only shown by color.
4. Open your browser's developer tools from its menu, then its device/responsive toolbar. Set the viewport to **375 pixels wide**. If unavailable, resize to a narrow window and record that this was an approximate check.
5. **Verify:** labels and controls remain readable, no form action is clipped, and the page does not need horizontal scrolling. Restore the normal viewport afterward.
6. These are basic checks, **not a full accessibility audit**. Do not claim WCAG conformance from this checklist alone.

## Step 3: Run build and lint

1. Keep the preview server running. In the **same desktop session**, ask Copilot to run the following, or use a **second terminal** in its actual working directory:

   ```terminal
   npm run build
   npm run lint
   ```

2. **Expected:** each command finishes with **exit code 0**. Build performs TypeScript checks and creates `dist`; lint checks source files. Lint may print little or nothing on success. Read the output, not just Copilot's summary.
3. If running commands yourself in PowerShell, immediately after **each** command run:

   ```powershell
   $LASTEXITCODE
   ```

   **Expected output:** `0`. Any other number means that command failed.

4. In a macOS terminal, immediately after **each** command run:

   ```bash
   echo $?
   ```

   **Expected output:** `0`.

5. Record both exit codes and any warnings. Nonzero means the check failed. Use the recovery prompt in [Lab 02](lab-02-build.md); do not remove rules or skip type checking to turn a failure green.
6. Rerun the failed command and the affected browser checks after fixing it.

> A successful build is not proof that every button works, and successful browser clicks are not proof the project builds. You need both.

## Step 4: Review the files you will save

1. Click **Changes** above the prompt box in the desktop app. A **diff** shows what was added and removed. If that view is unavailable, ask Copilot to show the changed files, or open `/terminal` in the active session and run:

   ```terminal
   git status --short
   git diff --stat
   git diff
   ```

2. **Expected:** only your learner app's intended files changed. New/untracked files do not appear in plain `git diff`; inspect their contents too, either in the app or by asking Copilot to show each one.
3. Ask Copilot to explain anything unfamiliar. Confirm the working validation and test scripts were not removed.
4. Check for passwords, API keys, personal data, generated files, and unrelated changes. Include `package-lock.json`; exclude `node_modules`, `dist`, and private `.env` files with `.gitignore`. Frontend `VITE_` variables are public to the browser, not a place for secrets.

## Step 5: Make an intentional local checkpoint

1. A **Git commit** records a snapshot locally. It does **not** push to GitHub, back up the computer, or deploy the app.
2. If Git says this is not a repository, confirm the learner folder again, then ask Copilot to run `git init` **only there**. If Git requests an author identity, use the instructions below before retrying. Do not initialize a repository inside another project or change global settings by default.
3. **Chat prompt:**

   ```prompt
   Prepare a local Git checkpoint for this learner app only.
   Show the repository root, branch, and proposed file list. Do not stage
   unrelated files, node_modules, dist, private .env files, or secrets.
   After I approve the list, stage only those named paths and show the staged diff,
   including all new files. Wait for my review before committing.
   Do not push, publish, deploy, or merge into another branch.
   ```

4. Review the staged content (`git diff --cached`), then explicitly approve the local commit with message **feat: build local practice tracker**. This is your permission to save, not to publish. Do not choose **Create PR** for this local-only checkpoint.
5. **Terminal commands, or ask Copilot to run and show their output:**

   ```terminal
   git log -1 --oneline
   git status --short
   ```

6. **Verify:** the latest commit has your intended message. Status is empty for a fully committed learner app, or every remaining file is understood and intentionally uncommitted. Record the commit ID and the actual workspace path.
7. If the session uses a separate worktree, keep that session/worktree available until you have arranged a durable local copy or reviewed merge with your facilitator. A commit exists in Git, but a session cleanup can make an unmerged branch harder to find. Do not delete your session as a cleanup shortcut.

### If Git asks who you are

1. This identity labels your commits; it is **not** your password or a sign-in command. In your browser, open **GitHub → Settings → Emails**. If you want to keep your address private, copy the exact GitHub-provided no-reply address shown there. Do not invent an address from your username.
2. In the terminal for the confirmed learner repository, replace the two placeholders below with your approved name and email. Keep the double quotes. Run one line at a time:

   ```terminal
   git config --local user.name "YOUR CHOSEN NAME"
   git config --local user.email "YOUR APPROVED EMAIL OR GITHUB NO-REPLY ADDRESS"
   git config --local --get user.name
   git config --local --get user.email
   ```

3. **Expected:** the last two commands print the values you chose. Do not leave the placeholder words in your configuration. `--local` limits these settings to this repository, not every project on your computer.
4. Return to the reviewed commit step. If a work policy requires signed commits or a managed identity, ask your facilitator to help rather than disabling that policy.

### Know what each save actually does

| Action | Where the result lives | What it does not do |
| --- | --- | --- |
| Save a file | Your working folder | Does not create Git history |
| Stage a file | Your proposed next commit | Does not commit or upload it |
| Commit | Local Git history | Does not back up to GitHub |
| Push | A configured remote repository | Does not automatically publish a website |

The beginner course stops at a **local commit**. Keep the folder and record the workspace/branch/commit ID. Do not click Publish, Push, or Create PR merely to dismiss a prompt.

**Official references:** [first-time Git setup](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup), [GitHub commit email](https://docs.github.com/en/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address).

## Common issues

- **Browser pass, build fail:** use the exact first build error for a minimal fix.
- **Unexpected files in Git:** stop before staging; check the repository root.
- **Nothing to commit:** inspect the latest commit and status; do not fabricate another change.
- **Cannot commit:** preserve your files and ask your facilitator about Git identity or permissions. Leave the save checkpoint incomplete until verified.

## Verification and summary

Mark the shared testing checklist only after recording the browser results, keyboard/narrow checks, both command exit codes, and a reviewed local commit. The portal records your report; it does not run tests against the learner app.

**Next:** [Lab 04: Explain what you built](lab-04-completion.md).
