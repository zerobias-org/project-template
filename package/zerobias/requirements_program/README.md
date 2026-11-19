# Requirements program

A program defines the requirements for one area, such as security, accessibility or data handling, and measures projects against them. The program owns the requirements. The projects it measures stay separate projects.

A project made from it is a `program` with an `evergreen` lifecycle, so it shows in the Programs App and keeps running.

## What the project starts with

| Part | What you get |
|---|---|
| Boards | **Requirements** (the default board): `pmSpec`, `pmQuestion`, `task`. **Decisions & Questions**: `pmQuestion`, `pmDecision`, `pmResearch`, `task`. **Conformance**: `task`, `pmQuestion`. |
| Notes | The notebooks Program meetings and Status updates |
| Documents | The folders Requirements, Guidance, Conformance Reports, Exceptions, Archive and Skills |
| Starter files | `OPERATING.md` in the Documents root; `Requirements/requirements.md`; `Conformance Reports/conformance-report-template.md`; `Skills/requirements-program-SKILL.md` (the `requirements-program` skill) |
| Starter tasks | `Charter: <project name>`; `Requirements baseline: <project name>`; `Choose the first projects to measure` |

Each requirement has an id, such as `REQ-001`, that never changes. A conformance task per measured project records whether the project meets each requirement. An exception is a `pmDecision` with an end date.

You can change the boards, notebooks and folders after the project exists. The project type and lifecycle never
change.

## Working with an AI agent

`OPERATING.md` tells your AI agent which template made the project, how the project is organized, and how to reach it
through the ZeroBias MCP server. The `requirements-program` skill lets the agent do the work through the ZeroBias API. To use it,
copy `Documents/Skills/requirements-program-SKILL.md` to `.claude/skills/requirements-program/SKILL.md` in your working folder.

## Requirements

The boards use the activities `pmDecision`, `pmQuestion`, `pmResearch`, `pmSpec`, `task`. The Product Management activities and `task`
are on every environment.
