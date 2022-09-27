const {Socket} =require('socket.io');
const { verifyJWT } = require('../helpers');
const { ChatMessage } = require('../models');


const chatMessages = new ChatMessage();

const socketController = async(socket = new Socket(), io)=>{
    const user = await verifyJWT(socket.handshake.headers['x-token']);
    if(!user){
        return socket.disconnect();
    }

    //Add user connected
    chatMessages.conectUser(user);
    io.emit('active-users', chatMessages.usersActivos)
    socket.emit('recive-msg', chatMessages.ultimos10)
    
    //Conectar a sala especial
    socket.join( user.id); 

    //Limpiar disconnect
    socket.on('logout', ({uid})=>{
        chatMessages.disconnectUser(uid);
        io.emit('active-users', chatMessages.usersActivos)
    })
    
    socket.on('disconnect', ()=>{
        chatMessages.disconnectUser(user.uid);
        io.emit('active-users', chatMessages.usersActivos)
    });

    socket.on('send-msg', async({uid, message})=>{
        if(uid){
            //Mensaje privado
            socket.to(uid).emit('private-msg', {from: user.name, message});
        }else{
            await chatMessages.sendMessage(uid, user.name, message);
            io.emit('recive-msg', chatMessages.ultimos10);
        }
    })

}

module.exports = { socketController};