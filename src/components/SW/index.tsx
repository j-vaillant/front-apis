import { useEffect } from "react";

const SW = () => {
  useEffect(() => {
    if (navigator.serviceWorker.controller) {
      console.log("sw actif");
      navigator.serviceWorker.controller.postMessage({
        type: "REGISTER",
      });

      navigator.serviceWorker.addEventListener("message", (event) => {
        console.log("Message reçu depuis le service worker:", event.data);
        // Traiter les données reçues
      });
    }
  }, []);

  return <div></div>;
};

export default SW;
