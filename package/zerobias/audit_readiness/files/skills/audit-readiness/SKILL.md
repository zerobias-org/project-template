---
name: audit-readiness
description: Run audit readiness in ZeroBias — scope, gaps, remediation, evidence and auditor requests for one framework. Use when the user asks to read, add or update work in a ZeroBias project made from the Compliance audit readiness project template.
---

# Run audit readiness in ZeroBias

A Compliance audit readiness project project is a ZeroBias project made from the Compliance audit readiness project template. Use the ZeroBias MCP tools for every step: `zerobias_search`, `zerobias_describe` and `zerobias_execute`.

## Before you start

1. Make sure the ZeroBias MCP tools are available. If they are not, tell the user to follow `OPERATING.md` in the project's Documents root. It says how to set up the ZeroBias MCP server. Then stop.
2. Get the project id. `OPERATING.md` contains it. Otherwise call `platform.Project.list` and match the project name.
3. Read the project: `platform.Project.get` with `projectId`.
4. Run `zerobias_describe` on an operation before its first use in a session. Parameter names change between versions.

## What the project contains

Read the live project. People change boards, notebooks and folders after the project is created.

| Part | Template default | Use |
|---|---|---|
| Gaps & Remediation board (default) | `task` | One `task` per gap, as a subtask of the gap analysis task |
| Evidence board | `task` | One `task` per control or evidence item |
| Auditor Requests board | `task` | One `task` per auditor request |
| Decisions & Questions board | `pmQuestion`, `pmDecision`, `task` | Scope, period, audit firm, risk acceptance |
| Notes notebooks | Status updates, Auditor meetings, Walkthrough notes | Meetings with the auditor and control walkthroughs |
| Documents folders | Scope, Policies, Evidence, Auditor Requests, Reports, Archive, Skills | `Scope/scope.md` and `Scope/audit-calendar.md` are the plan. `Skills` holds this skill |

## The work

Never copy text from SOC 2, ISO 27001 or another framework into a task or a document. Name the criterion or control by its id and link to the framework in the ZeroBias catalog.

### Scope and calendar

1. Ask the user for the framework, the report type, the systems in scope and the audit period.
2. Fill in `Scope/scope.md`. Close `Confirm the audit scope and period` when the user agrees.
3. Fill in `Scope/audit-calendar.md` with the readiness, fieldwork and report dates. Close `Choose the audit firm` when the firm and dates are agreed.

### Gap analysis and remediation

1. For each criterion or control in scope, ask the user how the organization meets it today. Read `Policies/` for the written policies.
2. For each gap, create a `task` subtask of `Gap analysis: <project name>` on Gaps & Remediation. Name it `<control-id>: <gap>`. Put the fix and the owner the user names in the description.
3. Close a gap task when the fix is in place and its evidence is in `Evidence/`.

### Evidence

1. Create one `task` on Evidence for each control that needs evidence. Name it `<control-id>: <evidence>`.
2. Put the evidence files in `Evidence/<control-id>/`. Name each file with its date.
3. Close the task when the files are in place. Do not judge whether evidence is sufficient. That is the auditor's decision.

### Auditor requests

1. Create one `task` on Auditor Requests for each request. Use the auditor's request id in the name.
2. Put the response files in `Auditor Requests/<request-id>/`.
3. Comment with what you sent and when. Close the task when the auditor accepts it.

### Meetings, walkthroughs and status updates

- Auditor meetings go in the `Auditor meetings` notebook as `YYYY-MM-DD <meeting name>.md`. Create a task for each follow-up.
- Control walkthroughs go in the `Walkthrough notes` notebook as `<control-id>.md`.
- A status update goes in the `Status updates` notebook as `YYYY-MM-DD status.md`. Give open gaps, evidence collected, open auditor requests and the next calendar date.

## ZeroBias API

### Boards and tasks

- **List the boards:** `platform.Board.list` with `projectId`.
- **List the tasks on a board:** `platform.Board.listTasks` with `boardId`. This call does not return subtasks. Use `platform.Task.listSubtasks` with the parent task `id`.
- **Find the activity id:** `platform.Board.listActivities` with `boardId`. A task needs the activity `id`, not the code. Use only an activity that the board allows.
- **Create a task:** `platform.Task.create`.
  - Set `boardId`, `activityId`, `name` and `description`.
  - Set `approvers`, `notified` and `links`. They are required. Use `[]` when there are none.
  - Set `priority`: 100 Low, 200 Normal, 500 High. If you omit it, the task gets Critical.
  - For a subtask, set `parentId`. A subtask uses its parent's board. You cannot change the parent later.
- **Change status:** call `platform.Task.get` and read `nextTransitions`. Then call `platform.Task.update` with `id` and `updateTask: { transitionId }`. Some status changes need two transitions. If no transition goes to the status, tell the user.
- **Add a comment:** `platform.Task.addComment`.
- **Move a task to another board:** `platform.Task.moveToBoard`. The target board must allow the task's activity.

### Notes and Documents

Each project has one root folder named `Project-<projectId>` in the ZeroBias file service. It has two folders: `NOTES` and `DOCUMENTS`. Each notebook is a folder in `NOTES`, and each note is a `.md` file in it. The Documents folders are in `DOCUMENTS`.

- **Find the root folder:** `hydra.Resource.resourceSearch`. Search for type `folder` with the condition `remoteTarget` equal to the project id. Pick the result named `Project-<projectId>`.
- **List a folder:** `fileservice.Folder.listChildren` with the folder `id`.
- **Read a file:** `fileservice.File.download` with the file `id`.
- **Write a file:** call `fileservice.File.create` with `name` and `folderId`. Then call `fileservice.File.upload` with the new file `id` and the content. Use the content type `text/markdown` for `.md` files.
- **Change a file:** upload new content to the same file `id`. The file service keeps the old version.
- **Make a folder:** `fileservice.Folder.create` with `name` and `folderId` (the parent).

## Rules

- Read before you write. Make sure the board, notebook or folder exists before you add to it.
- Ask the user before you delete anything, close a task, or create many tasks.
- Never assign a person, or add an approver or a notified party, unless the user names that person.
- Use task codes and names when you report to the user.
- Never put an API key or a secret in a task, note or document.
