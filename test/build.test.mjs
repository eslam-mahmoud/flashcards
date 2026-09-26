import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { activities } from '../app.mjs';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const dist = path.join(root, 'dist');

test('static build contains every page and the assets they reference', () => {
    execFileSync(process.execPath, [path.join(root, 'scripts/build.mjs')], { cwd: root });
    const pages = ['index.html', '404.html', ...activities.map(activity => `${activity.slug}.html`)];
    for (const page of pages) {
        const html = fs.readFileSync(path.join(dist, page), 'utf8');
        const assets = [...html.matchAll(/(?:src|href)="\/((?:js|css|vendor)\/[^"]+)"/g)].map(m => m[1]);
        assert.ok(assets.length > 0, `${page} references assets`);
        for (const asset of assets) {
            assert.ok(fs.existsSync(path.join(dist, asset)), `${page}: missing ${asset}`);
        }
    }
});
