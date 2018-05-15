const http = require('http')
const cinemaServer = require('../app')


var port = normalizePort(process.env.PORT || '3000')
cinemaServer.set('port', port)


const server = http.createServer(cinemaServer)


server.listen(port,function(){ console.log("Server listening on: http://localhost:%s/login", port);})
server.on('error', onError)
server.on('listening', onListening)


function normalizePort(val) {
    var port = parseInt(val, 10)
    return isNaN(port) ? val: (port>=0? port:false)
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
}
