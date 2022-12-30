module.exports = {
    endpoints: [ "i", "invite" ],
    func: (req, res) => res.redirect(`https://discord.com/oauth2/authorize?scope=bot%20applications.commands&response_type=code&redirect_uri=https%3A%2F%2Fnyx.bot%2Fthankyou&guild-oauth&permissions=305654006&client_id=600206352916414464`)
}