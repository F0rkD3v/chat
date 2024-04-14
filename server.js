const fs = require('fs');
const http = require('http');
const path = require('path');

const pathToIndex = path.join(__dirname, 'static', 'index.html');
const indexHtmlFile = fs.readFileSync(pathToIndex);
const scriptJsFile = fs.readFileSync(path.join(__dirname, 'static', 'script.js'));
const styleCssFile = fs.readFileSync(path.join(__dirname, 'static', 'style.css'))

const server = http.createServer((req, res) => {
switch(req.url){
    case '/': return res.end(indexHtmlFile); break;
    case '/script.js': return res.end(scriptJsFile); break;
    case '/style.css': return res.end(styleCssFile); break;
    }
    res.statusCode = 404;
    return res.end('Error 404');
});

server.listen(3000);

const {Server} = require('socket.io');
const io = new Server(server);

io.on('connection', (socket) =>{
    console.log('a user connected. ID: '+ socket.id);
    let userNickname = 'user';

    socket.on('set_nickname', (nickname)=> {
        userNickname = nickname;
    });

    socket.on('new_message', (message) => {
        io.emit('message', userNickname + ' : ' + message)
    });
});