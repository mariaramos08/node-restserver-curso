require('./config/config')

const express = require('express')
const mongoose = require('mongoose');


const app = express()

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/usuario'));

mongoose.set('useCreateIndex', true);


mongoose.connect(process.env.URLDB, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    })
    .then(() => console.log("DB Connected!"))
    .catch(err => {
        console.log(`DB connection Error: ${err}`)
    });

app.listen(process.env.PORT, () => {
    console.log(`Escuchando por el puerto ${process.env.PORT}`)
})