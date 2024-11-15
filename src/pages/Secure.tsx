import { FC, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Secure: FC = () => {
  const [ok, setOk] = useState(false);
  const user = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user === false) {
      navigate("/login");
    }
  }, [navigate, user]);

  const handleAdminAction = () => {
    fetch("http://localhost:3001/secure/session/admin", {
      credentials: "include",
    })
      .then(() => {
        setOk(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleAdminActionJWT = () => {
    const token = cookies.get("vinci-jwt-token");

    fetch("http://localhost:3001/secure/jwt", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((resp) => {
        if (resp.status === 200) {
          setOk(true);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleUserAction = () => {
    fetch("http://localhost:3001/secure/session/user", {
      credentials: "include",
    })
      .then((resp) => {
        if (resp.status === 200) {
          setOk(true);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return user ? (
    <div>
      <span>Connecté en tant que {user.login}</span>
      {user.role === "admin" && (
        <>
          <button onClick={handleAdminAction}>Do Admin Stuff (session)</button>
          <button onClick={handleAdminActionJWT}>Do Admin Stuff (JWT)</button>
        </>
      )}
      {user.role === "user" && (
        <button onClick={handleUserAction}>Do user Stuff (session)</button>
      )}
      {ok && <span>action complete !</span>}
    </div>
  ) : (
    <></>
  );
};

export default Secure;
