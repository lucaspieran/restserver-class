const { response } = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require('bcrypt');
const { generarJWT } = require("../helpers/generarJWT");

const login = async (req, res = response) => {

    const { correo, password } = req.body

    try {

        //verificar si email existe
        const usuario = await Usuario.findOne({ correo })
        if (!usuario) {
            return res.status(400).json({
                msg: "Usuario / Password no son correctos"
            })
        }

        //verificar si usuario activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: "Estado: false"
            })
        }

        //verificar pass

        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: "Usuario / Password no son correctos- password"
            })
        }

        //generar jwt
        const token = await generarJWT(usuario.id);

        res.json({
            msg: "login ok",
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).jsonjson({
            msg: "Hable con el administrador"
        })
    }


}


module.exports = {
    login
}