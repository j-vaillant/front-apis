import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

type User = {
  id: string;
  login: string;
};

type Message = {
  from: User;
  text: string;
  for: string;
  mp: boolean;
};

const Tchat = () => {
  const [channel, setChannel] = useState("general");
  const [user, setUser] = useState<User | null>(null);
  const [userList, setUserList] = useState<User[]>([]);
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState<Message[]>([]);
  const init = useRef(false);
  let filterRedMessage;

  const findUserById = (id: string) => {
    const found = userList.find((u) => u.id === id);
    return found?.login;
  };

  if (channel === "general") {
    filterRedMessage = msgs;
  } else {
    filterRedMessage = msgs.filter(
      (m) => m.from.id === channel && m.mp === true
    );
  }

  console.log(filterRedMessage, msgs);

  const sendMessage = () => {
    socket.emit("send", {
      text: msg,
      for: channel,
      from: user,
      mp: channel !== "general",
    });
    setMsg("");
  };

  const changeChannel = (userId: string) => {
    setChannel(userId);
  };

  useEffect(() => {
    socket.on("user-list", (users: User[]) => {
      console.log("receive users list");
      setUserList(users);
    });
    return () => {
      socket.off("users-list");
    };
  }, []);

  useEffect(() => {
    // Message sent to general
    socket.on("message", (message: Message) => {
      setMsgs((prev) => [...prev, message]);
    });
    return () => {
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    if (!user?.id || init.current) {
      return;
    }
    // user listen on is own channel
    console.log("liste private", user.id);
    socket.on(user.id, (message: Message) => {
      console.log("receive private message");
      console.log(message, "???");
      setMsgs((prev) => [...prev, message]);
    });
    init.current = true;
    return () => {
      socket.off(user.id);
    };
  }, [user]);

  useEffect(() => {
    const userName = window.prompt("Quel est votre nom ?");
    const newUser = { id: uuidv4(), login: userName ?? "" };
    setUser(newUser);
    setUserList((prev) => [...prev, newUser]);
    socket.emit("user-join", newUser);

    return () => {
      socket.off("user-join");
    };
  }, []);

  return (
    <div className="flex flex-col border-[1px] border-black w-[800px] h-[600px] mx-auto">
      <div className="w-full flex-1 flex">
        <div className="flex-1 overflow-scroll border-r-[1px] border-r-gray-200 p-2">
          {channel === "general"
            ? "Général"
            : `Conversation privé avec ${findUserById(channel)}`}
          {filterRedMessage.map((msg, i) => {
            return (
              <span key={i} className="cursor-pointer w-full inline-block">
                {msg.from.login === user?.login ? "Vous" : msg.from.login}:{" "}
                {msg.text}
              </span>
            );
          })}
        </div>
        <div className="w-[200px]">
          <ul>
            {userList.map((u) => {
              return (
                <li
                  onClick={() => {
                    changeChannel(u.id);
                  }}
                  className={`${u.id === user?.id ? "font-bold" : ""}`}
                  key={u.id}
                >
                  {u.login}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="w-full flex flex-col">
        <input
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
          type="text"
        />
        <button onClick={sendMessage}>Envoyer</button>
      </div>
    </div>
  );
};

export default Tchat;
