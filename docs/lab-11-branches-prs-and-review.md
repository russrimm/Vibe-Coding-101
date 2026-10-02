# Lab 11: Branches, pull requests, and AI review

**Time:** 60–75 minutes. **Prerequisite:** finish Level 2 through [Lab 10](lab-10-debug-and-recover.md), with `npm test`, `npm run build`, and `npm run lint` all passing and a clean `git status`.

## What you will learn

- Review AI-written changes with `/review` and `/security-review` before anyone else sees them.
- Add **CI** (continuous integration): checks that GitHub runs automatically on every change.
- Publish your practice app to a **private** GitHub repository.
- Build a feature on its own branch in a separate session and open a **pull request**.
- Read check results and review comments, ask Copilot to fix them, and make the merge decision yourself.

## Before you start

Until now your app has lived only on your computer. In this lab it gets a home on GitHub, so you can practice the workflow professional teams use every day:

```diagram
 branch  →  change  →  local review  →  pull request  →  CI checks + review  →  you merge
```

A **branch** is a separate line of work. A **pull request** (PR) is a GitHub page that proposes merging a branch, with room for comments and automatic checks. Nothing reaches your main branch until **you** merge it.

**Read these limits first:**

- ⚠️ Use a **private** repository and **fictional data only**. Check your organization's policy before creating repositories with a work account.
- ⚠️ Never commit secrets. Your app has none, and it should stay that way.
- ⚠️ GitHub Actions on private repositories uses your account's monthly allowance of included minutes. This lab's checks take a few minutes per run. Check **Settings → Billing and licensing** on GitHub if you are unsure.
- Publishing a repository is **not** publishing a website. Nobody else can see a private repository unless you invite them.

## Step 1: Add CI checks to your project

CI runs the same checks you run by hand (lint, tests, build) on a fresh computer every time you push. If it passes there, it is not just "works on my machine."

1. Stop your app's dev server first (press **Ctrl+C** in its terminal); the next prompt reinstalls packages. In your learner project's session, use **Interactive** mode. **Copilot chat:**

   ```prompt
   Create .github/workflows/ci.yml with exactly the content I paste next.
   Do not change any other files. Then run npm ci, npm run lint, npm test,
   and npm run build locally and report each exit code.
   ```

2. Paste this as your next message (or save it yourself at `.github/workflows/ci.yml`):

   ```yaml
   name: CI

   on:
     pull_request:
     push:
       branches: [main]

   permissions:
     contents: read

   jobs:
     check:
       runs-on: ubuntu-latest
       timeout-minutes: 10
       steps:
         - uses: actions/checkout@v7
         - uses: actions/setup-node@v7
           with:
             node-version: 24
             cache: npm
         - run: npm ci
         - run: npm run lint
         - run: npm test
         - run: npm run build
   ```

3. **What each part does:** `on` says when to run (every pull request, and every push to `main`). `permissions: contents: read` gives the workflow read-only access, which is all it needs. The steps download your code, install Node.js 24, install the exact packages from `package-lock.json` with `npm ci`, and run your three checks.
4. **Check your branch name.** This lab expects the session from Labs 00–10 that works directly in your project folder (a **local repository** session), not a working tree. In its terminal run:

   ```terminal
   git branch --show-current
   ```

   **Expected:** `main` or `master`. In our rehearsal, `git init` created `master`. If yours says `master`, rename it now, before anything is published, so every later step can say `main`:

   ```terminal
   git branch -m master main
   ```

   If it prints any other name, you are probably in a working-tree session. Switch to your original project session before continuing.
5. **Verify:** all four local commands exit with code 0. Stop your app's dev server first (press **Ctrl+C** in its terminal): on Windows, `npm ci` deletes `node_modules`, and a running dev server keeps some of those files locked. If `npm ci` then reports that `package-lock.json` and `package.json` are out of sync, ask Copilot to run `npm install` once, review the lockfile change, and try again.
6. Commit only the workflow file: `ci: run lint, tests, and build on GitHub`.

## Step 2: Publish to a private GitHub repository

1. **Copilot chat:**

   ```prompt
   I want to publish this learner project to a new PRIVATE GitHub repository
   named store-inventory-practice under my personal account.
   First, tell me which tools you would use and show every command.
   Confirm there are no secrets, .env files, node_modules, or dist folders in Git.
   Do not run anything until I approve. Push the current branch only.
   ```

2. Read the plan. ✅ Approve only if the repository is **private** and the push is your current branch.
3. **Prefer to do it yourself?** On GitHub, choose **New repository**, name it `store-inventory-practice`, choose **Private**, and do **not** add a README, license, or .gitignore. Copy the HTTPS URL it shows. Then in your session's terminal, replacing `YOUR-USERNAME`:

   ```terminal
   git remote add origin https://github.com/YOUR-USERNAME/store-inventory-practice.git
   git push -u origin HEAD
   ```

   `HEAD` means "the branch I am on now." `-u` remembers GitHub as this branch's upstream, so later you can type just `git pull`.

4. **If Git asks you to sign in:** on Windows, Git for Windows usually opens a browser sign-in through Git Credential Manager. Complete it in the browser. GitHub does **not** accept your account password typed into a terminal. If you are asked for a password in the terminal, stop and ask Copilot or your facilitator to help you authenticate with the GitHub CLI (`gh auth login`) instead. Never paste a token into chat.
5. **Verify:** open the repository on GitHub. You see your files, a **Private** label, and an **Actions** tab. Under **Actions**, the CI workflow ran for your push. Wait for a green check ✅.

## Step 3: Start the feature in its own session and branch

Each session in the Copilot app can run in its own **working tree**, a separate checkout on its own branch. That keeps the feature away from your main branch until you merge it.

1. In the sidebar, under **Projects**, click **+** next to your learner project to start a new session.
2. In the dropdown under the prompt box, choose **new working tree** as the location. Choose **Plan** mode.
3. **Copilot chat:**

   ```prompt
   Plan a small feature: above the list, show "Showing X of Y records", where Y
   is all records and X is the number currently visible after search and filter.
   The text must update as I type and be announced politely to screen readers.
   Add a test for a pure function that computes the label. Keep the plan to
   three steps and list the acceptance checks I should run in the browser.
   ```

4. Approve the plan and switch to **Interactive**. First ask Copilot to run `npm ci` in this session's working tree; a new working tree does not include `node_modules`. Then build the feature with the red → green loop from Lab 09.
5. **Verify** in the browser, using this session's own preview URL: with no search or filter, X and Y are equal and match the number of records you can count. Choose **Done**, and X drops to the number of Done records. A new working tree often uses a different port, so its browser storage may start again from the two sample records. That is expected.

## Step 4: Review locally before anyone else does

1. **Copilot chat:**

   ```prompt
   /review
   ```

2. Read each finding. For each one, decide: **fix**, **ask why**, or **ignore with a reason**. AI reviewers can be wrong in both directions: they miss real bugs and flag non-issues.
3. Then run a security-focused review:

   ```prompt
   /security-review
   ```

4. It returns findings with severity and confidence. A small local list app may have **no findings**. That is a good result, not a broken command. If something is reported, ask Copilot to explain the risk with a concrete example before fixing it.
5. Run all checks again: `npm test`, `npm run lint`, and `npm run build`. Commit with a clear message, such as `feat: show visible record count`.

> `/review` and `/security-review` need an active session that has changes. If either says there is nothing to review, make sure you are in the feature session and your changes exist.

## Step 5: Open a pull request

1. **Copilot chat:**

   ```prompt
   /pr-open
   ```

   If your version does not show `/pr-open`, ask: "Open a pull request from this session's branch into main. Write a description that lists what changed, how to test it, and which acceptance checks I ran."

2. **Read the PR description before you accept it.** It should say what changed, how to test it, and what was **not** tested. Edit anything that overstates. If your repository has a pull request template, the agent follows it.
3. Open **My work** in the sidebar. Your pull request appears there. Click it to see the summary, CI check results, and review activity. **Files changed** shows the diff.
4. **Verify:** CI runs on the pull request and finishes with a green check. This usually takes a few minutes.

## Step 6: Handle failing checks and review comments

Practice the repair loop on purpose. It is the most valuable part of this lab.

1. **Optional practice:** in the feature session, ask Copilot to change one test's expected label to a wrong value, commit, and push. CI turns red ❌.
2. In **My work**, open the pull request. At the bottom, check the CI status. Click **Fix failing checks**, or type:

   ```prompt
   /pr-fix-checks
   ```

3. **Watch what it changes.** The correct fix here is the **test** you broke on purpose. In real life, insist that Copilot explains the cause before it changes anything, and never accept "fixing" a failing check by deleting or skipping a test.
4. **Review comments:** on the **Files changed** tab, leave yourself one review comment, such as "Please use the word 'records' consistently." Then click **Fix** next to the comment, or type `/pr-resolve-comments`. Review the result like any other change.
5. **Verify:** the latest CI run on the pull request is green again.

## Step 7: Make the merge decision yourself

1. Before merging, answer these out loud:
   - Do all CI checks pass on the latest commit?
   - Did I run the acceptance checks myself in the browser?
   - Do I understand every file in **Files changed**?
   - Is anything in the PR that I did not ask for?
2. If all answers are good, merge on GitHub in your browser, or use `/pr-merge` in the session (it needs a mergeable pull request).
3. The app also offers **agent merge**, which lets the session fix blockers and merge as soon as GitHub allows. Do not use it for this lab. You want to practice the decision yourself.
4. Bring the merged work back to your main project. Stop any dev server running from that folder first. Then, in a terminal in your original project folder:

   ```terminal
   git switch main
   git pull
   npm ci
   npm test
   ```

5. **Verify:** `git log --oneline -3` shows the merged feature, and tests pass.

## Common issues

- **CI fails but everything passes on my computer:** read the first red line of the failed step on the **Actions** tab. Common causes: `package-lock.json` not committed; a file name that differs only by capital letters (Linux is case-sensitive, Windows usually is not); or a test that depends on your local data.
- **`npm ci` fails with `EPERM` or `EBUSY` on Windows:** a running dev server or another terminal is using files in `node_modules`. Stop it with **Ctrl+C**, then run `npm ci` again. Do not delete folders by hand.
- **The workflow never runs:** check that the file is exactly `.github/workflows/ci.yml` and was pushed. Check the branch name under `push:`. In some organizations, Actions must be enabled by an administrator.
- **`/pr-open` or My work is not available:** make sure the project is connected to the GitHub repository and you are signed in. Type `/` to see commands your version offers.
- **Push rejected:** someone (or another session) pushed first. Run `git pull`, rerun the tests, then push again. Ask Copilot to explain any merge conflict before resolving it.
- **I published the wrong folder:** on GitHub, open the repository's **Settings**, check the files, and delete the repository if needed. Then start Step 2 again from the right folder.

## Verification and summary

You are done when your private repository has a CI workflow, a merged pull request with a green check, and a PR description that accurately lists what was tested. You ran `/review` and `/security-review`, recovered from at least one red check, and merged the pull request yourself.

**What you learned:** branches keep work separate, CI checks every change on a clean machine, AI review is a helpful first pass, and the merge decision stays with a human.

**Source check:** 2026-10-02. App features follow GitHub's guides for [issues and pull requests in the app](https://docs.github.com/en/copilot/how-tos/github-copilot-app/managing-issues-and-pull-requests) (My work, Fix, Fix failing checks, Review, agent merge), [agent sessions](https://docs.github.com/en/copilot/how-tos/github-copilot-app/agent-sessions) (`/security-review`, working trees), and the [slash command reference](https://docs.github.com/en/copilot/reference/github-copilot-app-reference/slash-commands) (`/review`, `/pr-open`, `/pr-fix-checks`, `/pr-resolve-comments`, `/pr-merge`). The workflow uses `actions/checkout@v7` and `actions/setup-node@v7`, the current major versions on the source-check date. Its four commands were run locally; this course did **not** create a GitHub repository or run the workflow on GitHub.

**Next:** [Lab 12: Autopilot, parallel sessions, and sandboxing](lab-12-autopilot-and-parallel-sessions.md).
