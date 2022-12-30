module.exports = {
    endpoints: [`privacy`, `privacypolicy`],
    title: `Privacy Policy`,
    func: (req, res) => {
        const file = require('fs').readFileSync(`./html/privacy.html`).toString();
        res.send(file)
    }
}