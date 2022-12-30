const express = require('express');
const app = express();
app.use(express.json());

global.placeholders = {};
require(`./utils/placeholders`)()

const fs = require('fs');

const update = process.argv.indexOf(`--debug`) !== -1 ? () => new Promise(r => r(console.log(`not updating, debug enabled`))) : require(`./utils/update`)

update().then(async () => {
    const updInterval = setInterval(update, 60000);
    console.log(`Created auto-update interval!`);

    const endpoints = require(`./utils/parseDir`)(__dirname + `/endpoints`);

    console.log(`registered endpoints:`, endpoints);

    for (let e of endpoints) {
        const method = (e && e.method && typeof e.method == `string` && typeof app[e.method.toLowerCase()] == `function` ? e.method : `get`).toLowerCase();

        try {
            const addMethod = (method, endpoint) => {
                if(!endpoint.startsWith(`/`)) endpoint = `/` + endpoint;

                console.log(`Registering [${method.toUpperCase()}] / ${endpoint}`)

                app[method](endpoint, async (req, res) => {
                    console.log(`${req.method} / ${req.originalUrl} -- mapped? ${endpoint}`)
                    e.func(req, Object.assign(res, {
                        origSend: res.send,
                        send: (content) => {
                            if(typeof content == `string`) {
                                const navbar = require(`./utils/components/navbar`)();
                                const footer = require(`./utils/components/footer`)();
                                const heading = require(`./utils/components/heading`)();
        
                                let c2 = content.split(`\n`);
                                const tabWidth = c2[c2.findIndex(s => s.startsWith(`<body `)) + 1].split(`<`)[0]
    
                                if(e.title) c2.splice(c2.findIndex(s => s.startsWith(`<body `)) + 1, 0, ...heading.map(s => s.replace('{{title}}', e.title)));
        
                                //c2.splice(c2.findIndex(s => s.startsWith(`<body `)) + 1, 0, ...require(`./utils/navbar`).map(s => s.split(` `).filter(s => !s.startsWith(`sticky-`)).join(` `).replace(`backdrop-filter: blur(10px)`, `opacity: 0%`)), ...require(`./utils/navbar`));
                                c2.splice(c2.findIndex(s => s.startsWith(`<body `)) + 1, 0, ...navbar);
                                c2.splice(c2.findIndex(s => s.startsWith(`</body`)), 0, ...footer);
        
                                content = c2.join(`\n`);
        
                                Object.entries(global.placeholders).forEach((o) => {
                                    while(content.includes(`{{${o[0]}}}`)) {
                                        content = content.replace(`{{${o[0]}}}`, o[1])
                                    }
                                })
        
                                res.origSend(content);
                            } else res.origSend(content)
                        }
                    }))
                });

                app.use((req, res, next) => {
                    console.log(`${req.method} / ${req.originalUrl} -- mapped? none.`);
                    next()
                })
            }

            if(e.endpoints) {
                e.endpoints.forEach(endpoint => addMethod(method, endpoint))
            } else {
                addMethod(method, e.endpoint)
            }
        } catch(e) {
            console.log(`Failed to register [${method.toUpperCase()}] / ${e.endpoint}: ${e}`)
        }
    };

    const port = process.argv.find(s => s.startsWith(`--port=`)) && !isNaN(process.argv.find(s => s.startsWith(`--port=`)).split(`=`)[1]) && Number(process.argv.find(s => s.startsWith(`--port=`)).split(`=`)[1]) > 0 !== -1 ? Number(process.argv.find(s => s.startsWith(`--port=`)).split(`=`)[1]) : 1024

    const server = app.listen(port);

    console.log(`listening on port ${server._connectionKey.split(`:`).slice(-1)[0]}`)
})