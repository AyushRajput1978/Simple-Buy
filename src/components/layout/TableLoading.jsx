import { Card, Table } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TableLoading = () => {
  const tableRows = [...Array(10).keys()];
  const columns = [
    { width: 50 },
    { width: 60 },
    { width: 200 },
    { width: 120 },
    { width: 100 },
    { width: 120 },
  ];

  return (
    <Card border="light" className="shadow-sm">
      <Card.Body className="p-0 pb-4">
        <div className="p-3">
          <Skeleton height={30} width={200} style={{ borderRadius: "8px" }} />
        </div>
        <div className="table-responsive">
          <Table
            hover
            className="user-table min-height"
            style={{ minWidth: "800px" }}
          >
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th className="border-bottom" key={`header-${index}`}>
                    <Skeleton
                      height={20}
                      width={col.width}
                      style={{ borderRadius: "8px" }}
                    />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr key={`row-${row}`} className="align-middle">
                  {columns.map((col, colIndex) => (
                    <td key={`cell-${row}-${colIndex}`}>
                      <Skeleton
                        height={20}
                        width={col.width}
                        style={{ borderRadius: "8px" }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TableLoading;
