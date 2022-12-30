module.exports = () => {
    const navbarHtml = require('fs').readFileSync(`./html/components/navbar.html`).toString().split(`\n`).filter(s => !s.includes(`<script`));

    return navbarHtml.slice(navbarHtml.findIndex(s => s.startsWith(`<body `))+1, navbarHtml.findIndex(s => s.startsWith(`</body`)));
}