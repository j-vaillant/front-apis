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
  const [channels, setChannels] = useState(["general"]);
  const [user, setUser] = useState<User | null>(null);
  const [userList, setUserList] = useState<User[]>([]);
  const [msg, setMsg] = useState("");
  const [msgs, setMsgs] = useState<Message[]>([]);
  const init = useRef(false);
  let filteredMessage;

  const findUserByName = (name: string) => {
    const found = userList.find((u) => u.login === name);
    return found;
  };

  if (channel === "general") {
    filteredMessage = msgs.filter((m) => m.mp === false);
  } else {
    filteredMessage = msgs.filter(
      (m) =>
        (m.from.id === channel && m.mp === true) ||
        (m.from.id === user?.id && m.mp === true)
    );
  }

  console.log(filteredMessage, msgs);

  const sendMessage = () => {
    socket.emit("send", {
      text: msg,
      for: channel,
      from: user,
      mp: channel !== "general",
    });
    setMsg("");
  };

  const changeChannel = (user: User) => {
    setChannel(user.id);
    if (!channels.includes(user.login)) {
      setChannels((prev) => [...prev, user.login]);
    }
  };

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
  return (
    <div className="flex flex-col border-[1px] border-black w-[800px] h-[600px] mx-auto">
      <div className="w-full flex-1 flex">
        <div className="flex-1 overflow-scroll border-r-[1px] border-r-gray-200 p-2">
          <div className="my-3">
            {channels.map((ch) => {
              if (ch === "general") {
                return (
                  <span
                    onClick={() => setChannel("general")}
                    className={`p-2 cursor-pointer ml-2 border border-black ${
                      channel === ch && "font-bold"
                    }`}
                  >
                    {ch}
                  </span>
                );
              }
              const user = findUserByName(ch);
              return (
                <span
                  onClick={() => setChannel(user?.id ?? "")}
                  className={`p-2 cursor-pointer ml-2 border border-black ${
                    channel === user?.id && "font-bold"
                  }`}
                >
                  {ch}
                </span>
              );
            })}
          </div>
          {filteredMessage.map((msg, i) => {
            return (
              <span key={i} className="cursor-pointer w-full inline-block">
                {msg.from.login === user?.login ? "Vous" : msg.from.login}:{" "}
                {msg.text}
              </span>
            );
          })}
        </div>
        <div className="w-[200px]">
          <ul className="p-2">
            {userList.map((u) => {
              return (
                <li
                  onClick={() => {
                    changeChannel(u);
                  }}
                  className={`${
                    u.id === user?.id ? "font-bold pointer-events-none" : ""
                  } cursor-pointer`}
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
