const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

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
const pages = ['math', 'fraction', 'clock', 'operations', 'fractions', 'words', 'long-division'];
pages.forEach(page => {
    app.get(`/${page}`, (req, res) => {
        res.render(page, { 
            title: page.charAt(0).toUpperCase() + page.slice(1)
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 