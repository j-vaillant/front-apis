const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const askNotificationPermission = () => {
  return Notification.requestPermission().then((permission) => {
    if (permission === "granted") {
      console.log("Permission accordée pour les notifications");
      return true;
    } else {
      console.log("Permission refusée pour les notifications");
      return false;
    }
  });
};

const subscribeUserToPush = (registration: ServiceWorkerRegistration) => {
  fetch("http://localhost:3001/vapidPublicKey").then((response) =>
    response.text().then((publicKey) => {
      console.log("public key fetched...", publicKey);
      return registration.pushManager
        .subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        })
        .then((subscription) => {
          console.log("Abonnement réussi avec succès:", subscription);

          // Envoyer l'objet `subscription` au serveur pour le sauvegarder
          fetch("http://localhost:3001/subscribe", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(subscription),
          });
        })
        .catch((error) => {
          console.error(
            "Erreur lors de l'abonnement aux notifications push:",
            error
          );
        });
    })
  );
};

const Push = () => {
  const handleGrantNotification = () => {
    navigator.serviceWorker.ready.then((registration) => {
      // Demander d'abord la permission
      askNotificationPermission().then((permissionGranted) => {
        if (permissionGranted) {
          // Souscrire l'utilisateur aux notifications via le Service Worker
          subscribeUserToPush(registration);
        }
      });
    });
  };

  return (
    <div>
      <button onClick={handleGrantNotification}>Notify Me</button>
    </div>
  );
};

export default Push;
