const fs = require('fs');
const path = require('path');

const directoryPath = __dirname;

function optimizeHtmlFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // 1. Add defer to all script tags that have src but don't have defer/async
    content = content.replace(/<script\s+([^>]*src="[^"]+"[^>]*)>/gi, (match, p1) => {
        if (p1.includes('defer') || p1.includes('async')) {
            return match;
        }
        return `<script ${p1} defer>`;
    });

    // 2. Add loading="lazy" to img tags that don't have it (excluding hero/above-fold ideally, but this adds to all missing)
    content = content.replace(/<img\s+([^>]*)>/gi, (match, p1) => {
        if (p1.includes('loading=')) {
            return match;
        }
        return `<img ${p1} loading="lazy" decoding="async">`;
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
                } else if (stat.isDirectory() && file !== 'node_modules' && file !== '.git') {
                    // Optional: process recursively if needed, but not necessary here
                    // processDirectory(filePath);
                }
            });
        });
    });
}

console.log("Memulai proses optimasi file HTML...");
processDirectory(directoryPath);
