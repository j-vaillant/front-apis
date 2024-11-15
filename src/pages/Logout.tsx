import { useEffect } from "react";
import cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    //for JWT remove cookie is enough
    cookies.remove("vinci-jwt-token");

    //session has to be destroyed server-side
    fetch(`http://localhost:3001/logout`, {
      method: "POST",
      credentials: "include",
    })
      .then((response) => response.json())
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("Erreur lors de la déconnexion:", error);
      });
  }, [navigate]);

  return null;
};

export default Logout;
