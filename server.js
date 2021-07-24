const express = require('express')
const https = require('https')
const app = express()
const port = 3000

const red = "\x1b[31m"
const yellow = "\x1b[33m"

app.use(express.static('./ConsultantClicker'))

app.post("/api/trello", (req, res) => {

    const host = "api.trello.com"
    const label = "60e9ca86d66e2e1822939642"
    const listId = "60c11c4faec7d254b90f6a5b"
    const key = "fbd9d0099d94233747a9b62f70741bef"
    const token = "a84f11d8ce5f5ad43679748f661b9879023a94f15f5ee94563fbc9a86c6a3f68"

    const path =  "/1/cards?key=" + key + 
        "&token=" + token + 
        "&idList=" + listId +
        "&idLabels=" + label + 
        "&name=" + encodeURIComponent(req.query.name) + 
        "&desc=" + encodeURIComponent(req.query.description)

    const options = {
        hostname: host,
        path: path,
        method: 'POST'
    }

    const request = https.request(options, result => {
        result.on('data', (data) => {
           if (result.statusCode == 200) {
                res.send(`success`)
            } else {
                res.send('error')
                console.log(`Status ${result.statusCode}`)
            }
        })
    })
    request.end()
})

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
        socket.setTimeout(500)
        socket.on('timeout', () => {
            console.error(red, 'Namefake-api did not respond within 0.5s!')
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