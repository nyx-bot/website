const fs = require('fs')

module.exports = {
    endpoint: `/assets:path(*+)`,
    func: (req, res) => {
        if(!req.params.path.startsWith(`/`)) req.params.path = `/` + req.params.path
        const path = __dirname.replace(`/endpoints`, ``) + `/html/assets` + req.params.path;

        if(fs.existsSync(path)) {
            res.sendFile(path)
        } else {
            if(fs.existsSync(path.replace(`/images/`, `/img/`))) {
                res.sendFile(path.replace(`/images/`, `/img/`))
            } else res.sendFile(__dirname.replace(`/endpoints`, ``) + `/html/assets/img/null.png`)
        }
    }
}