import React, { useState, useEffect, useRef } from "react";
import "./chat.scss";

import { makeRequest } from "../../axios";
import { useQuery } from "@tanstack/react-query";

const Chat = ({ sender, receiver }) => {
  const [messages, setMessages] = useState([]);

  const messageEndRef = useRef(null);

  const { isPending, error, data } = useQuery({
    queryKey: ["messages"],
    queryFn: async () =>
      await makeRequest.get(`messages/${sender}/${receiver}`).then((res) => {
        return res.data;
      }),
  });

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  }, [messages]);

  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + error;

  return (
    <div className="chat">
      {messages.map((msg) => {
        return (
          <div
            key={msg.id}
            className={`${msg.senderid === sender ? "sender" : "receiver"}`}
          >
            <span>{msg.message}</span>
          </div>
        );
      })}
      <div ref={messageEndRef}></div>
    </div>
  );
};

export default Chat;
