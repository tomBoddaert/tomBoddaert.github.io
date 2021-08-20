import { compileProjectAsync } from '@tom.boddaert/sitetree';
compileProjectAsync(undefined, { prettify: true, debug: true })
    .catch(console.error);
