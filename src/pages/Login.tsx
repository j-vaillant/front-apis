import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import cookies from "js-cookie";

export const UserCredentialsSchema = z.object({
  login: z.string().min(1, "champ requis"),
  pwd: z.string().min(1, "champ requis"),
  authMode: z.enum(["jwt", "session"]),
});

export type UserCredentials = z.infer<typeof UserCredentialsSchema>;

const Login = () => {
  const { register, handleSubmit } = useForm<UserCredentials>({
    resolver: zodResolver(UserCredentialsSchema),
  });
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (values: UserCredentials) => {
    try {
      const res = await fetch("http://localhost:3001/auth", {
        method: "post",
        body: JSON.stringify(values),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();

      if (!json.success) {
        setError(true);
      } else {
        if (values.authMode === "jwt") {
          cookies.set("vinci-jwt-token", json.jwtToken);
        }
        navigate("/secure");
      }
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col justify-center">
        <span className="font-bold text-[20px] text-secondary">Connexion</span>
        <div className="mt-6 flex flex-col items-start">
          <div>
            <label htmlFor="login">Login</label>
            <input {...register("login")} />
          </div>
          <div className="mt-4">
            <label htmlFor="pwd">Mot de passe</label>
            <input type="password" {...register("pwd")} />
          </div>
          <div className="mt-4">
            <input type="radio" value="jwt" {...register("authMode")} /> JWT
            <input
              type="radio"
              value="session"
              checked
              {...register("authMode")}
            />{" "}
            SESSION
          </div>
          <div className="mt-4 flex items-center justify-center">
            <button type="submit">Se connecter</button>
          </div>
          {error && (
            <span className="inline-block mt-4">
              Login ou mot de passe incorrect.
            </span>
          )}
        </div>
      </div>
    </form>
  );
};

export default Login;
