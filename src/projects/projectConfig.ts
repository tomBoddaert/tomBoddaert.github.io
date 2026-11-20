export interface ProjectConfig {
  id: string;
  script?: boolean;
}
export function resolveProjectConfig(
  project: string | ProjectConfig,
): ProjectConfig {
  if (typeof project === 'string') {
    return { id: project };
  }
  return project;
}
