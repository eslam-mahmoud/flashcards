import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// EJS setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/layout');
app.use(expressLayouts);

// Static files
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Learning Practice'
    });
});

app.get('/ar-alpha', (req, res) => {
    res.render('ar-alpha', {
        title: 'تعلم الحروف العربية'
    });
});

// Add placeholder routes for other pages
const pages = ['sort', 'math', 'fraction', 'clock', 'operations', 'fractions', 'words', 'long-division', 'ar-alpha', 'before-after'];
pages.forEach(page => {
    app.get(`/${page}`, (req, res) => {
        res.render(page, {
            title: page.charAt(0).toUpperCase() + page.slice(1)
        });
    });
});

// export it for serverless
export default app; 