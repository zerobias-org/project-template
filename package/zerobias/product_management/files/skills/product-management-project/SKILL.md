---
name: product-management-project
description: Operate a ZeroBias project made from the Product Management project template — specs and stories, decisions and questions, mockups, risks, meeting notes, status updates and Documents folders. Use when the user asks to read, add or update work in a Product Management project in ZeroBias.
---

# Operate a Product Management project in ZeroBias

A Product Management project is a ZeroBias project made from the Product Management project template. Use the ZeroBias MCP tools for every step: `zerobias_search`, `zerobias_describe` and `zerobias_execute`.

## Before you start

1. Make sure the ZeroBias MCP tools are available. If they are not, tell the user to follow `OPERATING.md` in the project's Documents root. It says how to set up the ZeroBias MCP server. Then stop.
2. Get the project id. `OPERATING.md` contains it. Otherwise call `platform.Project.list` and match the project name.
3. Read the project: `platform.Project.get` with `projectId`.
4. Run `zerobias_describe` on an operation before its first use in a session. Parameter names change between versions.

## What a Product Management project contains

Read the live project. People change boards, notebooks and folders after the project is created.

| Part | Template default | Use |
|---|---|---|
| Specs & Stories board (default) | `pmSpec`, `pmStory`, `pmRelease`, `task` | The product spec, feature specs, stories, releases |
| Decisions & Questions board | `pmQuestion`, `pmDecision`, `pmResearch`, `task` | Open questions, decisions, research |
| Mockups board | `task` | Mockup work |
| Risks & Dependencies board | `task` | Risks and dependencies |
| Notes notebooks | Status updates, Meeting notes, Items | Written updates and notes |
| Documents folders | Specs, Mockups, Reviews, Diagrams, Meetings, Archive, Skills | Files. `Skills` holds this skill as `product-management-project-SKILL.md` |

The starter task `Spec: <project name>` is the product spec. Put each feature spec under it as a subtask.

A release can also be its own `phase` project under this product, with a fixed term. Other products can sit under this product as sub-projects.

## Boards and tasks

**List the boards:** `platform.Board.list` with `projectId`.

**List the tasks on a board:** `platform.Board.listTasks` with `boardId`. This call does not return subtasks. Use `platform.Task.listSubtasks` with the parent task `id` to get them.

**Find the activity id:** `platform.Board.listActivities` with `boardId`. A task needs the activity `id`, not the code. Use only an activity that the board allows.

**Create a task:** `platform.Task.create`.
- Set `boardId`, `activityId`, `name` and `description`.
- Set `approvers`, `notified` and `links`. They are required. Use `[]` when there are none.
- Set `priority`: 100 Low, 200 Normal, 500 High. If you omit it, the task gets Critical.
- For a subtask, set `parentId`. A subtask uses its parent's board. You cannot change the parent later.

**Change status:** status changes only through a transition.
1. Call `platform.Task.get` with the task `id`. Read `nextTransitions`.
2. Call `platform.Task.update` with `id` and `updateTask: { transitionId }`.

Some status changes need two transitions. If no transition goes to the status, tell the user. Do not guess.

**Add a comment:** `platform.Task.addComment`.

**Move a task to another board:** `platform.Task.moveToBoard`. The target board must allow the task's activity.

### What goes where

| The user says | Board | Activity |
|---|---|---|
| a spec, a feature spec | Specs & Stories | `pmSpec` (a feature spec is a subtask of the product spec) |
| a user story | Specs & Stories | `pmStory` |
| a release | Specs & Stories | `pmRelease` |
| an open question | Decisions & Questions | `pmQuestion` |
| a decision | Decisions & Questions | `pmDecision` |
| research | Decisions & Questions | `pmResearch` |
| a mockup | Mockups | `task` |
| a risk, a dependency | Risks & Dependencies | `task` |

When a question gets an answer, record the decision as a `pmDecision` task. Comment on the question with a link to the decision. Then close the question.

## Notes and Documents

Each project has one root folder named `Project-<projectId>` in the ZeroBias file service. It has two folders:

- `NOTES`: each notebook is a folder in `NOTES`. Each note is a Markdown (`.md`) file in a notebook.
- `DOCUMENTS`: the Documents folders. `OPERATING.md` is in the `DOCUMENTS` root.

**Find the root folder:** `hydra.Resource.resourceSearch`. Search for type `folder` with the condition `remoteTarget` equal to the project id. Pick the result named `Project-<projectId>`.

**List a folder:** `fileservice.Folder.listChildren` with the folder `id`.

**Read a file:** `fileservice.File.download` with the file `id`.

**Write a note or a document:**
1. Call `fileservice.File.create` with `name` and `folderId`.
2. Call `fileservice.File.upload` with the new file `id` and the content. Use the content type `text/markdown` for a note.

To change a file, upload new content to the same file `id`. The file service keeps the old version.

**Make a folder:** `fileservice.Folder.create` with `name` and `folderId` (the parent).

### Meeting notes

1. Make a note in the `Meeting notes` notebook. Name it `YYYY-MM-DD <meeting name>.md`.
2. Write attendees, decisions, questions and actions.
3. Create a `pmDecision` task for each decision and a `pmQuestion` task for each open question.
4. Create a task for each action on the right board.
5. Put the task codes in the note.

### Status updates

1. Read the open tasks on each board.
2. Make a note in the `Status updates` notebook. Name it `YYYY-MM-DD status.md`.
3. Write what moved, what is blocked, the open questions and the risks. Give task codes.

## Rules

- Read before you write. Make sure the board, notebook or folder exists before you add to it.
- Ask the user before you delete anything, close a task, or change many tasks.
- Never assign a person, or add an approver or a notified party, unless the user names that person.
- Use task codes and names when you report to the user.
- Never put an API key or a secret in a task, note or document.
