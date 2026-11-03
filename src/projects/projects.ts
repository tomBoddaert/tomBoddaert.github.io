export const scriptMarker = '<!-- script -->';

export type ProjectScriptRun = (this: HTMLDivElement) => void;
export interface ProjectScript {
  run?: ProjectScriptRun;
}

export async function fetchProjectNames(): Promise<string[]> {
  return (await fetch('/projects/index')
    .then((response) => response.text())).split(/\s/)
    .filter((entry) => entry.length !== 0);
}

export async function loadProject(
  projectName: string,
  projectElement?: HTMLDivElement,
): Promise<HTMLDivElement> {
  const response = await fetch(`/projects/${projectName}`);
  let project: string;
  if (response.ok) {
    project = await response.text();
  } else {
    const explanation = response.status === 404 ? ' - project not found ' : ' ';
    project = `Error${explanation}(${response.status})`;
  }

  if (!projectElement) {
    projectElement = document.createElement('section') as HTMLDivElement;
  }
  projectElement.insertAdjacentHTML('afterbegin', project);

  if (project.includes(scriptMarker)) {
    import(`./collection/${projectName}.ts`)
      .then((script) => {
        script.run?.call(projectElement);
      });
  }

  projectElement.setAttribute('data-project-name', projectName);

  return projectElement;
}
