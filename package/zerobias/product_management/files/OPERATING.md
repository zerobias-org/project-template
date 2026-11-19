# Operating ${projectName}

This file is for the AI agent that helps you run this project. Give it this file, or tell your agent to download and read it.

| | |
|---|---|
| Project | ${projectName} |
| Project id | `${projectId}` |
| Made from template | Product Management project (`@zerobias-org/project-template-zerobias-product_management`) |
| Skill that operates it | `product-management-project`, in the Documents folder `Skills` as `product-management-project-SKILL.md` |

## What the project has

- **Boards:** Specs & Stories (the default board), Decisions & Questions, Mockups, Risks & Dependencies.
- **Activities:** Specs & Stories allows `pmSpec`, `pmStory`, `pmRelease` and `task`. Decisions & Questions allows `pmQuestion`, `pmDecision`, `pmResearch` and `task`. Mockups and Risks & Dependencies allow `task`.
- **Notes notebooks:** Status updates, Meeting notes, Items.
- **Documents folders:** Specs, Mockups, Reviews, Diagrams, Meetings, Archive, Skills. This file is in the Documents root.
- **Starter task:** `Spec: ${projectName}` on Specs & Stories. Feature specs are its subtasks.
- **Sub-projects:** other products can sit under this product. A release can be a `phase` project under it.

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
2. Download `product-management-project-SKILL.md`.
3. Save it as `.claude/skills/product-management-project/SKILL.md` in your working folder.

The skill is a copy made when the project was created. A newer copy is at
https://github.com/zerobias-org/project-template/blob/main/package/zerobias/product_management/files/skills/product-management-project/SKILL.md

## 3. Start

Ask your agent, for example:

- "Show me the open specs and stories in ${projectName}."
- "Record the decision we made today on the Decisions & Questions board."
- "Write today's meeting notes into the Meeting notes notebook."
- "Post a status update for this week."

The agent uses the project id above. It acts with your API key, so it can do only what your ZeroBias role allows.
