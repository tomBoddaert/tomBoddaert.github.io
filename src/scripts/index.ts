import { fetchProjects, loadProjectPreview } from '../projects/projects.ts';

const observerElement = document.getElementById('Observer') as HTMLSpanElement;

const prerendered = document.getElementsByTagName('tb-project-preview').length;
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

  const projectElement = await loadProjectPreview(nextProject);
  observerElement.insertAdjacentElement('beforebegin', projectElement);

  observer.observe(observerElement);
});
observer.observe(observerElement);
