let url = window.location.hostname.includes("localhost")
  ? "http://localhost:8080/api/auth/"
  : "https://tonymessenger.herokuapp.com/api/auth/";

//HTML refers
const txtUid = document.querySelector('#txtUid');
const textMsg = document.querySelector('#textMsg');
const ulUsers = document.querySelector('#ulUsers');
const ulMessages = document.querySelector('#ulMessages');
const logout = document.getElementById('btnLogout');
const btnSend = document.getElementById('btnSend');

let user = null, socket = null;

//LOGOUT
logout.addEventListener('click', async(e)=>{
    socket.emit('logout', user);
    localStorage.clear();
    window.location.reload();
    window.location = 'index.html';

})


const validateJWT = async()=>{
    const token = localStorage.getItem('token');
    if(!token){
        alert('No hay token en el servidor');
        window.location = 'index.html'   
    }
    if(token.length < 11){
        alert('No hay token en el servidor');
        window.location = 'index.html'
    }
    
    await fetch(url, {
        method: 'GET',
        headers: {'x-token': token}
    })
    .then(res => res.json())
    .then(async({user: userApi, token: tokenApi}) =>{
        localStorage.setItem('token', tokenApi);
        console.log(token);
        user = userApi;
        document.title = user.name;

        await conectarSocket();
    })
    .catch(error =>{
        alert(error);
        window.location = 'index.html';
    });
    
}

const conectarSocket = async()=>{
    socket = io({
        'extraHeaders':{
            'x-token': localStorage.getItem('token')
        }
    });
    
    socket.on('connect', ()=>{
        console.log('Sockets online');
    });
    
    socket.on('disconnect', ()=>{
        console.log('Sockets offline');
        
    });
    
    socket.on('recive-msg', (messages)=>{
        printMessages(messages);
    });
    socket.on('active-users', printActiveUsers);

    socket.on('private-msg', (message)=>{
        printPrivateMessage(message)
    })

}

const printActiveUsers = (users = [])=>{
    let usersHTML = '';
    users.forEach( ({name, uid }) => {
        usersHTML  += ` 
            <li>
                <p>
                    <h5 class="text-success">${name} </h5>
                    <span class="fs-6 text-muted">${uid}</span>
                </p>
            </li>
        `;
    });

    ulUsers.innerHTML = usersHTML;
};

const printMessages = (messages= [])=>{
    let messagesHTML = '';
    let allMessages= messages.reverse();
    console.log(allMessages);
    allMessages.forEach( ({name, message }) => {
        messagesHTML  += ` 
            <li>
                <p>
                    <span class="text-primary">${name}: </span>
                    <span id="txtMessage">${message}</span>
                </p>
            </li>
        `;
    });

    ulMessages.innerHTML = messagesHTML;
};

const printPrivateMessage = ({from, message} )=>{
    let privateMessageHTML = ` 
            <li>
                <p>
                    <span class="text-primary">Mensaje privado de <b>${from}</b>: </span>
                    <span >${message}</span>
                </p>
            </li>
        `;

    ulMessages.innerHTML += privateMessageHTML;
}

btnSend.addEventListener('click', async()=>{
    const message = textMsg.value;
    const uid = txtUid.value;
    if(message.length === 0 || message.trim() == ""){
        return;}
    textMsg.value= '';

    socket.emit('send-msg', {message, uid});

});

const main = async ()=>{
    await validateJWT();
}

main();
