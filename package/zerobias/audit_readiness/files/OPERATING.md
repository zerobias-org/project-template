# Operating ${projectName}

This file is for the AI agent that helps you run this project. Give it this file, or tell your agent to download and read it.

| | |
|---|---|
| Project | ${projectName} |
| Project id | `${projectId}` |
| Made from template | Compliance audit readiness project (`@zerobias-org/project-template-zerobias-audit_readiness`) |
| Skill that operates it | `audit-readiness`, in the Documents folder `Skills` as `audit-readiness-SKILL.md` |

## How the project works

| Work | Board | Activity | Document |
|---|---|---|---|
| A gap and its remediation | Gaps & Remediation (the default board) | `task`, one per gap, under the gap analysis task | |
| Collecting evidence for a control | Evidence | `task`, one per control or evidence item | `Evidence/<control-id>/` |
| A request from the auditor | Auditor Requests | `task`, one per request | `Auditor Requests/<request-id>/` |
| Scope, period, firm and other decisions | Decisions & Questions | `pmDecision`, `pmQuestion` | `Scope/scope.md`, `Scope/audit-calendar.md` |

- **Notes notebooks:** Status updates, Auditor meetings, Walkthrough notes.
- **Documents folders:** Scope, Policies, Evidence, Auditor Requests, Reports, Archive, Skills. This file is in the Documents root.
- **Starter files:** `Scope/scope.md`, `Scope/audit-calendar.md`.
- **Starter tasks:** `Confirm the audit scope and period`, `Choose the audit firm`, `Gap analysis: ${projectName}`, `Schedule the auditor kickoff`.

People can change the boards, notebooks and folders after the project exists. Read the live project before you act. Do not trust this list.

## 1. Give your agent ZeroBias access

The skill uses the ZeroBias API through the ZeroBias MCP server.

1. Get an API key in ZeroBias: open your user menu and select **Manage My API Keys**.
2. Put the key in your shell profile, for example `~/.zshrc`:

   ```bash
   export ZB_TOKEN="<your API key>"
   ```

3. Add the ZeroBias package registry to `~/.npmrc`:

   ```ini
   @zerobias-com:registry=https://pkg.zerobias.org
   @zerobias-org:registry=https://pkg.zerobias.org
   //pkg.zerobias.org/:_authToken=${ZB_TOKEN}
   ```

4. Install the server and set it up:

   ```bash
   npm install -g @zerobias-com/zerobias-mcp
   zb setup        # URL, API key, org, profile name
   zb status       # check the connection
   ```

5. Register the server with Claude Code:

   ```bash
   claude mcp add -s user zerobias zb
   ```

The server runs on Linux, macOS, and Windows through WSL.

## 2. Install the skill

1. In this project's Documents, open the folder `Skills`.
2. Download `audit-readiness-SKILL.md`.
3. Save it as `.claude/skills/audit-readiness/SKILL.md` in your working folder.

The skill is a copy made when the project was created. A newer copy is at
https://github.com/zerobias-org/project-template/blob/main/package/zerobias/audit_readiness/files/skills/audit-readiness/SKILL.md

## 3. Start

Ask your agent, for example:

- "Fill in the scope for ${projectName}: SOC 2 Type II, security and availability, period ..."
- "Run the gap analysis for the access control criteria."
- "Show me the open auditor requests and who owns them."
- "Post a status update for this week."

The agent uses the project id above. It acts with your API key, so it can do only what your ZeroBias role allows.
