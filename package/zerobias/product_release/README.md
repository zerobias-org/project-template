# Product release

Ship one release of a product: freeze the scope, build and test, write the release notes, and launch.

A project made from it is a `phase` with a `fixed-term` lifecycle. Create it under the product's project (`parentId`), so the release sits in the product's tree. It ends when the release ships.

## What the project starts with

| Part | What you get |
|---|---|
| Boards | **Release** (the default board): `pmRelease`, `pmStory`, `task`. **Launch**: `task`. **Decisions & Questions**: `pmQuestion`, `pmDecision`, `task`. |
| Notes | The notebooks Release meetings and Status updates |
| Documents | The folders Release Notes, Test Results, Launch, Archive and Skills |
| Starter files | `OPERATING.md` in the Documents root; `Release Notes/CHANGELOG.md`; `Skills/product-release-SKILL.md` (the `product-release` skill) |
| Starter tasks | `Release: <project name>`; `Freeze the release scope`; `Write the release notes`; `Launch review` |

The product's specs and backlog stay in the product's project. The release project holds only the work of this release. `CHANGELOG.md` follows the [Keep a Changelog](https://keepachangelog.com/) format.

You can change the boards, notebooks and folders after the project exists. The project type and lifecycle never
change.

## Working with an AI agent

`OPERATING.md` tells your AI agent which template made the project, how the project is organized, and how to reach it
through the ZeroBias MCP server. The `product-release` skill lets the agent do the work through the ZeroBias API. To use it,
copy `Documents/Skills/product-release-SKILL.md` to `.claude/skills/product-release/SKILL.md` in your working folder.

## Requirements

The boards use the activities `pmDecision`, `pmQuestion`, `pmRelease`, `pmStory`, `task`. The Product Management activities and `task`
are on every environment.

A `phase` project needs a parent: create it under a `product` or a `coordination_program` project.
