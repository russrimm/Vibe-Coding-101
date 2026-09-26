# Lab 04: Explain what you built

**Time:** 5–10 minutes. **Prerequisite:** all required setup, build, and testing checks are complete.

## What you will learn

- Describe your result with evidence rather than claims.
- Explain the limits of a local prototype.
- Find your saved work later.

## Step 1: Give a two-minute demonstration

1. Open **Store Inventory Practice** at the actual local preview URL.
2. Show the sample list, rejected blank input, status change, combined search/filter, and a successful refresh.
3. Show your two successful command results and the local commit ID. If you closed that terminal, ask Copilot to run `git log -1 --oneline` in your learner workspace. **Expected:** one line that starts with a short commit ID, followed by your commit message.
4. Explain one change you reviewed or one problem you fixed. If no fix was needed, describe why the empty-name test matters.

## Step 2: Describe completion honestly

1. Say: “I used the GitHub Copilot desktop app to plan, build, preview, verify, and save a local prototype.”
2. Say: “I personally reported the checklist results. The learning portal did not inspect my generated app.”
3. Do not describe this as deployed, secure for real business data, production-ready, certified, or proven compliant. It has not had those reviews.
4. If any reported check turns out to be wrong, return to that stage and uncheck it. Fix and repeat the check before treating it as complete.

## Step 3: Keep enough information to return

1. Record the desktop project/session name, actual workspace path, branch, commit ID, and preview origin.
2. Record how to restart: reopen that session and run `npm run dev` there. Follow the newly printed URL.
3. Understand the difference:
   - **Files** are your app's source code.
   - **A commit** is a local code snapshot, not an off-device backup.
   - **localStorage** holds the app's sample records in one browser/origin, not inside Git.
   - **Portal progress** is a separate browser record of your own checks.
4. Do not delete a worktree session until you have preserved its work intentionally.

## Verification and summary

You have completed a beginner **learning exercise based on your reported local checks**. Your prototype uses fictional data and is not publicly deployed. That is a complete core-lab outcome.

## Common issues

- **Someone else cannot open your URL:** localhost refers to their computer, not yours. Share a demonstration or approved screenshot rather than exposing your dev server.
- **Records disappear in another browser:** browser storage is not shared. Return to the original profile and origin.

**Next, only if you want:** [Lab 05: Optional next steps](lab-05-next-steps.md). No extension is required to finish the core lab.
