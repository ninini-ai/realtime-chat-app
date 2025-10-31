// node server for socket io connnection
const io = require('socket.io')(8000, {
  cors: {
    origin: "http://127.0.0.1:5500",  // or "http://localhost:5500"
    methods: ["GET", "POST"]
  }
});

const users={};
io.on('connection',socket =>{   // socket.io instance = io.on,listens multiple io connections
    socket.on('new-user-joined',name=>{  // what happens to perticullar connection 
        //console.log("New user:", name);
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',name);
    });
    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message:message, name: users[socket.id]})
    });

     socket.on('disconnect',message=>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
    });
});
console.log("✅ Socket.IO server running on port 8000");

