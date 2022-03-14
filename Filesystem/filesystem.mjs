import { readFile, writeFile } from 'fs/promises';

let template = await readFile(
  new URL('./index.html', import.meta.url),
  'utf-8'
);

const data = { title: 'changed', body: 'changed' };

for (const [key, val] of Object.entries(data)) {
  template = template.replace(`{${key}}`, val);
}
console.log(template);
await writeFile(new URL('./final.html', import.meta.url), template);
