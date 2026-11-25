# Compliance audit readiness project

Prepare for one external audit against one framework, such as SOC 2 or ISO 27001, from the gap analysis to the auditor fieldwork.

A project made from it is an `assessment` with a `fixed-term` lifecycle: it ends when the audit report is issued. Make a new project for the next audit period.

## What the project starts with

| Part | What you get |
|---|---|
| Boards | **Gaps & Remediation** (the default board): `task`. **Evidence**: `task`. **Auditor Requests**: `task`. **Decisions & Questions**: `pmQuestion`, `pmDecision`, `task`. |
| Notes | The notebooks Status updates, Auditor meetings and Walkthrough notes |
| Documents | The folders Scope, Policies, Evidence, Auditor Requests, Reports, Archive and Skills |
| Starter files | `OPERATING.md` in the Documents root; `Scope/scope.md`; `Scope/audit-calendar.md`; `Skills/audit-readiness-SKILL.md` (the `audit-readiness` skill) |
| Starter tasks | `Confirm the audit scope and period`; `Choose the audit firm`; `Gap analysis: <project name>`; `Schedule the auditor kickoff` |

The template does not copy text from SOC 2, ISO 27001 or any other framework. Those texts belong to their publishers. Link the project to the framework in the ZeroBias catalog by hand. The boards use `task` for gaps, evidence and auditor requests.

You can change the boards, notebooks and folders after the project exists. The project type and lifecycle never
change.

## Working with an AI agent

`OPERATING.md` tells your AI agent which template made the project, how the project is organized, and how to reach it
through the ZeroBias MCP server. The `audit-readiness` skill lets the agent do the work through the ZeroBias API. To use it,
copy `Documents/Skills/audit-readiness-SKILL.md` to `.claude/skills/audit-readiness/SKILL.md` in your working folder.

## Requirements

The boards use the activities `pmDecision`, `pmQuestion`, `task`. The Product Management activities and `task`
are on every environment.
