const {Server} = require('socket.io');

const io = new Server(8000, {
    cors : true
});

const emailToSocketIdMap = new Map();
const socketidToEmailMap = new Map();

io.on('connection', (socket)=>{
    // console.log('connected', socket.id);

    socket.on('room:join', (data)=>{
        const { email, room, name} = data; 
        // console.log('joined room', room);
        emailToSocketIdMap.set(email,socket.id);
        socketidToEmailMap.set(socket.id , email);
        io.to(room).emit('user:joined',{email, id:socket.id, name})
        socket.join(room)
        io.to(socket.id).emit('room:join',data)
    });

    socket.on('room:details',(data)=>{    
        const {topic, room, name} = data;
        console.log(topic, room, name);
        io.to(room).emit('getRoom:details',data)
    })

    socket.on('send:JoinerName', ({joinName, room})=>{
        console.log(joinName, room);
        io.to(room).emit('get:joinerName',joinName)
    })

    socket.on('user:call', ({ to, offer})=>{
        io.to(to).emit('incoming:call', {from : socket.id, offer})
    });
  
    socket.on('call:accepted', ({to , ans})=>{
        io.to(to).emit('call:accepted', {from : socket.id, ans})
    })

    socket.on('peer:nego:needed', ({to,offer})=>{
        io.to(to).emit('peer:nego:needed', {from : socket.id, offer})
    })

    socket.on('peer:nego:done', ({to, ans})=>{
        io.to(to).emit('peer:nego:final', {from: socket.id, ans})
    });
})    