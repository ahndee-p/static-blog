const fs = require('fs-extra');
const path = require('path');
const { marked } = require('marked');

// Paths
const CONTENT_DIR = path.join(__dirname, 'src', 'content');
const TEMPLATE_DIR = path.join(__dirname, 'src', 'templates');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Function to extract metadata from markdown content
async function getPostMetadata(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    const title = lines[0].replace('# ', '');
    const preview = lines.slice(2, 3).join('\n'); // Get the first paragraph after the title
    return { title, preview };
}

async function buildSite() {
    // Ensure public directory exists
    await fs.ensureDir(PUBLIC_DIR);

    // Copy static assets
    await fs.copy(path.join(__dirname, 'src', 'static'), PUBLIC_DIR, { overwrite: true });

    // Build blog posts and collect metadata
    const posts = await fs.readdir(path.join(CONTENT_DIR, 'posts'));
    const postMetadata = [];

    for (const post of posts) {
        if (post.endsWith('.md')) {
            // Get post metadata
            const metadata = await getPostMetadata(path.join(CONTENT_DIR, 'posts', post));
            postMetadata.push({
                ...metadata,
                url: `/posts/${post.replace('.md', '.html')}`,
                filename: post
            });

            // Build the post
            const content = await fs.readFile(path.join(CONTENT_DIR, 'posts', post), 'utf-8');
            const html = marked(content);
            const template = await fs.readFile(path.join(TEMPLATE_DIR, 'post.html'), 'utf-8');
            const finalHtml = template.replace('{{content}}', html);
            const outputPath = path.join(PUBLIC_DIR, 'posts', post.replace('.md', '.html'));
            await fs.ensureDir(path.join(PUBLIC_DIR, 'posts'));
            await fs.writeFile(outputPath, finalHtml);
        }
    }

    // Sort posts by filename (you could add dates to filenames for chronological order)
    postMetadata.sort((a, b) => a.filename.localeCompare(b.filename));

    // Generate blog index content
    const blogIndexContent = `# Blog

Welcome to my blog! Here you'll find my thoughts and experiences on web development, design, and technology.

## Latest Posts

${postMetadata.map(post => `### [${post.title}](${post.url})
${post.preview}`).join('\n\n')}`;

    // Write the generated blog index
    await fs.writeFile(path.join(CONTENT_DIR, 'pages', 'blog.md'), blogIndexContent);

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
}

buildSite().catch(console.error); 