import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app, { activities } from '../app.mjs';

let server;
let baseUrl;

before(async () => {
    server = app.listen(0);
    await new Promise(resolve => server.once('listening', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => server.close());

async function get(path) {
    const res = await fetch(baseUrl + path);
    return { status: res.status, body: await res.text() };
}

test('home page links to every activity', async () => {
    const { status, body } = await get('/');
    assert.equal(status, 200);
    for (const activity of activities) {
        assert.ok(body.includes(`href="/${activity.slug}"`), `missing link to ${activity.slug}`);
    }
});

test('every activity page renders and its scripts and styles resolve', async () => {
    for (const activity of activities) {
        const { status, body } = await get(`/${activity.slug}`);
        assert.equal(status, 200, activity.slug);
        const escapedTitle = activity.title.replace(/'/g, '&#39;');
        assert.ok(body.includes(`<title>${escapedTitle}</title>`), `${activity.slug} title`);
        const assets = [...body.matchAll(/(?:src|href)="(\/(?:js|css|vendor)\/[^"]+)"/g)].map(m => m[1]);
        assert.ok(assets.includes(`/js/${activity.slug}.js`), `${activity.slug} loads its script`);
        for (const asset of assets) {
            assert.equal((await get(asset)).status, 200, `${activity.slug}: ${asset}`);
        }
    }
});

test('unknown pages return 404', async () => {
    const { status } = await get('/does-not-exist');
    assert.equal(status, 404);
});
