# Lab 08: Write a spec and manage context

**Time:** 30–40 minutes. **Prerequisite:** your saved core app from [Lab 03](lab-03-test-and-save.md). [Lab 06](lab-06-instructions-and-skills.md) is recommended but not required.

## What you will learn

- Turn a vague idea into a short written **spec** with checkable acceptance criteria.
- Give Copilot the right files as context instead of "the whole project."
- Check how full a session is and shrink it when it gets crowded.
- Get a second opinion on a plan **before** any code is written.

## Before you start

In Level 1 you typed each request into chat. That works for tiny changes, but chat messages scroll away. A **spec** is a small Markdown file in your project that says what a feature must do. It stays in the project, so every new session can read the same rules.

**Context** is everything the AI can see while it works: your messages, files you attach, command output, and its own replies. A model can only hold a limited amount at once, called its **context window**. More context is not always better. The right two files beat twenty random ones.

In this lab you write a spec for one new feature: **rename a record**. You will build it in [Lab 09](lab-09-tests-as-guardrails.md).

Open your learner project in the **GitHub Copilot desktop app**. Make sure your last commit is saved:

```terminal
git status --short
git log -1 --oneline
```

**Expected:** `git status --short` prints nothing, and `git log` shows your last commit. If files are listed, finish or commit that work first.

## Step 1: Brainstorm in a chat, not a session

The app has two kinds of conversations. A **session** works in your project and can change files. A **chat** (under **Chats** in the sidebar) is for questions and ideas. It does not create a branch or a working tree.

1. In the sidebar, open **Chats** and start a new chat.
2. **Copilot chat:**

   ```prompt
   I have a small React app called Store Inventory Practice. Each record has
   an id, a name, and a status (New, In progress, or Done). I want to add a way
   to rename a record. Do not write code. Instead, ask me up to five questions
   that a careful developer would ask before building this. Include questions
   about bad input, keyboard users, and what should happen if I change my mind.
   ```

3. Answer the questions in your own words. Short answers are fine.
4. **Verify:** Copilot asked about at least empty names, very long names, and canceling. If it started writing code, say: "Stop. Questions only."

> **Why a chat first?** Thinking out loud in a chat costs nothing and changes no files. You arrive at the session with clear answers instead of discovering them halfway through a build.

## Step 2: Write the spec file

1. Open your learner project's **session** (not the chat). Choose **Interactive** mode.
2. **Copilot chat:**

   ```prompt
   Create one new file: docs/spec-rename-record.md. Do not change any other file.
   Use these headings: Goal, Rules, Out of scope, Acceptance checks.
   Goal: let me rename a record from the list.
   Rules: a name is required after trimming spaces; names are 40 characters
   or fewer after trimming; renaming keeps the record's id and status;
   the rename can be saved with Enter and canceled with Escape or a Cancel button;
   errors are shown next to the field and announced to screen readers;
   the new name is saved in localStorage like other changes.
   Out of scope: deleting records, undo history, bulk rename.
   Acceptance checks: write each as Given / When / Then that I can check in the browser.
   Show me the file when you are done.
   ```

3. Read the file. It should look roughly like this. Your wording will differ.

   ```markdown
   # Spec: rename a record

   ## Goal
   Let me rename one record from the list.

   ## Rules
   - A name is required after trimming spaces.
   - A name is 40 characters or fewer after trimming.
   - Renaming keeps the record's id and status.
   - Enter saves. Escape or Cancel closes without saving.
   - Errors appear next to the field and are announced to screen readers.
   - The new name is saved in localStorage.

   ## Out of scope
   Deleting records, undo history, bulk rename.

   ## Acceptance checks
   1. Given "Notebook pack", when I rename it to "Spiral notebook" and press Enter,
      then the list shows "Spiral notebook" with its old status.
   2. Given the rename field, when I save only spaces, then I see an error and the
      old name stays.
   3. Given the rename field, when I type 41 characters and save, then I see
      "Use 40 characters or fewer." and the old name stays.
   4. Given the rename field, when I press Escape, then the old name stays.
   5. Given a renamed record, when I refresh the page, then the new name is still there.
   ```

4. **Verify:** every rule has at least one acceptance check, and every check describes something you can **see**. "The code is clean" is not checkable. "The old name stays" is.
5. If a rule is missing a check, ask: "Add an acceptance check for the rule about [rule]."

> **Also add the 40-character rule to Add.** The same name rules should apply when you add a record. Ask Copilot to add one line under Rules: "The Add form uses the same name rules." Consistent rules mean one tested function can serve both forms.

## Step 3: Plan against the spec, with the right files attached

1. Switch to **Plan** mode. You can type `/plan` in the prompt box or use the mode dropdown below it.
2. In the prompt box, type `@` and choose `docs/spec-rename-record.md` from the file list. Type `@` again and choose the main app file, usually `src/App.tsx`. Attached files are added to the session's context.
3. **Copilot chat** (after the two attachments):

   ```prompt
   Using only the attached spec and app file, plan how to build rename.
   Keep the plan to five steps or fewer. For each step, name the files that
   would change and which acceptance check it satisfies.
   Point out anything in the spec that is unclear or contradicts the current app.
   Do not change files yet.
   ```

4. **Verify:** the plan names real files, maps each step to an acceptance check, and does not add features from **Out of scope**. If it proposes a new library for a small form, ask why and request a no-new-package option.

## Step 4: Get a second opinion before you build

The app includes a built-in **rubber duck** agent. It reviews your plan using a **different model** from the one driving your session. Two models disagreeing is a cheap way to find gaps.

1. **Copilot chat:**

   ```prompt
   /rubber-duck Critique the rename plan against docs/spec-rename-record.md.
   Look for missing acceptance checks, accessibility gaps, and ways the
   saved data could become invalid. Rank issues by how likely they are to cause a bug.
   ```

2. Read the critique. You decide which points matter. A critique is advice, not an order.
3. If a point is real, update the spec first, then the plan. **The spec is the source of truth.** For example, a common real finding is "What happens if the stored data already contains a 50-character name?"
4. **Verify:** you either changed the spec, or you can explain in one sentence why you did not.

## Step 5: Check and manage context

1. **Copilot chat:**

   ```prompt
   /context
   ```

2. **Expected:** a breakdown of how much of the session's context is in use. Exact numbers and layout vary by model and app version.
3. Long sessions slowly fill up. Signs include Copilot forgetting an earlier decision or repeating old mistakes. You have three options:

| Option | What it does | Use it when |
| --- | --- | --- |
| `/compact` | Summarizes earlier parts of this conversation | The session is long but still on track |
| New session + attach the spec | Starts fresh; the spec file carries the decisions | The session went in circles or picked up wrong ideas |
| `/clear` | Clears the transcript and starts fresh in the same place | You want a clean slate and the spec is already saved |

4. ⚠️ `/clear` removes the conversation, not your files. Make sure everything important is in the spec or a commit first.

> **This is why specs matter.** Chat history is temporary. A committed spec file survives `/clear`, new sessions, teammates, and next month.

## Step 6: Commit the spec on its own

1. Ask Copilot to show the changes, or click **Changes**. Only `docs/spec-rename-record.md` should be new.
2. **Copilot chat:**

   ```prompt
   Show git status. If the only change is docs/spec-rename-record.md, stage only
   that file, show the staged diff, and wait for my approval before committing
   with the message "docs: add rename spec". Do not push.
   ```

3. Approve the commit after reading the diff.
4. **Verify:**

   ```terminal
   git log -1 --oneline
   ```

   **Expected:** your newest commit says `docs: add rename spec`.

## Common issues

- **`@` does not show my file:** check that the session's workspace is your learner project. A file outside the project will not appear. You can also use `/attach-files`.
- **The plan ignores the spec:** say "Re-read the attached spec. List each rule and say which plan step covers it."
- **The rubber duck and the main agent disagree:** good. Ask each to explain with a concrete example, then decide yourself.
- **`/rubber-duck` is not available:** type `/` and check the list. Commands vary by app version. Ask for a self-critique instead: "List the three weakest parts of this plan."
- **The spec keeps growing:** move extras to **Out of scope**. A spec for one feature should fit on one screen.

## Verification and summary

You are done when your learner repository has a committed `docs/spec-rename-record.md` with rules, out-of-scope items, and acceptance checks you can run yourself, and you can name one change you made because of the critique.

**What you learned:** a spec turns "make rename work" into checks anyone can verify. Attaching the right files keeps context focused, and a second model is a cheap reviewer.

**Source check:** 2026-10-02. Features follow GitHub's [agent sessions guide](https://docs.github.com/en/copilot/how-tos/github-copilot-app/agent-sessions) (chats, `@` files, session modes, rubber duck) and [slash command reference](https://docs.github.com/en/copilot/reference/github-copilot-app-reference/slash-commands) (`/plan`, `/context`, `/compact`, `/clear`, `/rubber-duck`). Labels can change between app versions; type `/` to see what your version offers.

**Next:** [Lab 09: Use tests as guardrails](lab-09-tests-as-guardrails.md).
