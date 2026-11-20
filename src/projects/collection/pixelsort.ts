import { type ProjectScriptRun } from '../../projects/projects.ts';
import { ProjectElement } from '../../projects/ProjectElement.ts';

export function run(this: ProjectElement) {
  console.log('PixelSort script running');
}
run satisfies ProjectScriptRun;
