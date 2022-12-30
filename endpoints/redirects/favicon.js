module.exports = {
    endpoints: [ "favicon.png", "favicon.ico" ],
    func: (req, res) => res.sendFile(__dirname.split(`endpoints/`)[0] + `/html/assets/img/favicon.png`)
}