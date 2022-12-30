const getPlaceholders = () => Promise.all([
    new Promise(async res => {
        require('superagent').get(require(`../config.json`).nyxbot.location + `/commandList`).then(r => {
            if(r && r.body) {
                console.log(`got commands list!`);
                global.placeholders.commands = r.body
            };

            res();
        })
    }),
    new Promise(async res => {
        require('superagent').get(require(`../config.json`).nyxbot.location + `/stats`).then(r => {
            if(r && r.body) {
                console.log(`got bot stats!`);
                global.placeholders.servercount = r.body.servers || `unknown`
                global.placeholders.usercount = r.body.users || `unknown`
                global.placeholders.musicsessions = r.body.connections || `unknown`
                global.placeholders.shards = r.body.shards || `unknown`
            };

            res();
        })
    })
])

module.exports = async () => {
    while(true) {
        console.log(`getting placeholders`)
        await getPlaceholders();
        await new Promise(r => setTimeout(r, 60000));
    }
}