const { response } = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');


const validarJWT = async (req, res = response, next) => {

    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({
            msg: "no ha ytoken en la peticion"
        })
    }


    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        const usuario = await Usuario.findById(uid)
        if (!usuario) {
            return res.status(401).json({
                msg: "Token no valido - usuario no existe en db"
            })
        }


        //verifgiacr el estado
        if (!usuario.estado) {
            return res.status(401).json({
                msg: "Token no valido - usuario cone stado false"
            })
        }


        req.usuario = usuario
        next();

    } catch (error) {

        console.log(error)
        res.status(401).json({
            msg: "Token no valido"
        })
    }



}

module.exports = {
    validarJWT
}