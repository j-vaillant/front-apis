import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Main from "./pages/Main";
import PostForm from "./components/PostForm";
import FileForm from "./components/FileForm";
import CSV from "./components/CSV";
import Polling from "./components/Polling";
import ADN from "./components/ADN";
import SW from "./components/SW";
import Push from "./components/Push";
import Mongo from "./components/Mongo";
import Agar from "./pages/Agar";
import Login from "./pages/Login";
import Secure from "./pages/Secure";
import Logout from "./pages/Logout";
import LoginSSO from "./pages/LoginSSO";
import Callback from "./pages/Callback";
import SecureSSO from "./pages/SecureSSO";
import IA from "./components/IA";
import Tchat from "./pages/Tchat";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "post",
        element: <PostForm />,
      },
      {
        path: "file",
        element: <FileForm />,
      },
      {
        path: "csv",
        element: <CSV />,
      },
      {
        path: "polling",
        element: <Polling />,
      },
      {
        path: "adn",
        element: <ADN />,
      },
      {
        path: "sw",
        element: <SW />,
      },
      {
        path: "push",
        element: <Push />,
      },
      {
        path: "mongo",
        element: <Mongo />,
      },
    ],
  },
  {
    path: "/agar",
    element: <Agar />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/loginSSO",
    element: <LoginSSO />,
  },
  {
    path: "/callback",
    element: <Callback />,
  },
  {
    path: "/logout",
    element: <Logout />,
  },
  {
    path: "/secure",
    element: <Secure />,
  },
  {
    path: "/secureSSO",
    element: <SecureSSO />,
  },
  {
    path: "/IA",
    element: <IA />,
  },
  {
    path: "/tchat",
    element: <Tchat />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
