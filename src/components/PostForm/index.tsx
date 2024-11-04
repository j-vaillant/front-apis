import { useState } from "react";

const PostForm = () => {
  const [userName, setUserName] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("userName", userName);

    const objFormData = Array.from(formData.entries()).reduce(
      (acc, next) => ({ ...acc, [next[0]]: next[1] }),
      {}
    );

    const resp = await fetch("http://localhost:3001", {
      method: "post",
      //body: new URLSearchParams(objFormData),
      body: JSON.stringify(objFormData),
      headers: {
        //"Content-type": "application/x-www-form-urlencoded",
        "Content-Type": "application/json",
      },
    });
    const res = await resp.json();
    setResult(res);
  };

  return (
    <form className="flexx">
      {result && <span>Server response: ok</span>}
      <input
        onChange={(e) => setUserName(e.target.value)}
        type="text"
        value={userName}
        name="userName"
      />
      <input
        className="cursor-pointer"
        onClick={() => handleSubmit()}
        type="button"
        value="Envoyer"
      />
    </form>
  );
};

export default PostForm;
