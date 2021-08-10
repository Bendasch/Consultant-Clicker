const express = require('express')
const https = require('https')
const app = express()
const port = process.env.PORT || 3000

const red = "\x1b[31m"
const yellow = "\x1b[33m"

app.use(express.static('./ConsultantClicker'))

app.get("/api/namegen", (req, res) => {

    const options = {
        hostname: "api.namefake.com",
        method: 'GET'
    }

    const request = https.request(options, result => {
        result.on('data', (data) => {
            res.send({"company": JSON.parse(data).company})
        })
    })
    
    request.on('socket', (socket) => {
        socket.setTimeout(350)
        socket.on('timeout', () => {
            console.error(red, 'Namefake-api did not respond within 0.35s!')
            res.send({company: "Random Company"})
            request.destroy();
        })
    })

    request.on('error', (error) => {
        if (error.code === "ECONNRESET") {
            console.error(yellow, 'Connection destroyed!')
        }
    })

    request.end()
})

app.listen(port, () => console.log(`listening on port ${port}!`))