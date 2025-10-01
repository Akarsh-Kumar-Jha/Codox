import {io} from 'socket.io-client';

export const socketInit = async() => {
 return io("http://localhost:3001",{
        'force new connection': true,
        reconnectionAttempt: 'Infinity',
        timeout: 10000,
        transports: ['websocket'],
    });
}