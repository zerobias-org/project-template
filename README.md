# ZeroBias Project Templates

Public **project template** content artifacts under `@zerobias-org`.

## What a project template is

A user creates a project from a template in the Projects App. The new project
starts with what the template defines:

- the project type and lifecycle
- the boards, and the activities each board allows
- the Notes notebooks
- the Documents folders, and starter files in them
- the starter tasks
- the name of an agent skill that operates projects made from it

The user names the project. Everything else comes from the template, and the
user can change it after the project exists (except the type and lifecycle,
which never change).

## Status

**In development** (ZeroBias task: backendFeat-187, "Project templates: choose a
template when a project is created"). Templates load only after the hydra and
platform releases for this feature are on an environment. Until then the gate
stops at the data loader with
`No catalog.artifact_type found for import-artifact: project_template`.

The feature spans four repos that merge in order: hydra, platform, this repo,
then the UI. See the merge order in
[PR 1](https://github.com/zerobias-org/project-template/pull/1).

## How a template gets to users

```
package/<vendor>/<name>/*.yml
    │  merge to main → the publish workflow releases the npm package
    ▼
platform data loader           import-artifact: project_template
    │  writes the template, and one version of it per package version, to the catalog
    ▼
Create Project dialog          the user picks the template
    ▼
new project                    linked is_instance_of → the template version
```

## Repo layout

```
package/
└── zerobias/
    └── pmo/                         # one package per template group: package/<vendor>/<name>/
        ├── package.json             #   @zerobias-org/project-template-zerobias-pmo
        │                            #   zerobias.package = zerobias.pmo.project_template
        │                            #   zerobias.import-artifact = project_template
        ├── .npmrc                   #   byte-identical copy of the repo-root .npmrc
        ├── build.gradle.kts         #   plugins { id("zb.content") }
        ├── pmo.yml                  #   one template per *.yml file in the package folder
        └── files/OPERATING.md       #   a starter file; pmo.yml names it in documents.files
skills/
└── pmo-project/SKILL.md             # the agent skill named in pmo.yml; not in the published package
templates/starter/                   # the starter package; never published (see "Add a template")
scripts/new-template.sh              # copies the starter into package/<vendor>/<name>/
bundle/                              # @zerobias-org/project-template-bundle (workflow-managed)
```

- Every `*.yml` file directly in a package folder is one template. The loader
  ignores subfolders and dotfiles.
- The package must sit at least two levels under `package/`. The publish
  workflow skips the folder literally named `package`.

## Templates

| Package | Template | Source |
|---|---|---|
| `zerobias/pmo` | PMO project | the PMO recipe: a `coordination_program`, four boards (Specs & Stories, Decisions & Questions, Mockups, Risks & Dependencies), three notebooks, six Documents folders, `OPERATING.md` in the Documents root, a starter spec task, and the `pmo-project` skill |

The PMO template uses the Product Management activities. They are on CI and
QA, and on PROD after the Product Management content deploys there. The load
fails on an environment that does not have them.

## Field reference

| Field | Required | Meaning |
|---|---|---|
| `id` | yes | The template's stable UUID, lowercase. Unique across the repo. Never changes after release |
| `name` | yes | Display name in the Create Project dialog |
| `description` | yes | What the template is for |
| `imageUrl` | no | Image for the template. Defaults to the resource type's icon |
| `keywords` | no | List of strings. Catalog search matches them |
| `projectType` | yes | The project type. See the type and lifecycle pairs below |
| `lifecycle` | yes | `fixed-term` or `evergreen` |
| `boards` | yes | List of boards. At least one |
| `boards[].key` | yes | Local name for the board, unique in the file. Tasks use it |
| `boards[].name` | yes | Board name |
| `boards[].isDefault` | one board | `true` on exactly one board. The project's default board gets this board's name |
| `boards[].activities` | yes | List of activity codes that the board allows |
| `notes.notebooks` | no | List of Notes notebooks |
| `notes.notebooks[].name` | yes | Notebook name |
| `documents.folders` | no | List of Documents folder names |
| `documents.files` | no | List of starter files. The project gets each file in its folder |
| `documents.files[].folder` | yes | `''` for the Documents root, or a name from `documents.folders` |
| `documents.files[].name` | yes | File name in the project. Unique in its folder |
| `documents.files[].source` | yes | Path of the file in the package, relative to the template yml. UTF-8 text, 64 KiB or less. `${projectName}` and `${projectId}` are allowed in the text |
| `skill` | no | The agent skill that operates projects made from this template. The Create Project dialog shows it. The platform does not install it |
| `skill.name` | yes | The `name` in the skill's `SKILL.md` front matter |
| `skill.description` | yes | One line: what the skill does |
| `skill.url` | yes | Link to the skill folder in this repo: `skills/<name>/` on `main` |
| `skill.install` | yes | The command that installs the skill |
| `tasks` | no | List of starter tasks |
| `tasks[].board` | yes | The `key` of the task's board |
| `tasks[].name` | yes | Task name. `${projectName}` and `${projectId}` are allowed |
| `tasks[].activity` | yes | Activity code. Must be one of its board's activities |
| `tasks[].description` | no | Task description. `${projectName}` and `${projectId}` are allowed |

### Type and lifecycle pairs

From `zerobias-com/platform` `api/src/api/schemas/project/newProject.yml`:

| `projectType` | `fixed-term` | `evergreen` | Notes |
|---|:---:|:---:|---|
| `standard` | yes | yes | |
| `program` | no | yes | |
| `coordination_program` | no | yes | |
| `phase` | yes | no | needs a `coordination_program` parent |
| `assessment` | yes | no | |
| `engagement`, `rfp`, `pilot` | yes | yes | |

## Rules

1. Give each new template a new lowercase UUID as `id`. Never copy an `id`. Never change the `id` of a released template.
2. `projectType` and `lifecycle` must be a valid pair (table above). They cannot change after a project exists.
3. Exactly one board has `isDefault: true`.
4. Board keys are unique in the file. Each task's `board` is one of those keys.
5. Activities are codes, never ids. Each code must be loaded on the target environment, or the load fails. A private template can also use activity codes that its own org owns.
6. Each task's `activity` is one of the activities of its board.
7. The only placeholders are `${projectName}` and `${projectId}`. Quote a yml value that contains one.
8. No secrets in a template or a starter file.
9. Each `documents.files[].source` exists in the package, and each `folder` is `''` or in `documents.folders`. No two files share a folder and name.
10. Run `zbb validateContent` before each push.

## Starter files and the skill

A template can create text files in the new project's Documents folders. Put
each file under `files/` in the package, and list it in `documents.files`. The
package's `files` list in `package.json` must include `files/**`, or the file
is not published. The loader stores the file text with the template version.
At create, the platform fills in `${projectName}` and `${projectId}` and
uploads the file.

A template can name an agent skill in `skill`. The skill lets the customer's
AI agent operate a project made from the template through the ZeroBias API.
Write the skill in `skills/<name>/SKILL.md` at the repo root. `skills/` is
outside every package, so the skill is not part of the published template.
Give each template with a skill a starter file such as `OPERATING.md` that
names the template and the skill, and says how to install the skill and how to
get ZeroBias MCP or API access.

## Public and private templates

No `orgId` in `package.json` means the templates are public. With `orgId`, they
are private to that org.

## Versions and changes

- To change a template, edit its yml, bump the package version, and merge. The
  loader writes a new version of the template.
- A new version does not change projects that already exist. A project keeps
  what it was created with.
- To retire one template, delete its yml. The next load removes it.
- A package must keep at least one template yml. A package with no `*.yml` at
  its root fails the load, and the load does not delete its templates. To
  retire the last template, use `"deprecated": true` instead.
- To retire every template in a package, set `"deprecated": true` in the
  `zerobias` section of `package.json`.

## Add a template

```bash
sh scripts/new-template.sh <vendor> <name>      # e.g. sh scripts/new-template.sh zerobias security_review
```

The script copies `templates/starter/` to `package/<vendor>/<name>/`, sets the
npm name and `zerobias.package` from the arguments, names the yml `<name>.yml`,
and writes a new UUID into its `id`. Then:

1. Replace every `REPLACE-…` value in the yml. Each line has a comment that
   says what the field does and which values are valid.
2. Run `unset ZB_SLOT`, then `zbb :<vendor>:<name>:validateContent`.
3. Commit, and open the PR as a draft.

To add a second template to an existing package, copy
`templates/starter/starter.yml` into the package folder and give it a new id.

## Build and validate

Use [`zbb`](https://github.com/zerobias-org/util/tree/main/packages/zbb) for
every build command. Do not run `./gradlew` directly: zbb selects Java 21, and
Gradle 8.10.2 fails on Java 25.

```bash
npm i -g @zerobias-org/zbb@latest @zerobias-com/platform-dataloader@latest

unset ZB_SLOT                            # a content repo has no slot or stack
zbb :<vendor>:<name>:validateContent     # file shape only, e.g. :zerobias:pmo:validateContent
zbb :<vendor>:<name>:gate                # full gate (writes gate-stamp.json)
zbb validateUniqueIds                    # no two templates share an id
```

The repo validator checks the package identity (folder, npm name and
`zerobias.package` agree), `import-artifact`, that at least one template yml
is in the package folder, and unique ids. The gate's data loader step checks
the rest. It uses `ZB_TOKEN`. If `ZB_TOKEN` is empty, that step is skipped and
the gate still writes a stamp, so check that `testDataloader` is `"passed"` in
`gate-stamp.json`. Commit the stamp with the package.

The `zb.*` gradle plugins need a GitHub token with `read:packages`:

```bash
gh auth refresh -s read:packages && export GITHUB_TOKEN=$(gh auth token)
```

## Publishing

`.github/workflows/publish.yml` runs
`zerobias-org/devops/.github/workflows/zbb-publish-reusable.yml@main` on push to
`main`, `qa`, `dev` and `uat`. Do not `npm publish` by hand.

## Commits and PRs

[Conventional Commits](https://www.conventionalcommits.org/), commitlint-enforced.
Scope: `project-template-<vendor>-<name>`. Open PRs as drafts. Put the line
`ZeroBias task: <code>` in the PR body.
