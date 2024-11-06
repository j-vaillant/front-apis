import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChangeEventHandler, useState } from "react";

type Movie = {
  title: string;
  year: number;
  rating: number;
  director: string;
  actors: string[];
};

const columnHelper = createColumnHelper<Movie>();

const columns = [
  columnHelper.accessor("title", {
    id: "title",
    cell: (info) => info.getValue(),
    header: () => "Titre",
  }),
  columnHelper.accessor("year", {
    id: "year",
    cell: (info) => {
      return info.getValue();
    },
    header: () => "Année",
  }),
  columnHelper.accessor("rating", {
    id: "rating",
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => "Note",
  }),
  columnHelper.accessor("director", {
    id: "director",
    cell: (info) => info.getValue(),
    header: () => "Réalisateur",
  }),
  columnHelper.accessor("actors", {
    id: "actors",
    header: () => "Acteurs",
    cell: (info) => info.getValue().join(","),
  }),
];

type RequestType = "select" | "delete" | "update" | "insert";

const Mongo = () => {
  const [data, setData] = useState<Movie[]>([]);
  const [requests, setRequests] = useState<Record<RequestType, string>>({
    select: "{}",
    delete: "{}",
    update: "{}",
    insert: "{}",
  });
  const [error, setError] = useState(false);
  const [requestType, setRequestType] = useState<RequestType>("select");
  const [result, setResult] = useState();

  const handleRequest = (req: string, type: string) => {
    setRequests((prev) => ({
      ...prev,
      [type]: req,
    }));
  };

  const handleCheck = () => {
    try {
      Object.entries(requests).forEach(([k, v]) => {
        const parsedJSON = JSON.parse(v);
        setRequests((prev) => ({
          ...prev,
          [k]: JSON.stringify(parsedJSON, null, 2),
        }));
      });
      setError(false);
    } catch {
      setError(true);
    }
  };

  const handleRequestTypeChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setRequestType(e.target.value as RequestType);

    if (e.target.value === "insert") {
      return setRequests((prev) => ({
        ...prev,
        insert: JSON.stringify({
          title: "",
          directoy: "",
          year: 2000,
          rating: 5,
          actors: [],
        }),
      }));
    }
  };

  console.log(requests, "REQ");

  const handleSend = async () => {
    try {
      handleCheck();
      const res = await fetch("http://localhost:3001/db", {
        method: "post",
        body: JSON.stringify({ requests, requestType }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();

      setResult(json.results);
      setData(json.movies);
    } catch (e) {
      console.log(e);
    }
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <div className="flex flex-col w-full  justify-between">
        {error && <span>Invalid JSON request</span>}
        Select
        <textarea
          value={requests.select}
          onChange={(e) => handleRequest(e.target.value, "select")}
        />
        {requestType === "insert" && (
          <>
            Insert
            <textarea
              value={requests.insert}
              onChange={(e) => handleRequest(e.target.value, "insert")}
            />
          </>
        )}
        {requestType === "update" && (
          <>
            Update
            <textarea
              value={requests.update}
              onChange={(e) => handleRequest(e.target.value, "update")}
            />
          </>
        )}
        <div className="flex">
          <input
            onChange={handleRequestTypeChange}
            type="radio"
            value="select"
            checked={requestType === "select"}
            name="requestType"
          />
          <span className="ml-2">Select</span>
          <input
            onChange={handleRequestTypeChange}
            type="radio"
            value="delete"
            className="ml-2"
            checked={requestType === "delete"}
            name="requestType"
          />
          <span className="ml-2">Delete</span>
          <input
            onChange={handleRequestTypeChange}
            className="ml-2"
            type="radio"
            value="update"
            checked={requestType === "update"}
            name="requestType"
          />
          <span className="ml-2">Update</span>
          <input
            onChange={handleRequestTypeChange}
            className="ml-2"
            type="radio"
            value="insert"
            checked={requestType === "insert"}
            name="requestType"
          />
          <span className="ml-2">Insert</span>
        </div>
        <button onClick={() => handleCheck()}>Check</button>
        <button onClick={() => handleSend()}>Send</button>
      </div>
      <div>
        <span>{result && JSON.stringify(result)} </span>
        {data.length > 0 && (
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            <tfoot>
              {table.getFooterGroups().map((footerGroup) => (
                <tr key={footerGroup.id}>
                  {footerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.footer,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
};

export default Mongo;
