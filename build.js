const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');

// Paths
const CONTENT_DIR = path.join(__dirname, 'src', 'content');
const TEMPLATE_DIR = path.join(__dirname, 'src', 'templates');
const PUBLIC_DIR = path.join(__dirname, 'public');

async function buildSite() {
    // Ensure public directory exists
    await fs.ensureDir(PUBLIC_DIR);

    // Copy static assets
    await fs.copy(path.join(__dirname, 'src', 'static'), PUBLIC_DIR, { overwrite: true });

    // Build pages
    const pages = await fs.readdir(path.join(CONTENT_DIR, 'pages'));
    for (const page of pages) {
        if (page.endsWith('.md')) {
            const content = await fs.readFile(path.join(CONTENT_DIR, 'pages', page), 'utf-8');
            const html = marked(content);
            const template = await fs.readFile(path.join(TEMPLATE_DIR, 'page.html'), 'utf-8');
            const finalHtml = template.replace('{{content}}', html);
            const outputPath = path.join(PUBLIC_DIR, page.replace('.md', '.html'));
            await fs.writeFile(outputPath, finalHtml);
        }
    }

    // Build blog posts
    const posts = await fs.readdir(path.join(CONTENT_DIR, 'posts'));
    for (const post of posts) {
        if (post.endsWith('.md')) {
            const content = await fs.readFile(path.join(CONTENT_DIR, 'posts', post), 'utf-8');
            const html = marked(content);
            const template = await fs.readFile(path.join(TEMPLATE_DIR, 'post.html'), 'utf-8');
            const finalHtml = template.replace('{{content}}', html);
            const outputPath = path.join(PUBLIC_DIR, 'posts', post.replace('.md', '.html'));
            await fs.ensureDir(path.join(PUBLIC_DIR, 'posts'));
            await fs.writeFile(outputPath, finalHtml);
        }
    }
}

buildSite().catch(console.error); 