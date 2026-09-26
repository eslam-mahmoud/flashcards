import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Single source of truth for every activity: drives the routes, page titles and the home menu.
export const activities = [
    { slug: 'ar-alpha', label: 'أ ب ت', title: 'تعلم الحروف العربية' },
    { slug: 'math', label: '✖️ Math', title: 'Math Practice' },
    { slug: 'fraction', label: '➕ Fraction Math', title: 'Fraction Math' },
    { slug: 'clock', label: '🕰️ Clock', title: 'Read the Clock' },
    { slug: 'operations', label: '⚖️ Compare Numbers', title: 'Compare Numbers' },
    { slug: 'fractions', label: '🍕 Name the Fraction', title: 'Name the Fraction' },
    { slug: 'words', label: '📚 Words', title: "Let's Learn Words" },
    { slug: 'long-division', label: '➗ Long Division', title: 'Long Division' },
    { slug: 'before-after', label: '🔁 Before or After', title: 'Before or After?' },
    { slug: 'sort', label: '🔢 Sort Numbers', title: 'Sort the Numbers' }
];

const app = express();

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/layout');
app.use(expressLayouts);

// Static files (resolved from this file, not the process cwd, so it also works in Lambda)
app.use(express.static(path.join(__dirname, 'public')));
// Client libraries served from node_modules instead of third-party CDNs
app.use('/vendor/jquery', express.static(path.dirname(require.resolve('jquery/dist/jquery.min.js'))));
app.use('/vendor/confetti', express.static(path.dirname(require.resolve('canvas-confetti/dist/confetti.browser.js'))));

// Routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Learning Activities', activities });
});

activities.forEach(activity => {
    app.get(`/${activity.slug}`, (req, res) => {
        res.render(activity.slug, { title: activity.title });
    });
});

app.use((req, res) => {
    res.status(404).render('not-found', { title: 'Page not found' });
});

// export it for serverless
export default app;
