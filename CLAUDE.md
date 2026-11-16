# CLAUDE.md

**NOTE:** For best results, run Claude Code from meta-repo root (`~/zerobias`)
to ensure access to all platform context and cross-module documentation.

## Overview

This is a **GitHub template repository** for creating new zerobias-org content artifact repos. It provides the standard monorepo scaffolding with Lerna + Nx, CI/CD workflows, validation scripts, and the vendor/suite/version package structure used across all org content repos.

## Using This Template

### Creating a New Repo

1. On GitHub: **Use this template** → create `zerobias-org/{new-repo-name}`
2. Clone and run a global find-and-replace for these placeholders:

| Placeholder | Replace With | Example |
|-------------|-------------|---------|
| `{REPO_NAME}` | GitHub repo name | `benchmark` |
| `{ARTIFACT_TYPE}` | Dataloader artifact type | `benchmark` |

3. Files that need placeholder replacement:
   - `package.json` — name, description, repository, homepage, bugs
   - `.github/workflows/pull-request-target.yml` — `github.repository` check
   - `.github/workflows/publish-pull-request.yml` — `github.repository` check
   - `scripts/validate.ts` — `ARTIFACT_TYPE` constant
   - `templates/package.json` — name pattern, import-artifact, package pattern
   - `templates/index.yml` — add artifact-specific fields
   - `README.md` — all references

4. Delete the example package at `package/example/`
5. Run `npm install`

### Creating New Packages

```bash
# Creates package/{vendor}/{suite}/{version}/ from templates/
./scripts/createNew.sh <vendor> <suite> <version>

# Example:
./scripts/createNew.sh owasp asvs v4.0.3
```

Then fill in placeholders in the generated `index.yml` and `package.json`.

## Repository Structure

```
{REPO_NAME}/
├── .github/workflows/        # CI/CD (reusable workflows from zerobias-org/devops)
│   ├── publish.yml            # Main branch → publish to registry
│   ├── publish-pull-request.yml  # Dev/QA merge → publish
│   └── pull-request-target.yml   # PR validation on dev branch
├── package/                   # Content packages (vendor/suite/version)
│   └── {vendor}/
│       └── {suite}/
│           └── {version}/
│               ├── index.yml      # Artifact metadata
│               ├── package.json   # NPM package config
│               └── .npmrc         # Package-level registry config
├── scripts/
│   ├── createNew.sh           # Scaffold new package from templates
│   ├── correctDeps.ts         # Set all dependencies to "latest"
│   └── validate.ts            # Package validation (customize per artifact type)
├── templates/                 # Copied into each new package by createNew.sh
│   ├── .npmrc
│   ├── index.yml
│   └── package.json
├── package.json               # Lerna workspace root
├── lerna.json                 # Independent versioning, conventional commits
├── nx.json                    # Nx task runner config
├── .npmrc                     # Multi-registry authentication
├── .nvmrc                     # Node version (v22.21.1)
├── .commitlintrc.json         # Conventional commit enforcement
└── .gitignore
```

## Common Commands

```bash
# Validate all packages
npm run validate

# Clean Nx cache
npm run clean

# Full reset (clean + reinstall)
npm run reset

# Preview version bumps
npm run lerna:dry-run

# Apply version bumps
npm run lerna:version
```

### Per-Package Commands

```bash
cd package/{vendor}/{suite}/{version}/

# Validate this package
npm run validate

# Set dependencies to latest
npm run correct:deps
```

## Naming Conventions

### Package Names (dashes)
```
@zerobias-org/{ARTIFACT_TYPE}-{vendor}-{suite}-{version}
```
Example: `@zerobias-org/benchmark-owasp-asvs-v4_0_3`

### Metadata Code (underscores)
```
{vendor}_{suite}_{version}
```
Example: `owasp_asvs_v4_0_3`

### Metadata Package (dots)
```
{vendor}.{suite}.{version}.{ARTIFACT_TYPE}
```
Example: `owasp.asvs.v4_0_3.benchmark`

### Directory Path (slashes)
```
package/{vendor}/{suite}/{version}/
```
Example: `package/owasp/asvs/v4_0_3/`

## Customization Guide

### Validation Script (`scripts/validate.ts`)

The template includes a generic validator. Customize it for your artifact type:

1. Update the `ARTIFACT_TYPE` constant
2. Update `ValidStatuses.values` if your artifact uses different status values
3. Add artifact-specific field validation in `processIndexYml()`
4. Add content-specific validation (e.g., elements, mappings, test cases)

### Template Files (`templates/`)

Customize for your artifact's required files:

- `index.yml` — Add artifact-specific metadata fields
- `package.json` — Adjust `files` array for what your artifact publishes
- Add new template files as needed (e.g., `catalog.yml` for products)

### Creation Script (`scripts/createNew.sh`)

Adjust for your artifact's directory depth:
- **1 level** (vendor-only): `./scripts/createNew.sh <vendor>`
- **2 levels** (vendor/code): `./scripts/createNew.sh <vendor> <code>`
- **3 levels** (vendor/suite/version): `./scripts/createNew.sh <vendor> <suite> <version>`

Update argument count check and `FOLDER_PATH` accordingly.

## Artifact Metadata (`zerobias` section in package.json)

Every package must include:

```json
"zerobias": {
  "dataloader-version": "1.0.0",
  "import-artifact": "{ARTIFACT_TYPE}",
  "package": "{vendor}.{suite}.{version}.{ARTIFACT_TYPE}"
}
```

- `dataloader-version`: Always `"1.0.0"` for new artifacts
- `import-artifact`: Must match the artifact type the dataloader expects
- `package`: Dot-separated path **without** `zerobias.` prefix

## Git Workflow

- **PRs target `dev` branch** (not `main`)
- **Conventional commits required**: `feat:`, `fix:`, `chore:`, etc.
- **Lerna manages versioning** — do not bump versions manually in PRs
- Merges to `dev`/`qa` trigger pre-release publishes
- Merges to `main` trigger stable publishes

## Dependency Chain

Content artifacts typically depend on upstream VSP (Vendor/Suite/Product) packages:

```
vendor → suite → {your artifact type}
```

Ensure the required vendor and suite packages exist before creating new artifacts.

## Registry Configuration

- **Root `.npmrc`**: Multi-registry auth for build-time dependencies
- **Package `.npmrc`**: Single registry for publish target (`pkg.zerobias.org`)
- **Auth tokens**: `ZB_TOKEN` (zerobias registry), `NPM_TOKEN` (GitHub Packages)

## Related Documentation

- [Meta-repo CLAUDE.md](../../CLAUDE.md) — Platform overview
- [Architecture.md](../../Architecture.md) — Component relationships
- [Concepts.md](../../Concepts.md) — Domain model
- [ContentArtifacts.md](../../ContentArtifacts.md) — Content system details
