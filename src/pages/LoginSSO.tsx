import GoogleButton from "react-google-button";

const LoginSSO = () => {
  const handleSSO = () => {
    // Redirige vers la route backend qui déclenche l'authentification
    window.location.href = "http://localhost:3001/auth/google";
  };
  return <GoogleButton onClick={handleSSO} />;
};
export default LoginSSO;
