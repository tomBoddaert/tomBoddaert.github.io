import { fetchProjectNames, loadProject } from './projects.ts';

// TypeScript does not seem to have a HTMLSectionElement
const projectElement = document.getElementById(
  'LatestProject',
) as HTMLDivElement;

const [projectName] = await fetchProjectNames();

await loadProject(projectName, projectElement);
