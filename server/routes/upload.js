const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/productos');

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;
    // si no viene ningun archivo
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha selecionado nigún archivo'
            }
        })
    };

    // Validar tipo // usuarios / productos
    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Las tipos permitidas son ${tiposValidos.join(', ')}`
            }
        })
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    // extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg', 'PNG'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: `Las extensiones permitidas son ${extensionesValidas.join(', ')}`
            }
        })
    }

    // modificar el nombre del archivo
    // 43t446456446-45.jpg

    let nombreArchivo = `${id}-${ new Date().getMilliseconds() }.${extension}`;

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });


        // imagen cargada
        // Guardar registro
        switch (tipo) {
            case 'usuarios':
                ImagenUsuario(id, res, nombreArchivo);
                break;
            case 'productos':
                ImagenProducto(id, res, nombreArchivo);
                break;
            default:
                break;
        }
    });
});

function ImagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            // Borrar archivo
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            // Borrar archivo
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario  no existe'
                }
            })
        }

        // Borrar archivo anterior
        borrarArchivo(usuarioDB.img, 'usuarios');

        // Guardar usuario
        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            res.json({
                ok: false,
                usuario: usuarioGuardado,
                img: nombreArchivo

            })
        })

    })
}

function ImagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, ProductoDB) => {
        if (err) {
            // Borrar archivo
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!ProductoDB) {
            // Borrar archivo
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            })
        }

        // Borrar archivo anterior
        borrarArchivo(ProductoDB.img, 'productos');

        // Guardar producto
        ProductoDB.img = nombreArchivo;
        ProductoDB.save((err, productoGuardado) => {
            res.json({
                ok: false,
                producto: productoGuardado,
                img: nombreArchivo

            })
        })

    })
}

function borrarArchivo(nombreImagen, tipo) {
    // borrar imagen antrior si existe
    let pathImage = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);
    //confirmar que el path existe 
    if (fs.existsSync(pathImage)) {
        // Si existe hay que borrarla
        fs.unlinkSync(pathImage);
    }
}

module.exports = app;