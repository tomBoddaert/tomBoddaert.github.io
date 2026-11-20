import { type CollectionEntry, getCollection } from 'astro:content';
import { type APIRoute } from 'astro';

import { type ProjectFrontmatter } from '../../../content.config.ts';
import { type ProjectConfig } from '../../../projects/projectConfig.ts';

export async function getProjects(): Promise<CollectionEntry<'projects'>[]> {
  const projects: CollectionEntry<'projects'>[] = await getCollection(
    'projects',
  );
  projects.sort((a, b) =>
    (a.data as ProjectFrontmatter).updated! <
        (b.data as ProjectFrontmatter).updated!
      ? 1
      : -1
  );
  return projects;
}

export const GET = (async () => {
  const projects = await getProjects();
  const ids: (string | ProjectConfig)[] = projects.map(({ id, data }) =>
    data.hasScript ? { id, script: true } : id
  );

  return new Response(JSON.stringify(ids));
}) satisfies APIRoute;
