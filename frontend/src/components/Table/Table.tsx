import "./Table.css";

interface Column<T> {
  header: string;
  render: (row: T) => React.ReactNode;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  title: string;
}

const Table = <T,>({ data, columns, title = "" }: Props<T>) => {
  return (
    <div className="Table">
      {title !== "" && (
        <div className="TableHeader">
          <div className="TableCell">{title}</div>
        </div>
      )}
      <div className="TableHeader">
        {columns.map((column) => (
          <div className="TableCell" key={column.header}>
            {column.header}
          </div>
        ))}
      </div>

      {data.map((row, index) => (
        <div className="TableRow" key={index}>
          {columns.map((column) => (
            <div className="TableCell" key={column.header}>
              {column.render(row)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Table;
