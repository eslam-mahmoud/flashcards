// Pre-render the Express/EJS app into static files for Cloudflare Pages.
// Every page runs entirely in the browser once rendered, so no server is needed:
//   dist/index.html, dist/<activity>.html (served at /<activity>), dist/404.html,
//   plus public/ assets and the vendored client libraries.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import app, { activities } from '../app.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, 'dist');
const require = createRequire(import.meta.url);

fs.rmSync(dist, { recursive: true, force: true });
fs.cpSync(path.join(root, 'public'), dist, { recursive: true });
fs.mkdirSync(path.join(dist, 'vendor/jquery'), { recursive: true });
fs.mkdirSync(path.join(dist, 'vendor/confetti'), { recursive: true });
fs.copyFileSync(require.resolve('jquery/dist/jquery.min.js'), path.join(dist, 'vendor/jquery/jquery.min.js'));
fs.copyFileSync(require.resolve('canvas-confetti/dist/confetti.browser.js'), path.join(dist, 'vendor/confetti/confetti.browser.js'));

const server = app.listen(0);
await new Promise(resolve => server.once('listening', resolve));
const baseUrl = `http://127.0.0.1:${server.address().port}`;

const pages = [
    ['/', 'index.html', 200],
    ...activities.map(activity => [`/${activity.slug}`, `${activity.slug}.html`, 200]),
    ['/404', '404.html', 404]
];

try {
    for (const [route, file, expectedStatus] of pages) {
        const res = await fetch(baseUrl + route);
        if (res.status !== expectedStatus) {
            throw new Error(`${route} returned ${res.status}, expected ${expectedStatus}`);
        }
        fs.writeFileSync(path.join(dist, file), await res.text());
        console.log(`built ${file}`);
    }
} finally {
    server.close();
}
