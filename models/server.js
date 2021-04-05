const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;

        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';


        //conectar db 
        this.conectarDB();

        //Middlewares
        this.middlewares();

        //rutas de aplicacion

        this.routes();
    }

    async conectarDB() {
        await dbConnection()
    }

    middlewares() {
        //cors
        this.app.use(cors());

        //lectura y parse 

        this.app.use(express.json())

        //
        this.app.use(express.static('public'))
    }

    routes() {

        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usuariosPath, require('../routes/usuarios'));

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log("servidor en ", this.port)
        });
    }
}



module.exports = Server;