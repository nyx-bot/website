module.exports = {
    endpoint: `/commands`,
    title: `Commands`,
    func: async (req, res) => {
        const commands = require('fs').readFileSync(`./html/commands.html`).toString().split(`\n`);

        const spacing = commands.find(s => s.includes(`<div class="col">`)).split(`<`)[0];

        const moduleStart = commands.findIndex(s => s == spacing + `<div class="col">`);
        const moduleEnd = commands.slice(moduleStart).findIndex(s => s == spacing + `</div>`) + 1
        
        const moduleContainer = commands.splice(moduleStart, moduleEnd);

        if(!global.placeholders.commands) {
            res.send(commands.join(`\n`))
        } else {
            for(m of Object.keys(global.placeholders.commands).reverse()) {
                let thisModule = moduleContainer.slice(0);
    
                thisModule[2] = thisModule[2].replace(`{{module}}`, m[0].toUpperCase() + m.slice(1));
    
                const insertAt = thisModule.findIndex(s => s.includes(`<h3>`))
                const nameStr = thisModule.splice(insertAt, 1)[0];
                const descriptionStr = thisModule.splice(insertAt, 1)[0];
    
                const cmds = global.placeholders.commands[m];
    
                cmds.reverse().forEach(cmd => {
                    thisModule.splice(insertAt, 0, descriptionStr.replace(`{{description}}`, cmd.description))
                    thisModule.splice(insertAt, 0, nameStr.replace(`{{name}}`, cmd.name).replace(`{{args}}`, cmd.usage.split(` `).slice(2).join(` `)))
                })
    
                commands.splice(moduleStart, 0, ...thisModule)
            };
    
            res.send(commands.join(`\n`))
        }
    }
}