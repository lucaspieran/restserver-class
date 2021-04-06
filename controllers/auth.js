const { response } = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require('bcrypt');
const { generarJWT } = require("../helpers/generarJWT");
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignin = async (req, res = response) => {
    const { id_token } = req.body;

    try {

        const { correo, nombre, img } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            //crear
            const data = {
                nombre,
                correo,
                password:':D',
                img,
                google: true
            };

            usuario = new Usuario(data)

            await usuario.save();
        }

        //si el usuario en db
        if (!usuario.estado) {
            return res.status(401).json({
                msg: "Hable con el administrador, usaurio bloqueado"
            })
        }

        //generar jwt
        const token = await generarJWT(usuario.id);


        res.json({
           usuario,
           token
        })
    } catch (error) {
        res.status(400).json({
            msg: "token de google no es reconocido"
        })
    }
}


module.exports = {
    login,
    googleSignin
}