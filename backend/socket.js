export default (io) => {

  let onlineUsers = [];

  const addUser = (userId, socketId) => {
    !onlineUsers.some((user) => user.userId === userId) &&
      onlineUsers.push({ userId, socketId });
  };

  const removeUser = (socketId) => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
  };

  const getUser = (userId) => {
    console.log("Current online users: " + JSON.stringify(onlineUsers));
    const user = onlineUsers.find((user) => {
      console.log(`Comparing ${user.userId} with ${userId}`);
      return user.userId === userId;
    });
    console.log("Found user: " + JSON.stringify(user));
    return user;
  }

  io.on("connection", (socket) => {
    console.log("User connected");

    //take userId and socketId from user
    socket.on("addUser", (userId) => {
      try {
        addUser(userId, socket.id);
        console.log("Online users:", onlineUsers);
      } catch (error) {
        console.error("Error adding user:", error);
        socket.emit("serverError", { message: "Error adding user" });
      }
    });
    
    //handle chat messages
    socket.on("join-room", (roomId) => {
      socket.join(roomId);
    });
  
    socket.on("send-message", ({ receiverId, roomId }) => {
      console.log("Message sent to: " + receiverId);
      socket.to(roomId).emit("receive-message");
    });

    // handle friend requests
    socket.on("addFriend", ({ receiverId, senderId }) => {
      console.log("Friend request sent to: " + receiverId);
      const user = getUser(receiverId);
      if (user) {
        console.log("User found "+ user.socketId);
        io.to(user.socketId).emit("receiveFriendRequest", { senderId });
      }
    }); 

    socket.on("disconnect", () => {
      console.log("User disconnected");
      removeUser(socket.id);
      console.log("Online users after disconnect:", onlineUsers);
    });
  });
};