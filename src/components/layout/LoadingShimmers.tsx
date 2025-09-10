import { Card, Col, Row, Table } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export function ProductsLoadingShimmer() {
  return (
    <>
      <Row className="justify-content-center">
        <Col sm={6} className=" py-5 text-center">
          <Skeleton height={40} />
        </Col>
      </Row>
      <Row>
        {Array.from({ length: 12 }, (_, i) => (
          <Col md={4} sm={6} key={i} className="mb-4">
            <Skeleton height={592} />
          </Col>
        ))}
      </Row>
    </>
  );
}

export function TableLoadingShimmer() {
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
          <Skeleton height={30} width={200} style={{ borderRadius: '8px' }} />
        </div>
        <div className="table-responsive">
          <Table hover className="user-table min-height" style={{ minWidth: '800px' }}>
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th className="border-bottom" key={`header-${index}`}>
                    <Skeleton height={20} width={col.width} style={{ borderRadius: '8px' }} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row) => (
                <tr key={`row-${row}`} className="align-middle">
                  {columns.map((col, colIndex) => (
                    <td key={`cell-${row}-${colIndex}`}>
                      <Skeleton height={20} width={col.width} style={{ borderRadius: '8px' }} />
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
}

export const DetailedProductLoadingShimmer = () => {
  return (
    <div className="container my-5 py-2">
      <div className="row">
        <div className="col-md-6 py-3">
          <Skeleton height={400} width={400} />
        </div>
        <div className="col-md-6 py-5">
          <Skeleton height={30} width={250} />
          <Skeleton height={90} />
          <Skeleton height={40} width={70} />
          <Skeleton height={50} width={110} />
          <Skeleton height={120} />
          <Skeleton height={40} width={110} inline={true} />
          <Skeleton className="mx-3" height={40} width={110} />
        </div>
      </div>
    </div>
  );
};

export const SimilarProductsLoadingShimmer = () => {
  return (
    <div className="my-4 py-4">
      <div className="d-flex">
        <div className="mx-4">
          <Skeleton height={400} width={250} />
        </div>
        <div className="mx-4">
          <Skeleton height={400} width={250} />
        </div>
        <div className="mx-4">
          <Skeleton height={400} width={250} />
        </div>
        <div className="mx-4">
          <Skeleton height={400} width={250} />
        </div>
      </div>
    </div>
  );
};
