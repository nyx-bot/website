const fs = require('fs')

const parseDir = (dir) => {
    try {
        console.log(`Reading ${dir}`);
        
        let returnArr = [];

        const readObj = (o) => {
            if(o.forEach) {
                o.forEach(e => {
                    if(typeof e == `object` && typeof e.length == `number`) {
                        readObj(e);
                    } else {
                        returnArr.push(e)
                    }
                })
            } else {
                returnArr.push(o)
            }
        }
        
        fs.readdirSync(dir).map(dir2 => parseDir(dir + `/` + dir2)).forEach(readObj);

        return returnArr;
    } catch(e) {
        //console.log(`Failed reading ${dir} as a directory (${e}), reading as file instead...`);

        try {
            const f = require(dir);

            const conf = {
                endpoint: f.endpoint || dir.replace(__dirname + `/`, ``).split(`.`).slice(0, -1).join(`.`) || null,
                endpoints: f.endpoints || null,
                title: f.title || null,
                func: typeof f.func == `function` ? f.func : typeof f == `function` ? f : null,
            };

            if(typeof conf.func == `function` && conf.endpoint) {
                return conf;
            } else {
                return null;
            }
        } catch(e2) {
            console.log(`Failed importing ${dir} natively via require: ${e2}`);

            return null;
        }
    }
}

module.exports = (dir) => parseDir(dir)