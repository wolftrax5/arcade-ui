#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const componentsDir = path.join(root, 'src', 'components');
const barrelPath = path.join(root, 'src', 'index.ts');
const templatesDir = path.join(root, 'templates', 'component');

function pascalCase(input) {
  return input
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function render(template, name) {
  return template.replaceAll('{{name}}', name);
}

const rawName = process.argv[2];
if (!rawName) {
  console.error('Usage: pnpm scaffold <ComponentName>');
  process.exit(1);
}

const name = pascalCase(rawName);
const dest = path.join(componentsDir, name);

if (fs.existsSync(dest)) {
  console.error(`Component ${name} already exists at ${dest}`);
  process.exit(1);
}

fs.mkdirSync(dest, { recursive: true });

const files = [
  { template: 'Component.tsx.tpl', output: `${name}.tsx` },
  { template: 'Component.module.css.tpl', output: `${name}.module.css` },
  { template: 'Component.stories.tsx.tpl', output: `${name}.stories.tsx` },
];

for (const file of files) {
  const source = fs.readFileSync(path.join(templatesDir, file.template), 'utf8');
  fs.writeFileSync(path.join(dest, file.output), render(source, name));
}

const exportBlock = `
export { ${name} } from './components/${name}/${name}';
export type { ${name}Props } from './components/${name}/${name}';
`;

const barrel = fs.readFileSync(barrelPath, 'utf8');
if (!barrel.includes(`export { ${name} }`)) {
  fs.writeFileSync(barrelPath, `${barrel.trimEnd()}\n${exportBlock}`);
}

console.log(`Scaffolded ${name} at src/components/${name}`);
