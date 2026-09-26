# Vibe Coding Playbook

**Keep this page open while you build.** It collects the habits, prompts, and fixes from the labs in one place. You do not need to read it in order.

**Vibe coding** is a way of building software where an AI agent writes most of the code while you guide it and check the results. You are the person in charge. The AI is a fast helper that can be confidently wrong.

> **New here?** Start with the free lab: [Lab 00: set up your tools](lab-00-prerequisites.md). Come back to this playbook whenever you get stuck.

## The loop

Every good vibe coding session repeats the same six moves. Small loops are easier to check and easier to undo.

```diagram
  Plan  →  Ask for ONE small change  →  Look at it
   ↑                                        ↓
  Save  ←       Check it works        ←  Run it
```

1. **Plan:** decide the one thing you want next. Write down how you will know it works.
2. **Ask:** request one small change, not a whole app.
3. **Look:** read Copilot's summary and open **Changes** to see which files moved.
4. **Run:** open the app in your browser.
5. **Check:** try the normal case, then try a wrong input on purpose.
6. **Save:** make a local Git commit so you can return to this point later.

## Before your first prompt

- ✅ **Pick one small goal.** "A list of notebooks I can add to" is small. "An online store" is not.
- ✅ **Use made-up data.** Never use real customer, patient, or financial information.
- ✅ **Know where your work lives.** Check the folder shown for your session before you approve any change.
- ✅ **Choose the right mode.** Use **Plan** to think things through. Use **Interactive** to build one step at a time. Skip **Autopilot** until you are comfortable reviewing changes.

## A good request has four parts

Before you press Enter, check that your message says:

| Part | Question it answers | Example |
| --- | --- | --- |
| **What** | What should change? | "Add a Status filter" |
| **Where** | Which screen or file? | "on the main list page" |
| **Check** | How will we know it works? | "Choosing Done shows only Done items" |
| **Limits** | What must not change? | "Do not add new packages or change other features" |

## Six prompts worth reusing

Copy these into Copilot chat. Replace the words in `[brackets]`.

**1. Plan before building.** Use **Plan** mode.

```prompt
I want to build [one small goal]. Before writing any code, give me a short plan with no more than four steps. For each step, tell me how I can check it worked in the browser. Ask me questions if anything is unclear.
```

**2. One small change with a check.** Use **Interactive** mode.

```prompt
Do only step [number] of the plan: [describe it]. Do not change anything else. When you finish, tell me which files changed and exactly what I should click to test it.
```

**3. Explain before you change.**

```prompt
Before you change anything, explain in plain English what you are about to do and why. Wait for me to say "go ahead".
```

**4. Fix an error.** Paste the full error message, not a summary.

```prompt
I see this error when I [what you did]:

[paste the full error]

First, explain what probably caused it in one or two sentences. Then suggest the smallest fix. Do not change unrelated code.
```

**5. Review what changed.**

```prompt
Summarize every change since my last commit. List each file, what changed, and anything that might break. Point out anything I did not ask for.
```

**6. Get back on track.**

```prompt
Stop making changes. Summarize what we have built so far, what still does not work, and the single next step you recommend.
```

## How to review the AI's work

You do not need to understand every line of code. You do need to check the result.

1. **Read the summary.** Does it match what you asked for?
2. **Open Changes.** Did it only touch files you expected? A surprise file is a reason to ask "why did you change this?"
3. **Run the app.** Use the actual address shown in the terminal, such as `http://localhost:5173/`.
4. **Try the happy path.** Do the normal thing a user would do.
5. **Try to break it.** Leave a field blank. Type only spaces. Refresh the page.
6. **Ask one hard question.** "What could go wrong with this change?"

✅ If everything checks out, save a commit. ❌ If not, describe what you saw and ask for a fix. Do not save broken work as a checkpoint.

## When you get stuck

| What is happening | Try this |
| --- | --- |
| The AI keeps changing things you did not ask for | Say "Stop." Ask it to list its recent changes and undo the ones you did not request. Then ask again with clearer **Limits**. |
| The same error comes back after two or three tries | Paste the full error. Ask for the cause first, not a fix. If it still loops, start a new session and paste a short summary of the goal. |
| The browser shows a blank page | Look at the terminal for red text. Also open the browser's developer tools (F12 on Windows, Option+Command+I on Mac) and copy the error from the **Console** tab. |
| The page will not open at all | Check that the dev server is still running in a terminal. Use the address it prints; the port number can change. |
| One request became a huge change | Ask it to split the work into smaller steps and do only the first one. |
| You are lost and nothing makes sense | Use prompt 6 above. Then compare its summary with your plan. |
| Everything was working a few minutes ago | Ask: "Show me the changes since my last commit and help me decide whether to undo them." Review before approving any undo command. |

> **Tip:** Being stuck is normal. Professional developers get stuck every day. The skill is making the problem smaller, not avoiding it.

## Safety rules

These rules protect you, your computer, and other people. Follow them every time.

- ⚠️ **Read every command before you approve it.** If you do not know what it does, choose deny and ask Copilot to explain it.
- ⚠️ **Never paste secrets.** Passwords, API keys, and access tokens do not belong in chat, code, or screenshots.
- ⚠️ **Stay inside your project folder.** Do not approve deleting or moving files anywhere else.
- ⚠️ **Do not turn on blanket approval.** Approving one command at a time is how you stay in control.
- ⚠️ **Do not publish yet.** Keep beginner apps on your own computer until someone experienced reviews them.
- ⚠️ **Check facts.** The AI can sound sure and still be wrong. Your tests are the proof, not its confidence.

## Your learning path

**Core lab (free, about 60–90 minutes after setup):**

1. [Set up your tools](lab-00-prerequisites.md)
2. [Plan a small app](lab-01-plan.md)
3. [Build it one feature at a time](lab-02-build.md)
4. [Test it and save your work](lab-03-test-and-save.md)
5. [Explain what you built](lab-04-completion.md)

**Optional next steps:**

- [Choose one improvement](lab-05-next-steps.md)
- [Teach Copilot your project rules and make a reusable skill](lab-06-instructions-and-skills.md)
- [Connect a read-only documentation tool with MCP](lab-07-mcp.md)

**More help:**

- Look up unfamiliar words in the [plain-English glossary](../GLOSSARY.md).
- Read GitHub's [Copilot app quickstart](https://docs.github.com/en/copilot/get-started/quickstart-copilot-app) for the official setup steps.
