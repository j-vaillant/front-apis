import { ChangeEventHandler } from "react";

const FileForm = () => {
  const onFileChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = e.target.files;
    if (!files?.length) {
      return;
    }
    const formData = new FormData();

    formData.append("file", files[0], "monfichier");

    await fetch("http://localhost:3001/upload", {
      method: "post",
      body: formData,
    });
  };

  return (
    <div>
      <input onChange={onFileChange} type="file" />
    </div>
  );
};

export default FileForm;
