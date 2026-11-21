import express from 'express';
import type {NextFunction, Request, Response} from 'express';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import zlib from 'node:zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

const COMPRESSIBLE_CONTENT_TYPES = [
  'text/html',
  'text/css',
  'application/javascript',
  'text/javascript',
  'application/json',
  'image/svg+xml',
];

function gzipMiddleware(req: Request, res: Response, next: NextFunction): void {
  const acceptEncoding = req.headers['accept-encoding'] || '';
  if (
    !acceptEncoding.includes('gzip') ||
    req.method === 'HEAD' ||
    Boolean(req.headers.range) ||
    req.path.startsWith('/assets/aistudio')
  ) {
    next();
    return;
  }

  const origWrite = res.write.bind(res);
  const origEnd = res.end.bind(res);
  const chunks: Buffer[] = [];
  let shouldCompress: boolean | null = null;

  const checkCompressible = (): boolean => {
    if (shouldCompress !== null) return shouldCompress;
    if (res.getHeader('Content-Encoding')) {
      shouldCompress = false;
      return false;
    }
    const contentType = String(res.getHeader('Content-Type') || '').toLowerCase();
    shouldCompress = COMPRESSIBLE_CONTENT_TYPES.some((type) => contentType.includes(type));
    return shouldCompress;
  };

  res.write = ((
    chunk: unknown,
    encodingOrCallback?: BufferEncoding | ((error?: Error | null) => void),
    callback?: (error?: Error | null) => void,
  ): boolean => {
    if (!checkCompressible()) {
      return origWrite(chunk as never, encodingOrCallback as never, callback as never);
    }
    if (chunk !== undefined && chunk !== null) {
      const encoding = typeof encodingOrCallback === 'string' ? encodingOrCallback : 'utf8';
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk), encoding));
    }
    if (typeof encodingOrCallback === 'function') encodingOrCallback();
    else if (typeof callback === 'function') callback();
    return true;
  }) as typeof res.write;

  res.end = ((
    chunk?: unknown,
    encodingOrCallback?: BufferEncoding | (() => void),
    callback?: () => void,
  ): Response => {
    if (!checkCompressible()) {
      return origEnd(chunk as never, encodingOrCallback as never, callback as never);
    }

    if (chunk !== undefined && chunk !== null && typeof chunk !== 'function') {
      const encoding = typeof encodingOrCallback === 'string' ? encodingOrCallback : 'utf8';
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk), encoding));
    }

    const raw = Buffer.concat(chunks);
    if (raw.length < 1024) {
      res.setHeader('Content-Length', raw.length);
      return origEnd(raw, () => {
        if (typeof encodingOrCallback === 'function') encodingOrCallback();
        else if (typeof callback === 'function') callback();
      });
    }

    zlib.gzip(raw, {level: zlib.constants.Z_BEST_COMPRESSION}, (err, compressed) => {
      if (err) {
        origEnd(raw);
        return;
      }
      res.removeHeader('Content-Length');
      res.setHeader('Content-Encoding', 'gzip');
      res.setHeader('Vary', 'Accept-Encoding');
      res.setHeader('Content-Length', compressed.length);
      origEnd(compressed, () => {
        if (typeof encodingOrCallback === 'function') encodingOrCallback();
        else if (typeof callback === 'function') callback();
      });
    });
    return res;
  }) as typeof res.end;

  next();
}

async function startServer(): Promise<void> {
  const app = express();
  app.disable('x-powered-by');
  app.use(gzipMiddleware);

  const publicAssetsDir = path.resolve(__dirname, 'public/assets');
  if (fs.existsSync(publicAssetsDir)) {
    app.use(
      '/assets/aistudio',
      express.static(path.join(publicAssetsDir, 'aistudio'), {
        maxAge: isProduction ? '7d' : '1h',
        acceptRanges: true,
        etag: true,
        lastModified: true,
        setHeaders(res, filePath) {
          res.setHeader('X-Content-Type-Options', 'nosniff');
          if (filePath.endsWith('.jpg') || filePath.endsWith('.mp4')) {
            res.setHeader(
              'Cache-Control',
              isProduction
                ? 'public, max-age=604800, stale-while-revalidate=86400'
                : 'public, max-age=3600',
            );
          }
        },
      }),
    );
  }

  if (!isProduction) {
    const {createServer: createViteServer} = await import('vite');
    const vite = await createViteServer({
      server: {middlewareMode: true},
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(
      '/assets',
      express.static(path.join(distDir, 'assets'), {
        maxAge: '1y',
        immutable: true,
        etag: true,
        setHeaders(res) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        },
      }),
    );

    app.use(
      express.static(distDir, {
        maxAge: '1h',
        etag: true,
        setHeaders(res, filePath) {
          if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache, must-revalidate');
          }
        },
      }),
    );

    app.get('*', (_req: Request, res: Response) => {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Realeza Visagismo server listening on http://localhost:${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer();
