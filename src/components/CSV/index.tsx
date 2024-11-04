import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChangeEventHandler, useState } from "react";
import { format } from "date-fns";

type Person = {
  firstName: string;
  lastName: string;
  birthDate: string;
};

const columnHelper = createColumnHelper<Person>();

const columns = [
  columnHelper.accessor("firstName", {
    id: "firstName",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor((row) => row.lastName, {
    id: "lastName",
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>Last Name</span>,
  }),
  columnHelper.accessor("birthDate", {
    id: "birthDate",
    header: () => "birthDate",
    cell: (info) => format(new Date(info.getValue()), "dd/MM/yyyy"),
  }),
];

const CSV = () => {
  const [data, setData] = useState<Person[]>([]);

  const onFileChange: ChangeEventHandler<HTMLInputElement> = async (e) => {
    const files = e.target.files;

    if (!files?.length) {
      return;
    }
    const formData = new FormData();

    formData.append("file", files[0], "data.csv");

    const res = await fetch("http://localhost:3001/csv", {
      method: "post",
      body: formData,
    });
    const json = await res.json();

    setData(json.data);
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <input onChange={onFileChange} type="file" />
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
  );
};

export default CSV;
