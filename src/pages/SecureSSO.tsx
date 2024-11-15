import { FC, useEffect } from "react";

const SecureSSO: FC = () => {
  useEffect(() => {
    try {
      fetch("http://localhost:3001/user", {
        credentials: "include",
      }).then((resp) => {
        if (resp.status !== 200) {
          return Promise.reject("nope");
        }
      });
    } catch (e) {
      console.log(e);
    }
  }, []);

  return <div></div>;
};

export default SecureSSO;
