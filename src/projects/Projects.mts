import { fetchProjectNames, loadProject } from './projects.ts';

const headerElement = document.getElementById('Header') as HTMLHeadingElement;
const observerElement = document.getElementById('Observer') as HTMLHRElement;

const projectNames = await fetchProjectNames();

function insertProject(project: HTMLDivElement) {
  observerElement.insertAdjacentElement('beforebegin', project);
}

const url = new URL(window.location.href);
const selectedProject = url.hash;
if (selectedProject === '') {
  activateObserver();
} else {
  headerElement.innerText = 'Project';
  insertProject(await loadProject(selectedProject.slice(1)));
}

function activateObserver() {
  let nextProjectIndex = 0;

  const observer = new IntersectionObserver(async (observation) => {
    if (observation.length === 0 || !observation[0]?.isIntersecting) {
      return;
    }

    observer.unobserve(observerElement);

    const projectName = projectNames[nextProjectIndex++];
    if (!projectName) {
      return;
    }

    if (nextProjectIndex !== 1) {
      const line = document.createElement('hr');
      observerElement.insertAdjacentElement('beforebegin', line);
    }

    insertProject(await loadProject(projectName));

    observer.observe(observerElement);
  });
  observer.observe(observerElement);
}
