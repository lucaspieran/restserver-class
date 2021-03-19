const { response, request } = require('express');

const usuariosGet = (req = request, res = response) => {
    const query = req.query;


    res.json({
        ok: true,
        msg: 'GET api',
        query
    });
}

const usuariosPost = (req, res) => {
    const { nombre, edad } = req.body;

    res.json({
        ok: true,
        msg: 'POST api - controller',
        nombre,
        edad
    });
}

const usuariosPut = (req, res) => {
    const id = req.params.id




    res.json({
        ok: true,
        msg: 'PUT api - controller',
        id
    });
}



const usuariosDelete = (req, res) => {
    res.json({
        ok: true,
        msg: 'DELETE api - controller'
    });
}





module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
}