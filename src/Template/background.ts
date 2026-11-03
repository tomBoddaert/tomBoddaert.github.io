import { experimental_AstroContainer } from 'astro/container';
import Background from '../Background.astro';

const container = experimental_AstroContainer.create();

export async function getBackground(light = false): Promise<string> {
  return await (await container).renderToString(Background, {
    props: { light },
  });
}

export async function getBackgroundUrl(light = false): Promise<string> {
  const bytes = new TextEncoder().encode(await getBackground(light));
  return 'data:image/svg+xml;base64,' +
    bytes.toBase64();
}
