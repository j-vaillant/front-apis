import "./styles.css";
import { useEffect, useRef, useState } from "react";

const ADN = () => {
  const [start, setStart] = useState(false);
  const [data, setData] = useState<string>("");
  const temp = useRef("");

  useEffect(() => {
    if (!start) {
      return;
    }
    const evtSource = new EventSource("http://localhost:3001/adn");

    evtSource.addEventListener("message", (e) => {
      temp.current = e.data;
    });
  }, [start]);

  const handleStart = () => {
    setStart(true);
  };

  const handleAnimationIteration = () => {
    setData(temp.current);
  };

  return (
    <div className="w-[200px] flex flex-col">
      <div className="marquee">
        <p
          className="text-[36px]"
          onAnimationIteration={handleAnimationIteration}
        >
          {data}
        </p>
      </div>
      <button className="mt-4" onClick={handleStart}>
        Start
      </button>
    </div>
  );
};

export default ADN;
