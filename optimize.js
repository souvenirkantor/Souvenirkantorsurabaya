const fs = require('fs');
const path = require('path');

const directoryPath = __dirname;

function minifyCss(cssContent) {
    return cssContent
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ')             // Collapse whitespace
        .replace(/\s*([{}:;,])\s*/g, '$1')// Remove whitespace around tokens
        .trim();
}

function optimizeHtmlFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // 1. Font Optimization: Add &display=swap to Google Fonts
    content = content.replace(/href="https:\/\/fonts\.googleapis\.com\/css2\?([^"]+)"/gi, (match, p1) => {
        if (!p1.includes('display=swap')) {
            return `href="https://fonts.googleapis.com/css2?${p1}&display=swap"`;
        }
        return match;
    });

    // 2. Preconnect to fonts.gstatic.com
    if (content.includes('fonts.googleapis.com') && !content.includes('fonts.gstatic.com')) {
        content = content.replace(
            '<link rel="preconnect" href="https://fonts.googleapis.com">',
            '<link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
        );
    }

    // Preload main CSS
    if (content.includes('assets/css/main.css') && !content.includes('rel="preload" href="assets/css/main.css"')) {
         content = content.replace(
            '<link href="assets/css/main.css" rel="stylesheet">',
            '<link rel="preload" href="assets/css/main.css" as="style">\n  <link href="assets/css/main.css" rel="stylesheet">'
         );
    }

    // 3. Image Optimization: Lazy loading and decoding, plus fetchpriority for hero
    let heroImageToPreload = null;

    content = content.replace(/<img\s+([^>]*)>/gi, (match, attrs) => {
        let newAttrs = attrs;
        
        if (attrs.includes('hero.webp') || attrs.includes('hero-bg')) {
            if (!attrs.includes('fetchpriority=')) {
                newAttrs += ' fetchpriority="high"';
            }
            newAttrs = newAttrs.replace(/\s*loading="lazy"/g, '');
            
            // Extract src for preloading
            let srcMatch = attrs.match(/src="([^"]+)"/);
            if (srcMatch) heroImageToPreload = srcMatch[1];
        } else {
            if (!attrs.includes('loading=')) {
                newAttrs += ' loading="lazy"';
            }
        }

        if (!attrs.includes('decoding=')) {
            newAttrs += ' decoding="async"';
        }

        if (!attrs.includes('alt=')) {
            newAttrs += ' alt="Image"';
        }

        if (newAttrs !== attrs) {
            return `<img ${newAttrs.trim()}>`;
        }
        return match;
    });

    // 3.5 Inject Preload for Hero Image
    if (heroImageToPreload && !content.includes(`rel="preload" as="image" href="${heroImageToPreload}"`)) {
        content = content.replace(
            '</head>',
            `  <link rel="preload" as="image" href="${heroImageToPreload}">\n</head>`
        );
    }

    // 4. Render-blocking Scripts: Add defer to local scripts
    content = content.replace(/<script\s+([^>]*src="[^"]+"[^>]*)>/gi, (match, p1) => {
        if (!p1.includes('defer') && !p1.includes('async')) {
            return `<script ${p1} defer>`;
        }
        return match;
    });

    // 4.5. Defer Non-Critical CSS (glightbox and swiper)
    const deferCssRegex = /<link\s+href="([^"]+(?:glightbox|swiper)[^"]+\.css)"\s+rel="stylesheet">/gi;
    content = content.replace(deferCssRegex, (match, href) => {
        return `<link rel="preload" href="${href}" as="style" onload="this.onload=null;this.rel='stylesheet'">\n  <noscript><link href="${href}" rel="stylesheet"></noscript>`;
    });

    // 5. Accessibility: aria-labels for icon-only links
    content = content.replace(/<a\s+([^>]*class="[^"]*(instagram|threads|whatsapp|facebook|twitter|scroll-top|mobile-nav-toggle)[^"]*"[^>]*)>/gi, (match, p1) => {
        if (!p1.includes('aria-label=')) {
            let label = "Link";
            if (p1.includes('instagram')) label = "Instagram";
            else if (p1.includes('threads')) label = "Threads";
            else if (p1.includes('whatsapp')) label = "WhatsApp";
            else if (p1.includes('facebook')) label = "Facebook";
            else if (p1.includes('twitter')) label = "Twitter";
            else if (p1.includes('scroll-top')) label = "Scroll to Top";
            else if (p1.includes('mobile-nav-toggle')) label = "Toggle Mobile Menu";
            
            return `<a ${p1} aria-label="${label}">`;
        }
        return match;
    });

    content = content.replace(/<button\s+([^>]*class="[^"]*(toggle)[^"]*"[^>]*)>/gi, (match, p1) => {
         if (!p1.includes('aria-label=')) {
             return `<button ${p1} aria-label="Toggle">`;
         }
         return match;
    });

    const emptyIconLinkRegex = /<a\s+([^>]*)>\s*<i\s+class="[^"]*bi-([^"]+)"[^>]*><\/i>\s*<\/a>/gi;
    content = content.replace(emptyIconLinkRegex, (match, aAttrs, iconName) => {
        if (!aAttrs.includes('aria-label=')) {
            const label = iconName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return `<a ${aAttrs} aria-label="${label}"><i class="bi bi-${iconName}"></i></a>`;
        }
        return match;
    });

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Optimized HTML: ${path.basename(filePath)}`);
    }
}

function processDirectory(dirPath) {
    fs.readdir(dirPath, (err, files) => {
        if (err) {
            console.error("Could not list the directory.", err);
            process.exit(1);
        }

        files.forEach((file) => {
            const filePath = path.join(dirPath, file);
            fs.stat(filePath, (error, stat) => {
                if (error) {
                    console.error("Error stating file.", error);
                    return;
                }
                
                if (stat.isFile() && path.extname(file).toLowerCase() === '.html') {
                    optimizeHtmlFile(filePath);
                } else if (stat.isFile() && filePath.endsWith('assets\\css\\main.css')) {
                    // Minify main.css
                    let cssContent = fs.readFileSync(filePath, 'utf8');
                    let minified = minifyCss(cssContent);
                    if (minified.length < cssContent.length) {
                        fs.writeFileSync(filePath, minified, 'utf8');
                        console.log(`Minified CSS: main.css (Saved ${cssContent.length - minified.length} bytes)`);
                    }
                } else if (stat.isDirectory() && file !== 'node_modules' && file !== '.git') {
                    processDirectory(filePath);
                }
            });
        });
    });
}

console.log("Memulai proses optimasi tingkat lanjut (termasuk CSS Minification & Resource Preloading)...");
processDirectory(directoryPath);
