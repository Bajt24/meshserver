import { Server } from './server';
var Turn = require('node-turn');
var config = require('../config.json');

const server = new Server();
server.run();

let turnServer = new Turn({authMech: 'long-term'});
turnServer.addUser(config.stunUser,config.stunPass);
turnServer.start();