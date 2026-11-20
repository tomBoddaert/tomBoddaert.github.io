import { fetchProjects, loadProject } from '../projects/projects.ts';

const observerElement = document.getElementById('Observer') as HTMLSpanElement;

const prerendered = document.getElementsByTagName('tb-project').length;
const projects = await fetchProjects();

let nextProjectIndex = prerendered;

const observer = new IntersectionObserver(async (observation) => {
  if (observation.length === 0 || !observation[0]?.isIntersecting) {
    return;
  }

  observer.unobserve(observerElement);

  const nextProject = projects[nextProjectIndex++];
  if (!nextProject) {
    return;
  }

  if (nextProjectIndex !== 1) {
    const line = document.createElement('hr');
    observerElement.insertAdjacentElement('beforebegin', line);
  }

  const projectElement = await loadProject(nextProject);
  observerElement.insertAdjacentElement('beforebegin', projectElement);

  observer.observe(observerElement);
});
observer.observe(observerElement);
