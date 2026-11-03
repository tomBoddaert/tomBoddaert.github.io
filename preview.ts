import { serveFile } from '@std/http/file-server';
import * as path from '@std/path';
import { assert } from '@std/assert';

const ROOT = 'dist';

export function resolvePath(pathname: string): string {
  if (pathname.endsWith('/')) {
    pathname += 'index';
  }

  const lastSeperator = pathname.lastIndexOf('/');
  const filename = pathname.slice(lastSeperator + 1);
  if (!filename.includes('.')) {
    pathname += '.html';
  }

  assert(pathname.startsWith('/'));
  pathname = path.normalize(pathname); // `path.normalize` to prevent directory traversal

  return path.join(ROOT, pathname);
}

class Server {
  requested: Set<string>;

  constructor() {
    this.requested = new Set();
  }

  async handle<Addr extends Deno.Addr = Deno.Addr>(
    request: Request,
    _info: Deno.ServeHandlerInfo<Addr>,
  ): Promise<Response> {
    if (request.method != 'GET') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const pathname = new URL(request.url).pathname;
    const resolved = resolvePath(new URL(request.url).pathname);
    const response = await serveFile(request, resolved);

    if (!this.requested.has(pathname)) {
      const { log, colour } = response.status < 400
        ? { log: console.log, colour: 'green' }
        : { log: console.error, colour: 'red' };
      log(
        `[%c${response.status}%c] ${pathname} => ${resolved}`,
        `color: ${colour}`,
        'color: unset',
      );
      this.requested.add(pathname);
    }

    return response;
  }

  get handler(): Deno.ServeHandler {
    return this.handle.bind(this);
  }
}

export default {
  fetch: new Server().handler,
};
