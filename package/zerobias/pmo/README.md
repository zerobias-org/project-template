# PMO project

A project template for running a product the PMO way: specs and stories, decisions and open questions, mockups,
and risks and dependencies, each on its own board, with notebooks for status updates and meeting notes.

A project made from it is a `coordination_program` with an `evergreen` lifecycle: it keeps running, and other
projects can sit under it.

## What the project starts with

| Part | What you get |
|---|---|
| Boards | **Specs & Stories** (the default board): specs, stories, releases and tasks. **Decisions & Questions**: open questions, decisions, research and tasks. **Mockups** and **Risks & Dependencies**: tasks |
| Notes | The notebooks Status updates, Meeting notes and Items |
| Documents | The folders Specs, Mockups, Reviews, Diagrams, Meetings, Archive and Skills |
| Starter files | `OPERATING.md` in the Documents root, and the `pmo-project` skill as `Skills/pmo-project-SKILL.md` |
| Starter task | `Spec: <project name>` on Specs & Stories: the product spec. Feature specs are its subtasks |

You can change the boards, notebooks and folders after the project exists. The project type and lifecycle never
change.

## Working with an AI agent

`OPERATING.md` tells your AI agent which template made the project and how to reach it through the ZeroBias MCP
server. The `pmo-project` skill lets the agent operate the project: read and add work on the boards, move tasks
through their statuses, write meeting notes and status updates, and file documents. To use it, copy
`Documents/Skills/pmo-project-SKILL.md` to `.claude/skills/pmo-project/SKILL.md` in your working folder.

## Requirements

The boards use the Product Management activities (`pmSpec`, `pmStory`, `pmRelease`, `pmQuestion`, `pmDecision`,
`pmResearch`) and `task`, which the platform's workflow content provides on every environment.
