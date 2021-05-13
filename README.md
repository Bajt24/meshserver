# Mesh - server

Mesh is a web conference system that you can run on your own machine. It uses peer to peer topology to save performance on server and the only thing users need is a web browser. It supports voice chat, video chat, screen share and more. 

If you're looking for the client repository, checkout [this](https://github.com/bajt24/meshclient). 

## Setting up
Server is written in Node.js which you can get [here](https://nodejs.org/en/).
After cloning the repository, use to download all the required modules.

```
npm install
```

## Linking the client

Server also acts as a webserver which is used to serve the client at production. If you want to use it, the server makes the content of folder `public` public. 

We require to use a symlink which will point to the `dist` folder of client. Or you can just create the folder by yourself and copy the content there.


## Build and dev

To start a local server that checks for file changes and rebuilds when needed. Everytime a `dist/app.js` compiled and minified file will be created. 

```
npm run dev
```
If you want to just build the project and not look for changes, use 

```
npm run compile
```

and to just build without running, use 

```
npm run build
```

## Config
If you want to use the server in production, checkout the `config.json` file. You will need to set the STUN/TURN credentials and the correct path to your keys to enable HTTPS.

## Documentation

To build a documentation use 
```
npx typedoc src
```