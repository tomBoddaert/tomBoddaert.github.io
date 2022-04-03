import { readdir, copyFile } from 'fs/promises';
import { compileProjectAsync } from '@tom.boddaert/sitetree';
await compileProjectAsync(undefined, { prettify: true });
const resources = await readdir('src/resources');
for (let resource of resources) {
    if (resource.endsWith('.ts'))
        continue;
    await copyFile(`src/resources/${resource}`, `docs/resources/${resource}`);
}
