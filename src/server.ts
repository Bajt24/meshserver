import express from "express";
import socketio from "socket.io";
import https from 'https';
import http from 'http';
import fs from 'fs';
import { SocketManager } from "./socketManager";
var config = require('../config.json');
/**
 * main class that represents the instance of a server
 */
export class Server {
    app = express();
    httpServer: any;
    public io: socketio.Server;
    isHTTPS = false;

    constructor() { 
        // try to get certificate to enable https
        try {
            let credentials = {
                key: fs.readFileSync(config.privkey, 'utf8'),
                cert: fs.readFileSync(config.cert, 'utf8'),
                ca: fs.readFileSync(config.chain, 'utf8')
            };
            this.httpServer = https.createServer(credentials, this.app);
            this.isHTTPS = true;
        } catch (e) {
            this.httpServer = require('http').createServer(this.app);
        }
        //TODO: origin shouldn't be a wildcard
        this.io = new socketio.Server(this.httpServer, {cors: {origin: '*'}});
        SocketManager.getInstance().SetServer(this.io);
    }

    run() {
        let port = 80;
        if (this.isHTTPS)
            port = 443;

        let httpSrvr = this.httpServer.listen(port, () => {
            console.log('Server started at :' + port);
        });
        //TODO: dotfiles?
        this.app.use(express.static("public",{dotfiles: 'allow'}));

        if (this.isHTTPS) {
            http.createServer((req, res)=>{
                res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
                res.end();
            }).listen(80);
        }

        this.app.get('*', (req, res)=>{
            res.sendFile("index.html", {root: "public"})
        });
        // handle ctrl+c to kill the http server
        process.on('SIGTERM',()=>{
            httpSrvr.close();
        });
    }
}