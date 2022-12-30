module.exports = {
    endpoints: [`terms`, `termsofservice`, `tos`],
    title: `Terms of Service`,
    func: (req, res) => {
        const file = require('fs').readFileSync(`./html/terms.html`).toString();
        res.send(file)
    }
}