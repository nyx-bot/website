module.exports = {
    endpoint: `/`,
    func: async (req, res) => {
        const home = require('fs').readFileSync(`./html/home.html`).toString();
        res.send(home)
    }
}