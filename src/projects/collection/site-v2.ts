import { type ProjectScriptRun } from '../projects.ts';

export function run(this: HTMLDivElement) {
  console.log(
    "I've now migrated away from using my own framework to Astro.\n(This is from a script added to the 'Site v2' project to remind me of how to make them.)",
  );
}
run satisfies ProjectScriptRun;
