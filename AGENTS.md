# AGENTS.md

Instructions for an AI agent that adds or changes a project template in this repo.
[`README.md`](README.md) explains how templates work and lists every field.

## What a template is

A template is one `*.yml` file directly in a package folder `package/<vendor>/<name>/`.
A user creates a project from it in the Projects App.
The project starts with the template's type, lifecycle, boards, board activities, notebooks, Documents folders, starter files and starter tasks.
A template can also name an agent skill that operates projects made from it.

## Add a template

1. Run `sh scripts/new-template.sh <vendor> <name>`. Use lowercase letters, digits and `_` only.
2. Open `package/<vendor>/<name>/<name>.yml`.
3. Replace every `REPLACE-…` value. Read the comment on each line.
4. Delete the fields that you do not need. Keep every required field.
5. Do the checklist below.

To add a second template to an existing package:

1. Copy `templates/starter/starter.yml` into the package folder.
2. Give the file a new name.
3. Set `id` to a new UUID: `uuidgen | tr A-Z a-z`.
4. Do steps 3 to 5 above.

## Checklist: do every step before you open a PR

1. Give each new template a new lowercase UUID as `id`. Make it with `uuidgen | tr A-Z a-z`. Never copy an `id` from another template. Never change the `id` of a released template.
2. Make `projectType` and `lifecycle` a valid pair. They cannot change after a project exists. Use this matrix from `zerobias-com/platform` `api/src/api/schemas/project/newProject.yml`:
   - `standard`: `fixed-term` or `evergreen`
   - `program`: `evergreen` only
   - `coordination_program`: `evergreen` only
   - `phase`: `fixed-term` only, and the project needs a `coordination_program` parent
   - `assessment`: `fixed-term` only
   - `engagement`, `rfp`, `pilot`: `fixed-term` or `evergreen`
3. Give exactly one board `isDefault: true`. The project's default board gets that board's name.
4. Make each board `key` unique in the file. Make each task's `board` one of those keys.
5. Write activities as codes, never as ids. Each code must be loaded on the target environment, or the load fails. A private template can also use activity codes that its own org owns.
6. Make each task's `activity` one of the activities of its board.
7. Use only the placeholders `${projectName}` and `${projectId}`. Put quotes around a yml value that contains one.
8. Do not put secrets in a template or a starter file.
9. For each entry in `documents.files`, put the file at its `source` path in the package. Set `folder` to `''` or to a name in `documents.folders`. Keep each file UTF-8 text and 64 KiB or less.
10. If the package has a `files/` folder, make sure `files/**` is in the `files` list of `package.json`.
11. If the template has `skill`, make sure `files/skills/<skill.name>/SKILL.md` exists in the package and its front matter `name` is `skill.name`.
12. Run `unset ZB_SLOT`, then `zbb :<vendor>:<name>:validateContent`. Fix each failure. Do this before each push.

## Starter files and the skill

- Put a starter file in `package/<vendor>/<name>/files/`. List it in `documents.files` with `folder`, `name` and `source`.
- Write a skill in `files/skills/<name>/SKILL.md` in the package. Keep one copy only.
- Add `Skills` to `documents.folders`. Add the skill to `documents.files` with folder `Skills`, name `<name>-SKILL.md` and source `files/skills/<name>/SKILL.md`.
- Set `skill.url` to the `SKILL.md` on `main`. Set `skill.install` to `Copy Documents/Skills/<name>-SKILL.md to .claude/skills/<name>/SKILL.md`.
- The skill operates the project through the ZeroBias API. Name each API call in it. Check each call with the ZeroBias MCP `zerobias_describe`.
- Give a template with a skill an `OPERATING.md` starter file in the Documents root. It names the template and the skill. It says how to install the skill and how to get ZeroBias MCP or API access. See `package/zerobias/pmo/files/OPERATING.md`.

## Activity codes

These are the activity codes for project management:

| Code | Use |
|---|---|
| `task` | a general task |
| `pmSpec` | a specification |
| `pmStory` | a user story |
| `pmRelease` | a release |
| `pmQuestion` | an open question |
| `pmDecision` | a decision |
| `pmResearch` | research |

- `task` is on every environment.
- The `pm*` codes are on CI and QA. They are on PROD after the Product Management content deploys there.
- Before you use a code, check the list on the target environment. Use the ZeroBias MCP call `platform.Activity.list`, with `profile` set to the target environment.

## Not in v1

Do not add these. The loader does not read them:

- starter note text (notebooks are names only)
- custom field defaults
- role assignments
- child projects
- save a project as a template

## Rules for the repo

- Use `zbb` for every build command. Never run `./gradlew`. Gradle fails on Java 25, and zbb selects Java 21.
- Do not add `deprecated.yml`. The loader reads it as a template.
- To retire a template, delete its yml.
- Keep at least one template yml in each package. A package with no `*.yml` at its root fails the load. The load does not delete the package's templates in that case.
- To retire every template in a package, set `"deprecated": true` in the `zerobias` section of `package.json`.
- Do not set `orgId` in `package.json` for a public template.
- Do not put files that are not templates directly in a package folder as `*.yml`.

## Commits and PRs

- Use Conventional Commits. Scope: `project-template-<vendor>-<name>`.
- Example: `feat(project-template-zerobias-pmo): add the PMO template`.
- Open each PR as a draft.
- Put the line `ZeroBias task: <code>` in the PR body.
- Do not add Claude attribution to commits or PRs.

## Build token

Every `zbb` command needs a GitHub token with `read:packages`.

```bash
gh auth refresh -s read:packages && export GITHUB_TOKEN=$(gh auth token)
```

A 401 from `maven.pkg.github.com` or `Plugin [id: 'zb.workspace'] was not found` means the scope is missing.
Run the command above and retry. Do not skip validation.
