require('./config/config')

const express = require('express')
const mongoose = require('mongoose');
const path = require('path');

const app = express()

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())


// habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

console.log(path.resolve(__dirname + '/public'))


// Configuración global de rutas
app.use(require('./routes/index'));

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