const express = require('express');

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

app.get('/categoria', (req, res) => {

    //mostrar todas las categorias

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            })
        })

});

app.get('/categoria/:id', (req, res) => {

    //mostrar una categoria por id
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {

        if (!categoriaDB) {
            return res.json({
                ok: false,
                message: 'Categoria no encontrada'
            })
        }

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });

        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });

});

app.post('/categoria', verificaToken, (req, res) => {

    //crear una nueva categoria y regresarla
    // req.usuario._id

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    })

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

});

app.put('/categoria/:id', verificaToken, (req, res) => {

    //actualizar descripcion de la categoria
    let id = req.params.id;
    let descripcion = {
        descripcion: req.body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descripcion, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                message: 'No se encontro el id'
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    })

});

app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {

    //solo un administrador puede borrar la categoria
    //Categoria.findByIdAndRemove

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        };

        res.json({
            ok: true,
            categoria: categoriaDB,
            message: 'Categoria Borrada'
        });
    })

});


module.exports = app;