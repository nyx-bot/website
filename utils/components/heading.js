module.exports = () => {
    const footerHtml = require('fs').readFileSync(`./html/components/heading.html`).toString().split(`\n`).filter(s => !s.includes(`<script`));

    return footerHtml.slice(footerHtml.findIndex(s => s.startsWith(`<body `))+1, footerHtml.findIndex(s => s.startsWith(`</body`)));
}