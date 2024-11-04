import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

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

const Mongo = () => {
  const [data, setData] = useState<Movie[]>([]);
  const [request, setRequest] = useState("");
  const [error, setError] = useState(false);

  const handleCheck = () => {
    try {
      const parsedJSON = JSON.parse(request);

      setRequest(JSON.stringify(parsedJSON, null, 2));
      setError(false);
    } catch {
      setError(true);
    }
  };

  const handleSend = async () => {
    try {
      handleCheck();
      const res = await fetch("http://localhost:3001/db", {
        method: "post",
        body: JSON.stringify({ request }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const json = await res.json();

      setData(json);
    } catch {}
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <div className="flex flex-col w-full  justify-between h-[200px]">
        {error && <span>Invalid JSON request</span>}
        <textarea
          value={request}
          onChange={(e) => setRequest(e.target.value)}
        />
        <button onClick={() => handleCheck()}>Check</button>
        <button onClick={() => handleSend()}>Send</button>
      </div>
      <div>
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
