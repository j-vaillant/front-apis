import { useEffect, useRef, useState } from "react";

type PollingOptions = {
  delay?: number;
};

const usePolling = (
  url: string,
  start: boolean,
  options?: PollingOptions
): [string[], NodeJS.Timer | undefined] => {
  const [msg, setMsg] = useState<string[]>([]);
  const { delay = 1000 } = options || {};

  let polling = useRef<NodeJS.Timer>();

  useEffect(() => {
    if (!start) {
      return;
    }
    const requestData = async () => {
      try {
        const res = await fetch(url);
        const json = await res.json();

        if (json.success) {
          clearInterval(polling.current);
        }

        setMsg((prev) => [...prev, json.msg]);
      } catch (e) {
        setMsg((prev) => [...prev, "Error!"]);
        clearInterval(polling.current);
      }
    };

    polling.current = setInterval(() => {
      requestData();
    }, delay);
  }, [delay, start, url]);

  return [msg, polling.current];
};

const Polling = () => {
  const [start, setStart] = useState(false);
  const [msg, polling] = usePolling("http://localhost:3001/poll", start);

  const handleStop = () => {
    if (polling) {
      clearInterval(polling);
    }
  };

  return (
    <div className="flex w-[300px] flex-col">
      <div className="mt-2">
        <button
          onClick={() => {
            setStart(true);
          }}
          className="mr-2"
        >
          Start
        </button>
        <button onClick={handleStop}>Stop</button>
      </div>
      <ul>
        {msg.map((m, i) => {
          return <li key={i}>{m}</li>;
        })}
      </ul>
    </div>
  );
};

export default Polling;
