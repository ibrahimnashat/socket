// Setup basic express server
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const port = process.env.PORT || 3000;
 const fs = require('fs');
server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Chatroom

let numUsers = 0;
let users={};
let callCenter={};
let Admin={};
let Room='';

const UserChat = io.of('/startChat');

UserChat.on('connection', (socket) => { 



    let addedUser = false;
  
    // when the client emits 'new message', this listens and executes
    socket.on('message', (data) => {
        console.log(data);
        
        let date=new Date();

      socket.to(Room).emit('new message', {
        username: socket.userObject,
        message: data,
        time:date,
      });

    });

        // when the client emits 'new message', this listens and executes
        socket.on('add image', (data) => {
          console.log(data);
          
          let date=new Date();
  
        socket.to(Room).emit('image', {
          username: socket.userObject,
          image: data,
          time:date,
        });
  
      });

	  
	  
	     // when the client emits 'new message', this listens and executes
        socket.on('send image', (data) => {
     
          
          let date=new Date();
		  
		 

       var imageAsBase64 = fs.readFileSync('image.jpg', 'base64');
  console.log(imageAsBase64);
        socket.to(Room).emit('image', {
          username: socket.userObject,
          image: imageAsBase64,
          time:date,
        });
  
      });


    socket.on('add Message', (data) => {
      console.log(data);
      
      let date=new Date();


    socket.to(Room).emit('new message', {
      username: socket.userObject,
      message: data.message,
      time:date,
    });

  });
  
    // when the client emits 'add user', this listens and executes
    socket.on('addUser', (obj) => {
		 console.log(obj);
          Room =obj.apiToken;
     

      socket.userObject = {'apiToken':obj.apiToken,'image':obj.image,'type':obj.type,'username':obj.username,'room':Room,'status':'1'};

      socket.join(Room);
      // echo globally (all clients) that a person has connected
  
      socket.to(Room).emit('send data', {
        data: socket.userObject,
      });
      
    });
  
    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', () => {
		
      socket.to(Room).emit('typing', {
        typing:true
      });
    });
  
    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', () => {
      socket.broadcast.emit('stop typing', {
        typing: false
      });
    });
  
    // when the user disconnects.. perform this
    socket.on('disconnect', () => {
      if (addedUser) {
        --numUsers;
  
        // echo globally that this client has left
        socket.broadcast.emit('user left', {
          username: socket.username,
          numUsers: numUsers
        });
      }
    });
  });
  UserChat.emit('hi', 'everyone!');

