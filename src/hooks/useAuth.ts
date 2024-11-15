import { useEffect, useState } from "react";
import cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export type User = {
  login: string;
  id: string;
  role: string;
};

const useAuth = () => {
  const [user, setUser] = useState<User | null | false>(null);

  useEffect(() => {
    fetch("http://localhost:3001/user", {
      credentials: "include",
    })
      .then((resp) => {
        if (resp.status !== 401) {
          return resp.json();
        }

        if (cookies.get("vinci-jwt-token")) {
          const userData = jwtDecode(cookies.get("vinci-jwt-token") ?? "");

          if (userData) {
            return Promise.resolve(userData);
          }
        }

        return Promise.resolve(false);
      })
      .then((userData) => {
        setUser(userData);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return user;
};

export default useAuth;
