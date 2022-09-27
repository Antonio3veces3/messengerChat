const express = require('express');
const fileUpload = require('express-fileupload');


const cors = require('cors');
const { dbConnection } = require('../database/config');
const { socketController } = require('../sockets/controller.socket');
class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths = {
            auth: '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            users: '/api/users',
            uploads: '/api/uploads',
            search: '/api/search'
        }
        
        this.connectDB();
        this.middleware();
        this.routes();

        //Sockets
        this.sockets();
    }

    async connectDB() {
        await dbConnection();
    }

    middleware() {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.static('public'));
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath: true
        }));
    }

    routes() {
        this.app.use(this.paths.auth , require('../routes/auth.routes'));
        this.app.use(this.paths.users, require('../routes/users.routes'));
        this.app.use(this.paths.products, require('../routes/products.routes'));
        this.app.use(this.paths.categories, require('../routes/categories.routes'));
        this.app.use(this.paths.search, require('../routes/search.routes'));
        this.app.use(this.paths.uploads, require('../routes/uploads.routes'));

        this.app.use((req, res) => {
            res.status(404).send({
                "error": "Page not found"
            })
        })
    }

    sockets(){
        this.io.on('connection', (socket) => socketController(socket, this.io));
    }

    listener() {
        this.server.listen(this.port, () => {
            console.log('Listening on ', this.port);
        })
    }
}

module.exports = Server;