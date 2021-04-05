const { response, request } = require('express');
const bcryptjs = require('bcrypt');

const Usuario = require('../models/usuario');
const usuario = require('../models/usuario');



const usuariosGet = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query
    const query = { estado: true }

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios
        // total,
        // usuarios
    });
}

const usuariosPost = async (req, res) => {

    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, password, correo, rol });




    //hash pass
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();

    res.json({
        msg: 'POST api - controller',
        usuario
    });
}

const usuariosPut = async (req, res) => {
    const id = req.params.id
    const { password, google, correo, _id, ...resto } = req.body;

    //validar con bd
    if (password) {
        //encriptar
        const salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto)



    res.json({
        ok: true,
        msg: 'PUT api - controller',
        usuario
    });
}



const usuariosDelete = async (req, res) => {
    const { id } = req.params

    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false });

    const usuarioAutenticado = req.usuario

    res.json({
        usuario,
        usuarioAutenticado
    });
}





module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
}