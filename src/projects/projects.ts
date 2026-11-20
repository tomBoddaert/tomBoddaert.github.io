import { type ProjectConfig, resolveProjectConfig } from './projectConfig.ts';
import { type ProjectElement as ProjectElement } from './ProjectElement.ts';
import { ProjectPreviewElement } from './ProjectPreviewElement.ts';

export const scriptMarker = '<!-- script -->';

export type ProjectScriptRun = (this: ProjectElement) => void;
export interface ProjectScript {
  run?: ProjectScriptRun;
}

export async function fetchProjects(): Promise<(string | ProjectConfig)[]> {
  return (await fetch('/projects/data/index.json')
    .then((response) => response.json()));
}

export async function loadProjectPreview(
  project: string | ProjectConfig,
): Promise<ProjectPreviewElement> {
  const resolved = resolveProjectConfig(project);

  const response = await fetch(`/projects/data/previews/${resolved.id}`);
  let previewText: string;
  if (response.ok) {
    previewText = await response.text();
  } else {
    const explanation = response.status === 404 ? ' - project not found ' : ' ';
    previewText = `Error${explanation}(${response.status})`;
  }

  const previewElement = document.createElement(
    'tb-project-preview',
  ) as ProjectPreviewElement;
  previewElement.insertAdjacentHTML('afterbegin', previewText);

  previewElement.setAttribute('data-id', resolved.id);

  return previewElement;
}

export async function loadProject(
  project: string | ProjectConfig,
): Promise<ProjectElement> {
  const resolved = resolveProjectConfig(project);

  const response = await fetch(`/projects/data/${resolved.id}`);
  let projectText: string;
  if (response.ok) {
    projectText = await response.text();
  } else {
    const explanation = response.status === 404 ? ' - project not found ' : ' ';
    projectText = `Error${explanation}(${response.status})`;
  }

  const projectElement = document.createElement('tb-project') as ProjectElement;
  projectElement.insertAdjacentHTML('afterbegin', projectText);

  projectElement.setAttribute('data-id', resolved.id);
  if (resolved.script) {
    projectElement.setAttribute('data-script', '');
  }

  return projectElement;
}
