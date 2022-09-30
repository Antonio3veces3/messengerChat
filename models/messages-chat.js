class Message{
    constructor(uid, name, message){
        this.uid = uid;
        this.name = name;
        this.message = message;
    }
}

class ChatMessage {
    constructor(){
        this.messages = [];
        this.users    = {};
    }

    get ultimos10(){
        let ultimosMsg= [];
        this.messages.forEach((msg,index) => {
            if(index < 200){
                ultimosMsg.push(msg)
            }
        })
        return ultimosMsg;
    }

    get usersActivos(){
        return Object.values( this.users);
    }

    sendMessage(uid, name, message){
        this.messages.unshift(
            new Message(uid, name, message)
        )
    }

    conectUser( user ){
        this.users[user.id] = user;
    }

    disconnectUser(id){
        delete this.users[id];
    }
}

module.exports = ChatMessage;