const express = require('express');
const { verificaToken } = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');


//Buscar producto

app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {

            if (!productoDB) {
                return res.json({
                    ok: false,
                    message: 'Producto no encontrado'
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
                producto: productoDB
            })
        })
})


//Obtener productos

app.get('/productos', verificaToken, (req, res) => {
    //trae todos los productos
    // populate: usuario categoria 
    //paginado
    let desde = req.query.descripcion || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            })
        })
});


//obtener un producto por id

app.get('/productos/:id', verificaToken, (req, res) => {
    //trae todos los productos
    //paginado

    //mostrar una categoria por id
    let id = req.params.id;
    Producto.findById(id, (err, productoDB) => {

        if (!productoDB) {
            return res.json({
                ok: false,
                message: 'Producto no encontrado'
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
            producto: productoDB
        })
    });



});


app.post('/productos', verificaToken, (req, res) => {
    //crear un nuevo producto
    //grabar una categoria del listado
    //grabar el usuario

    let body = req.body;
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        categoria: body.categoria
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })
    })

});


app.put('/productos/:id', verificaToken, (req, res) => {
    //grabar una categoria del listado
    //grabar el usuario
    let id = req.params.id;
    let productoMod = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        precioUni: req.body.precio
    };

    Producto.findByIdAndUpdate(id, productoMod, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                message: 'No se encontro el id'
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })

});

app.delete('/productos/:id', verificaToken, (req, res) => {
    //disponible = false
    let id = req.params.id;
    let productoMod = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id, productoMod, { new: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        };

        res.json({
            ok: true,
            producto: productoDB,
            message: 'Producto deshabilitado'
        });
    })

});


module.exports = app;