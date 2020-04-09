require('./config/config')

const express = require('express')
const app = express()

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/usuarios', function(req, res) {
    res.send('GET USUARIO')
})
app.post('/usuarios', function(req, res) {
    let body = req.body;
    let id = req.params.id;
    res.json(body)
})
app.put('/usuarios/:id', function(req, res) {
    let body = req.body;
    let id = req.params.id;
    res.json(body)
})
app.delete('/usuarios', function(req, res) {
    res.send('DELETE USUARIO')
})

app.listen(process.env.PORT, () => {
    console.log(`Escuchando por el puerto ${process.env.PORT}`)
})