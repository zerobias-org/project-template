# ZeroBias Project Templates

Public **project template** content artifacts under `@zerobias-org`. A template
is a recipe for a new project: a user picks it when they create a project, and
the project starts with the type, lifecycle, boards, Notes notebooks,
Documents folders and starter tasks that the template defines.

The loader is being built: the `project_template` artifact type and its
dataloader processor in `zerobias-com/platform` (ticket backendFeat-187,
"Project templates: choose a template when a project is created"). Until that
ships to an environment, the gate cannot load these templates.

## How a template becomes a project

```
package/<owner>/<name>/*.yml
    │  publish (npm) → dataloader (import-artifact: project_template)
    ▼
project template version      one public version per package version
    │  create a project from the template
    ▼
project                       linked is_instance_of → the template version
```

## Shape

Each template npm package lives at `package/<owner>/<name>/`, or deeper. The
directory names give the npm name `@zerobias-org/project-template-<owner>-…-<name>`
and the package code `<owner>.….<name>.project_template`. Every `*.yml`
directly under the package root is one template.

```
package/
└── zerobias/
    └── pmo/                       # @zerobias-org/project-template-zerobias-pmo
        ├── package.json           #   zerobias.package = zerobias.pmo.project_template
        │                          #   zerobias.import-artifact = project_template
        ├── .npmrc                 #   byte-identical copy of the repo-root .npmrc
        ├── build.gradle.kts       #   plugins { id("zb.content") }
        └── pmo.yml                #   one template per yml; each has its own id
bundle/                            # @zerobias-org/project-template-bundle (workflow-managed)
```

- The artifact type comes only from `zerobias.import-artifact`.
- No `orgId` in `package.json` means the templates are public. With `orgId`,
  they are private to that org.
- There is no `deprecated.yml`: it would be read as a template. Delete a
  template's yml to retire it.
- The package must not sit directly at `package/`. The publish workflow skips
  the directory literally named `package`.

## Templates

| Package | Template | Source |
|---|---|---|
| `zerobias/pmo` | PMO project | the PMO recipe: four boards (Specs & Stories, Decisions & Questions, Mockups, Risks & Dependencies), notebooks, Documents folders |

The PMO template uses the Product Management activities (`pmSpec`, `pmStory`,
`pmRelease`, `pmQuestion`, `pmDecision`, `pmResearch`) as well as `task`. The
load fails when an activity code is not loaded on the environment. So the PMO
template loads on CI and QA now, and on PROD after the Product Management
content deploys there.

## Template fields

The dataloader is the source of truth. This is the v1 format.

| Field | Required | Notes |
|---|---|---|
| `id` | yes | new random UUID (`uuidgen`), unique across the repo |
| `name`, `description` | yes | |
| `keywords` | no | search aliases |
| `projectType` | yes | for example `coordination_program`. Cannot change after the project is created |
| `lifecycle` | yes | `evergreen` or `fixed-term`. Cannot change after the project is created. Some types allow only one (`coordination_program` is evergreen only) |
| `boards[]` | yes | `key` (local, used by `tasks`), `name`, `default` (one board; the project's default board gets this name), `activities` (activity codes) |
| `notes.notebooks[]` | no | `name` of each Notes notebook |
| `documents.folders[]` | no | Documents folder names |
| `tasks[]` | no | `board` (a board `key`), `name`, `activity` (a code), `description` |

- Name activities by **code**, never by id. Activity ids differ between
  environments. The platform resolves codes when it creates the project.
- `${projectName}` is the only placeholder.

## Build and validate

Use [`zbb`](https://github.com/zerobias-org/util/tree/main/packages/zbb) for
every build command. Do not run `./gradlew` directly: zbb selects Java 21, and
Gradle 8.10.2 fails on Java 25.

```bash
npm i -g @zerobias-org/zbb@latest @zerobias-com/platform-dataloader@latest

unset ZB_SLOT                          # a content repo has no slot or stack
zbb :<owner>:<name>:validateContent    # file shape only, e.g. :zerobias:pmo:validateContent
zbb :<owner>:<name>:gate               # full gate (writes gate-stamp.json)
zbb validateUniqueIds                  # no two templates share an id
```

The repo validator checks the package identity (dir, npm name and
`zerobias.package` agree), `import-artifact`, that at least one template yml
is at the package root, and unique ids. The gate's dataloader step checks the
rest. It uses `ZB_TOKEN`. If `ZB_TOKEN` is empty, that step is skipped and the
gate still writes a stamp, so check that `testDataloader` is `"passed"` in
`gate-stamp.json`. Commit the stamp with the package.

## Publishing

`.github/workflows/publish.yml` invokes
`zerobias-org/devops/.github/workflows/zbb-publish-reusable.yml@main` on push to
`main`, `qa`, `dev` and `uat`. Do not `npm publish` by hand.

## Commit format

[Conventional Commits](https://www.conventionalcommits.org/), commitlint-enforced.
Scope: `project-template-<owner>-<name>`.

## Prerequisites: GitHub token with `read:packages`

The `zb.*` gradle plugins resolve from GitHub Packages Maven, which refuses
anonymous reads:

```bash
gh auth refresh -s read:packages && export GITHUB_TOKEN=$(gh auth token)
```
