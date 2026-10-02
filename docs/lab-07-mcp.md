# Lab 07: Connect one documentation MCP server

**Time:** 15–25 minutes. **Prerequisite:** a working local Copilot session, the permission boundaries from [Lab 00](lab-00-prerequisites.md), and preferably the completed core app. This extension is optional; you can read it without finishing the core checklist.

## What you will learn

- Explain what MCP adds, and what it does not add.
- Connect one public, read-only documentation source.
- Observe a real tool call and check its citations.
- Remove your practice connection without damaging other settings.

## Before you start

**MCP** means **Model Context Protocol**: a standard way for an AI app to call tools provided by another program. An MCP server is the program offering those tools. Some run on your computer; others are remote services reached over the internet.

This lab uses **Microsoft Learn MCP**, a public documentation service. It lets Copilot search and fetch Microsoft documentation. It does **not** connect your generated app to Microsoft 365, read your company's records, or provision cloud resources. It is a suitable first connection because it needs no authentication and the server itself has no usage charge. Your Copilot/model plan still has its own limits or costs.

**Data boundary:** only send public documentation questions. Even a read-only service receives the query you send. Do not include repository source code, private file paths, customer records, secrets, or internal business context. Read [Microsoft Learn's terms](https://learn.microsoft.com/en-us/legal/termsofuse).

## Step 1: Understand the connection before adding it

1. Open the [official Microsoft Learn MCP overview](https://learn.microsoft.com/en-us/training/support/mcp). Confirm the endpoint is still the address below, the transport is Streamable HTTP, and the authentication/pricing statements still match.
2. **HTTP** is the network method used here; **Streamable HTTP** is the MCP connection type. Choose **HTTP** (it may be labeled **Streamable HTTP**), not a local command or the older SSE transport.
3. **Do not test the URL in a browser.** Opening it directly shows **405 Method Not Allowed**. That is normal: the address expects an MCP client such as Copilot, not a web page.
4. Review these settings:

   | Setting | Value for this exercise |
   | --- | --- |
   | Server name | `learn-docs-practice` |
   | Type / transport | `http` / Streamable HTTP |
   | URL | `https://learn.microsoft.com/api/mcp` |
   | Authentication / headers | None; no API key or token |
   | Tools | `microsoft_docs_search`, `microsoft_docs_fetch` |

5. The server may also list a third tool, `microsoft_code_sample_search`. That is expected. This exercise uses only the two documentation tools above, so leave the third one off if your app lets you choose.
6. **Expected:** you can explain that this gives the **AI assistant** a documentation tool. It does not add an API to your React app, and it is not proof the assistant will always use the tool.
7. An organization can restrict available MCP servers. If this endpoint is blocked, ask for approval or use the manual-documentation alternative below. Do not bypass a registry or allowlist policy.

## Step 2: Add the connection in the desktop app

1. In the **GitHub Copilot desktop app**, choose **Customize** in the sidebar, then **MCP**.
2. Choose the option to add a **custom server**. Use the values from Step 1. Control labels can differ by build; do not select a similarly named server without inspecting its URL.
3. Review the scope before saving. If the UI offers project scope, select only your learner project. If it only offers a personal/user connection, it may be available to other projects too. Use the repository-only alternative below if you do not want that.
4. Select HTTP, enter the exact HTTPS URL, and leave authentication and headers empty. If the UI lets you select tools, enable only the two documentation tools listed above. Tool exposure is not a substitute for approving individual calls.
5. Follow the displayed save/install prompts. **Installed** is the desktop view for managing existing servers. Confirm the saved name, URL, scope, and available tools there.
6. Do not install Docker, an npm server package, or a VS Code extension for this remote connection. If a prompt asks for a token, password, subscription, or shell installation, pause: this is not the expected Learn setup.

### Repository-only alternative if the form does not fit your build

1. Use **one route only**. Skip this alternative if the UI connection already works. Otherwise, inspect the actual learner repository for existing `.mcp.json` or `.github\mcp.json` configuration first.
2. Ask Copilot to create `.github\mcp.json` **only in your learner repository**, using the content below, after showing the existing file and waiting for your approval. If the file exists, merge the named entry under its existing `mcpServers` object instead of replacing other entries.

   ```json
   {
     "mcpServers": {
       "learn-docs-practice": {
         "type": "http",
         "url": "https://learn.microsoft.com/api/mcp",
         "tools": ["microsoft_docs_search", "microsoft_docs_fetch"]
       }
     }
   }
   ```

3. **Expected:** valid JSON, no secrets, and no changes to other servers. `.mcp.json` may take precedence over `.github\mcp.json`; ask your facilitator to resolve a conflicting definition instead of deleting it.
4. Review any folder/server trust prompt, then use `/restart-session` in the active desktop chat to restart the session with its history. Recheck the connection and tools before proceeding.
5. This file format comes from the CLI configuration reference, which the desktop customization guide explicitly links and shares. You do **not** need to install or run the CLI. VS Code's `.vscode\mcp.json` uses a different format; do not paste its `servers` wrapper here.
6. A project file stays with the project and can be committed only after review. Other collaborators must independently trust and approve the connection. Do not change home-directory configuration for this repository-only route.

## Step 3: Observe a real documentation tool call

1. Return to the learner session in **Interactive** mode. Send this public question:

   ```prompt
   Use learn-docs-practice's microsoft_docs_search tool to find the official
   Microsoft Learn MCP server overview. Then use microsoft_docs_fetch on the
   returned Learn article to check the connection requirements.
   Explain its transport, authentication requirement, and server pricing.
   Include the source URL and distinguish server cost from Copilot plan usage.
   Do not send local files or private project details. Do not use other servers.
   If these tools are unavailable or fail, say NOT VERIFIED instead of
   answering from memory or silently falling back to another source.
   ```

2. Review the requested server/tool and query before approving. The request should contain a public documentation question, not source code, local paths, or account credentials.
3. **Verify in the transcript:** the documentation search tool actually ran, then the fetch tool returned an article. A message saying “I searched” without a tool result is insufficient.
4. **Expected according to the current official overview:** Streamable HTTP; no authentication required; no charge for the Learn MCP server. Copilot/model usage is separate. If the live documentation differs, record the difference and use the source rather than forcing this expected answer.
5. Record server name, tool names, date, returned URL, and the supported claims. Do not record tokens or private data. The learning portal does not automatically receive these tool results.

## Step 4: Check the citation yourself

1. Open the returned `https://learn.microsoft.com/` article in your browser. Check the domain and article title before trusting it.
2. Find the sections covering transport, requirements, and pricing. Compare them with the answer, not just with the presence of a link.
3. **Verify:** every important claim is supported by that article. A citation can be real while the sentence attached to it is wrong.
4. Ask one deliberately out-of-scope question:

   ```prompt
   Can this public documentation connection tell me my company's private
   inventory records? Do not call any tools or access local files.
   Explain the boundary; do not invent records or request credentials.
   ```

5. **Expected:** no private inventory access and no fabricated records. This is a comprehension check, not proof that all your other connected tools are read-only.

## Step 5: Remove only your practice connection

1. For the **UI route**, open **Customize → Installed**, locate the exact **learn-docs-practice** entry, and use its disable/remove control after reviewing the scope. Labels vary; leave unrelated servers alone.
2. For the **repository-file route**, ask Copilot to remove only the `learn-docs-practice` entry from the file you added. Review the diff. Keep existing server entries and valid JSON; do not delete the whole `.github` folder or a shared config file.
3. Restart the session with `/restart-session` if needed, then inspect the available server/tools again.
4. **Verify:** the practice server is disabled or absent. Ask Copilot to list available tools without running them; do not accept another successful tool call under the removed server's name.
5. The local app should still run as before. Removing this AI tool connection does not remove your React app, its sample records, or its local commit.
6. A session restart may stop a preview server that the session was running. If the preview no longer loads, run `npm run dev` in the same learner workspace and reopen its printed Local URL. Do not scaffold the app again.

## Common issues and troubleshooting

| Symptom | What it means / what to do |
| --- | --- |
| Opening the endpoint in a browser gives 405 Method Not Allowed | The endpoint expects an MCP client, not a normal browser page. Open the overview article to read; verify connectivity through a tool call |
| Server is absent or has no tools | Check exact URL/type, project scope, trust, policy, and conflicting config; restart the session after a file change |
| A request asks for an API key or Microsoft login | Stop and check the server identity. This public Learn endpoint requires neither |
| Copilot answers without a tool call | Ask it to use the named tool and show the result; otherwise label the answer NOT VERIFIED |
| Network timeout or rate limit | Wait and retry once, then use the manual route. Do not disable TLS checks or firewalls |
| Instructions mention `/mcp add` or Ctrl+S in a terminal form | Those are CLI instructions. Use desktop Customize or the shared project-file route above; do not switch products mid-lab |

**Manual alternative:** open the official Learn overview in your browser, read its requirements, and give Copilot only a short public excerpt or URL. Label the outcome **manual source check; MCP not connected**. You can complete the core app without MCP, but this is not a successful MCP connection test.

## Verification and summary

Record: configured server/scope, real search and fetch results, independently checked citations, the privacy-boundary answer, and removal evidence. A configured icon is not a finished connection test. Failed, blocked, or unrun steps remain **NOT VERIFIED**.

Use the matching **Optional checkpoints** and **Evidence and recovery** area in the portal, then **Download evidence**. Leave the MCP checks unchecked if you used the manual alternative or could not confirm removal.

**Source check:** 2026-09-26. Sources: [desktop customization](https://docs.github.com/en/copilot/how-tos/github-copilot-app/customize-github-copilot-app), [shared configuration and tool filtering](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers), [Learn overview](https://learn.microsoft.com/en-us/training/support/mcp), and [Learn developer reference](https://learn.microsoft.com/en-us/training/support/mcp-developer-reference). Tool lists can change; inspect the live discovered tools. Desktop install/trust controls still need to be checked on your app version.

**Next:** continue Level 2 with [Lab 08: Write a spec and manage context](lab-08-specs-and-context.md), return to [Lab 05](lab-05-next-steps.md) for one small extension, or stop with your saved core app and evidence.
