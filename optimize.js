const fs = require('fs');
const path = require('path');

const directoryPath = __dirname;

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

    // 2. Preconnect to fonts.gstatic.com (ensure it exists if googleapis exists)
    if (content.includes('fonts.googleapis.com') && !content.includes('fonts.gstatic.com')) {
        content = content.replace(
            '<link rel="preconnect" href="https://fonts.googleapis.com">',
            '<link rel="preconnect" href="https://fonts.googleapis.com">\n  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
        );
    }

    // 3. Image Optimization: Lazy loading and decoding, plus fetchpriority for hero
    content = content.replace(/<img\s+([^>]*)>/gi, (match, attrs) => {
        let newAttrs = attrs;
        
        // If it's hero/LCP image, prioritize it and remove lazy loading if it's there
        if (attrs.includes('hero.webp') || attrs.includes('hero-bg')) {
            if (!attrs.includes('fetchpriority=')) {
                newAttrs += ' fetchpriority="high"';
            }
            newAttrs = newAttrs.replace(/\s*loading="lazy"/g, '');
        } else {
            // Add loading="lazy" if not present
            if (!attrs.includes('loading=')) {
                newAttrs += ' loading="lazy"';
            }
        }

        // Add decoding="async" if not present
        if (!attrs.includes('decoding=')) {
            newAttrs += ' decoding="async"';
        }

        // Ensure alt text is present
        if (!attrs.includes('alt=')) {
            newAttrs += ' alt="Image"';
        }

        // Only reconstruct if attrs changed
        if (newAttrs !== attrs) {
            return `<img ${newAttrs.trim()}>`;
        }
        return match;
    });

    // 4. Render-blocking Scripts: Add defer to local scripts
    content = content.replace(/<script\s+([^>]*src="[^"]+"[^>]*)>/gi, (match, p1) => {
        if (!p1.includes('defer') && !p1.includes('async')) {
            return `<script ${p1} defer>`;
        }
        return match;
    });

    // 5. Accessibility: aria-labels for icon-only links (socials, scroll-top, etc)
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

    // Add aria-label for toggle buttons if any
    content = content.replace(/<button\s+([^>]*class="[^"]*(toggle)[^"]*"[^>]*)>/gi, (match, p1) => {
         if (!p1.includes('aria-label=')) {
             return `<button ${p1} aria-label="Toggle">`;
         }
         return match;
    });

    // 6. Accessibility: Add aria-label to empty links with icons
    // Match <a><i class="..."></i></a> where <a> has no text
    const emptyIconLinkRegex = /<a\s+([^>]*)>\s*<i\s+class="[^"]*bi-([^"]+)"[^>]*><\/i>\s*<\/a>/gi;
    content = content.replace(emptyIconLinkRegex, (match, aAttrs, iconName) => {
        if (!aAttrs.includes('aria-label=')) {
            // Create a label based on icon name
            const label = iconName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return `<a ${aAttrs} aria-label="${label}"><i class="bi bi-${iconName}"></i></a>`;
        }
        return match;
    });


    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Optimized: ${path.basename(filePath)}`);
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
                } else if (stat.isDirectory() && file !== 'node_modules' && file !== '.git' && file !== 'assets') {
                    processDirectory(filePath);
                }
            });
        });
    });
}

console.log("Memulai proses optimasi file HTML secara mendalam...");
processDirectory(directoryPath);
