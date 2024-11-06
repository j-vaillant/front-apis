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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
