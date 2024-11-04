import { Link, Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div className="flex w-full flex-col justify-center items-center">
      <nav className="w-full flex justify-between list-none p-5">
        <li>
          <Link to="/post">Post Form</Link>
        </li>
        <li>
          <Link to="/file">File Form</Link>
        </li>
        <li>
          <Link to="/csv">CSV</Link>
        </li>
        <li>
          <Link to="/polling">Polling</Link>
        </li>
        <li>
          <Link to="/adn">ADN</Link>
        </li>
        <li>
          <Link to="/sw">SW</Link>
        </li>
        <li>
          <Link to="/push">push</Link>
        </li>
        <li>
          <Link to="/mongo">Mongo</Link>
        </li>
      </nav>
      <Outlet />
    </div>
  );
};

export default Main;
