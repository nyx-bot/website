const express = require('express');
const app = express();
app.use(express.json());

const fs = require('fs')

const update = process.argv.indexOf(`--debug`) !== -1 ? () => new Promise(r => r(console.log(`not updating, debug enabled`))) : require(`./utils/update`)

update().then(async () => {
    const updInterval = setInterval(update, 60000);
    console.log(`Created auto-update interval!`);

    const endpoints = require(`./utils/parseDir`)(__dirname + `/endpoints`);

    console.log(`registered endpoints:`, endpoints);

    for (e of endpoints) {
        const method = (e && e.method && typeof e.method == `string` && typeof app[e.method.toLowerCase()] == `function` ? e.method : `get`).toLowerCase();
        console.log(`Registering [${method.toUpperCase()}] / ${e.endpoint}`)

        try {
            app[method](e.endpoint, e.func);
        } catch(e) {
            console.log(`Failed to register [${method.toUpperCase()}] / ${e.endpoint}: ${e}`)
        }
    };

    const port = process.argv.find(s => s.startsWith(`--port=`)) && !isNaN(process.argv.find(s => s.startsWith(`--port=`)).split(`=`)[1]) && Number(process.argv.find(s => s.startsWith(`--port=`)).split(`=`)[1]) > 0 !== -1 ? Number(process.argv.find(s => s.startsWith(`--port=`)).split(`=`)[1]) : 1024

    const server = app.listen(port);

    console.log(`listening on port ${server._connectionKey.split(`:`).slice(-1)[0]}`)
})