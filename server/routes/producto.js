const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/authentication');

let app = express();
let Producto = require('../models/productos');


// ================================
// Buscar productos
// ================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;


    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })
        })

})


// ================================
// Obtener productos
// ================================
app.get('/productos', verificaToken, (req, res) => {
    // traer todos los productos
    // populate: usuario categoria
    // paginado

    Producto.find({})
        .populate('usuario', 'nombre rol')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.countDocuments((err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    conteo
                })
            })
        })
})

// ================================
// Obtener un producto por ID
// ================================
app.get('/productos/:id', verificaToken, (req, res) => {
    // populate: usuario categoria

    let id = req.params.id;

    Producto.findById(id, (err, producto) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        return res.json({
            ok: true,
            producto
        })
    });
});

// ================================
// Crear un producto 
// ================================
app.post('/productos', [verificaToken, verificaAdmin_Role], (req, res) => {
    let body = req.body

    console.log(req)

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// ================================
// Actualizar producto
// ================================
app.put('/productos/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // verificar userRole
    let id = req.params.id;
    let body = req.body;

    let updCategoria = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion
    };

    Producto.findByIdAndUpdate(id, updCategoria, { new: true, runValidators: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: productoDB
        });
    });


});

// ================================
// Borrar un producto
// ================================
app.delete('/productos/:id', (req, res) => {
    // Update estatus
    let id = req.params.id;

    let body = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, body, [verificaToken, verificaAdmin_Role], (err, productoBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoBorrado
        });
    });
})


module.exports = app;