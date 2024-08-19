import React, { useContext, useEffect, useState } from "react";
import "./message.scss";

import SendIcon from "@mui/icons-material/Send";

import { makeRequest } from "../../axios";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../../context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { socket } from "../../App";

const Message = ({ sender, receiver }) => {
  const { currentUser } = useContext(AuthContext);
  const [message, setMessage] = useState("");

  const queryClient = useQueryClient();

  const roomId = sender < receiver ? sender +""+ receiver : receiver +""+ sender;
  
  socket.emit("join-room", roomId);


  useEffect(() => {
    socket.on("receive-message", () => {
      console.log("recieved message");
      queryClient.invalidateQueries(["messages"]);
    });
  }, [socket]);

  const mutation = useMutation({
    mutationFn: (newMessage) =>
      makeRequest.post(`messages/${sender}/${receiver}`, newMessage),
    onSuccess: () => {
      queryClient.invalidateQueries(["messages"]);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleClick = async (event) => {
    event.preventDefault();
    mutation.mutate({ message });
    socket.emit("send-message", { receiverId: receiver ,roomId: roomId });
    setMessage("");
  };

  return (
    <div className="message">
      <input
        type="text"
        value={message}
        placeholder="Type a message"
        onChange={(e) => setMessage(e.target.value)}
      ></input>
      <button onClick={handleClick}>
        <SendIcon />
      </button>
    </div>
  );
};

export default Message;
