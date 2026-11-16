import fs from 'fs/promises';
import path from 'path';
import yaml from 'yaml';
import { UUID, URL } from '@zerobias-org/types-core-js';

// ============================================================================
// CONFIGURATION - Update these for your artifact type
// ============================================================================

// The artifact type this repo manages (e.g., 'framework', 'benchmark', 'standard')
const ARTIFACT_TYPE = '{ARTIFACT_TYPE}';

// Valid status values for this artifact type
const ValidStatuses = {
  values: ['active', 'approved', 'deprecated', 'draft', 'inactive', 'superseded'] as const,
  from(value: string): string {
    if (!this.values.includes(value as any)) {
      throw new Error(`Invalid status: ${value}. Valid values: ${this.values.join(', ')}`);
    }
    return value;
  }
};

// ============================================================================
// VALIDATION LOGIC
// ============================================================================

function isKnownFileType(filename: string): boolean {
  return (filename.toLowerCase().endsWith('.yml') || filename.toLowerCase().endsWith('.json'));
}

async function readAndParseFile(file: string, fullPathFile: string): Promise<any> {
  if (isKnownFileType(file)) {
    const fileData = (await fs.readFile(fullPathFile)).toString();
    let document = null;

    if (file.endsWith('.yml')) {
      document = yaml.parse(fileData);
    } else if (file.endsWith('.json')) {
      document = JSON.parse(fileData);
    }

    return document;
  }

  throw new Error(`File type not supported: ${file}`);
}

function processPackageJson(packageFile: Record<string, any>, code: string): void {
  let check: any = packageFile.name !== undefined && packageFile.name !== null
    && packageFile.name === `@zerobias-org/${ARTIFACT_TYPE}-${code.replace(/_/g, '-')}`
    ? true
    : new Error(`package.json name must be @zerobias-org/${ARTIFACT_TYPE}-<code-with-dashes>`);

  check = packageFile.description !== undefined && packageFile.description !== null
    ? true : new Error('package.json missing description');

  const codeSplit = code.split('_');
  if (codeSplit.length < 1 || codeSplit.length > 4) {
    throw new Error(`code found in index.yml must match format: {vendor}_{suite?}_{version?}`);
  }

  if (packageFile.zerobias && typeof packageFile.zerobias === 'object') {
    const zerobias = packageFile.zerobias;
    check = zerobias['import-artifact'] === ARTIFACT_TYPE
      ? true : new Error(`package.json zerobias section import-artifact must be '${ARTIFACT_TYPE}'`);
    check = zerobias.package !== undefined && zerobias.package !== null
      ? true : new Error('package.json zerobias section missing package');
    check = zerobias['dataloader-version'] !== undefined && zerobias['dataloader-version'] !== null
      ? true : new Error('package.json zerobias section missing dataloader-version');
  } else if (packageFile.auditmation && typeof packageFile.auditmation === 'object') {
    // Support legacy auditmation key for existing packages
    const auditmation = packageFile.auditmation;
    check = auditmation['import-artifact'] === ARTIFACT_TYPE
      ? true : new Error(`package.json auditmation section import-artifact must be '${ARTIFACT_TYPE}'`);
    check = auditmation.package !== undefined && auditmation.package !== null
      ? true : new Error('package.json auditmation section missing package');
    check = auditmation['dataloader-version'] !== undefined && auditmation['dataloader-version'] !== null
      ? true : new Error('package.json auditmation section missing dataloader-version');
  } else {
    throw new Error('package.json missing zerobias section');
  }
}

async function processIndexYml(indexFile: Record<string, any>): Promise<string> {
  const code = indexFile.code !== undefined && indexFile.code !== null && indexFile.code !== '{code}'
    ? indexFile.code : new Error('code not found in index.yml');
  if (typeof code !== 'string' || code === '{code}') {
    throw new Error('code in index.yml needs replacement from {code}');
  }

  let check: any;
  check = indexFile.id !== undefined && indexFile.id !== null && indexFile.id !== '{id}'
    ? new UUID(indexFile.id) : new Error('id not found in index.yml');
  check = indexFile.name !== undefined && indexFile.name !== null && indexFile.name !== '{name}'
    ? indexFile.name : new Error('name not found in index.yml');
  if (typeof check !== 'string') {
    throw new Error('name in index.yml needs replacement from {name}');
  }

  check = indexFile.description !== undefined && indexFile.description !== null && indexFile.description !== '{description}'
    ? indexFile.description : new Error('description not found in index.yml');
  if (typeof check !== 'string') {
    throw new Error('description in index.yml needs replacement from {description}');
  }

  check = indexFile.url !== undefined && indexFile.url !== null ? new URL(indexFile.url) : true;
  check = indexFile.status !== undefined && indexFile.status !== null
    ? ValidStatuses.from(indexFile.status) : new Error('status not found in index.yml');

  return code;
}

async function processArtifact(directory: string) {
  const checkDir = await fs.lstat(directory)
    .catch(() => undefined);

  if (!checkDir || !checkDir.isDirectory()) {
    throw new Error(`Path given is not found or not a directory: ${directory}`);
  }

  const checkIndexYml = await fs.lstat(path.join(directory, 'index.yml'))
    .catch(() => undefined);

  if (!checkIndexYml || !checkIndexYml.isFile()) {
    throw new Error(`index.yml file not found or not file in directory: ${directory}`);
  }

  const indexYml = await readAndParseFile('index.yml', path.join(directory, 'index.yml'));
  if (!indexYml) {
    throw new Error('Unable to parse index.yml');
  }

  const code = await processIndexYml(indexYml);
  console.log('Validated index.yml');

  const checkPackageJson = await fs.lstat(path.join(directory, 'package.json'))
    .catch(() => undefined);

  if (!checkPackageJson || !checkPackageJson.isFile()) {
    throw new Error(`package.json file not found or is not file in directory: ${directory}`);
  }

  const packageJson = await readAndParseFile('package.json', path.join(directory, 'package.json'));
  if (!packageJson) {
    throw new Error('Unable to parse package.json');
  }

  processPackageJson(packageJson, code);
  console.log('Validated package.json');

  const checkNpmrc = await fs.lstat(path.join(directory, '.npmrc'))
    .catch(() => undefined);

  if (!checkNpmrc || !checkNpmrc.isFile()) {
    throw new Error(`.npmrc file not found or is not file in directory: ${directory}`);
  }

  console.log('Validated .npmrc');
}

(async () => {
  try {
    const directory = './';
    await processArtifact(directory);
    console.log('Validation of artifact completed successfully.');
    process.exit(0);
  } catch (error: any) {
    console.error(`Validation failed \n${error.message}\n${JSON.stringify(error.stack)}`);
    process.exit(1);
  }
})();
