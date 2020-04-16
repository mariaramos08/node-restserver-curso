const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/authentication');

let app = express();
let Categoria = require('../models/categoria');


// ================================
// Mostrar todas las categorias
// ================================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.countDocuments((err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    conteo
                })
            })
        });
});

// ================================
// Mostrar una categoria por ID
// ================================
app.get('/categoria/:id', (req, res) => {
    // Categoria.findById(....)

    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        return res.json({
            ok: true,
            categoria: categoria.descripcion
        })
    })
});

// ================================
// Crear nueva categoria
// ================================
app.post('/categoria', verificaToken, (req, res) => {

    // Regresa la nueva categoria
    let body = req.body;

    console.log(req.usuario)

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

// ================================
// Actualizar categoria Descripcion
// ================================
app.put('/categoria/:id', [verificaToken], (req, res) => {

    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});

// ================================
// Mostrar todas las categorias
// ================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // Solo un Admin puede borrar categorias
    // Categoria.findByIdAndRemove
    let id = req.params.id;
    Categoria.findOneAndDelete(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaBorrada
        });
    })
});


// ================================
// Grabar en PostMan
// ================================


module.exports = app;