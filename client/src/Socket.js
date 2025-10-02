import {io} from 'socket.io-client';

export const socketInit = async() => {
 return io("https://codox-server.onrender.com",{
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    });
}