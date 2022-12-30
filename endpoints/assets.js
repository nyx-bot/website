module.exports = {
    endpoint: `/assets:path(*+)`,
    func: (req, res) => {
        if(!req.params.path.startsWith(`/`)) req.params.path = `/` + req.params.path
        const path = __dirname + req.params.path;
        console.log(path)
    }
}