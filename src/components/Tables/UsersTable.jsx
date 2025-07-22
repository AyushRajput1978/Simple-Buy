import { useState } from "react";
import { Table, Dropdown, Card, ButtonGroup, Image } from "react-bootstrap";
import { useQuery } from "@tanstack/react-query";
import { MdDelete } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { TableLoadingShimmer } from "../layout/LoadingShimmers";
import { toast } from "../../utils/helper";
import axios from "../../axios";

const UsersTable = () => {
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    const res = await axios.get("/dashboard/users");
    return res.data.data;
  };
  const {
    data,
    isLoading,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`/dashboard/users/${id}`);
      toast("User deleted successfully");
      refetchProducts();
    } catch (err) {
      toast(err.response.data.message || "Something went wrong", false);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return <TableLoadingShimmer />;
  }

  return (
    <Card border="light" className="shadow-sm">
      <Card.Body className="p-0 pb-4 justify-content-center">
        {data.length > 0 ? (
          <div className="table-responsive">
            <Table
              hover
              className="user-table min-height"
              style={{ minWidth: "800px" }}
            >
              <thead>
                <tr>
                  <th className="border-bottom">SNo.</th>
                  <th className="border-bottom">Name</th>
                  <th className="border-bottom">Role</th>
                  <th className="border-bottom">Email</th>
                  <th className="border-bottom">Phone Number</th>
                  <th className="border-bottom">Action</th>
                </tr>
              </thead>
              <tbody>
                {data.map((user, index) => (
                  <tr key={user.id}>
                    <td text-label="SNo.">
                      <span className="fw-normal">{index + 1}</span>
                    </td>

                    <td text-label="Name">
                      <span className="fw-normal">{user.name}</span>
                    </td>
                    <td text-label="Role">
                      <span className="fw-normal">{user.role}</span>
                    </td>
                    <td text-label="Email">
                      <span className="fw-normal">{user.email}</span>
                    </td>
                    <td text-label="Phone Number">
                      <span className="fw-normal">{user.phoneNo}</span>
                    </td>
                    <td>
                      <Dropdown as={ButtonGroup} drop="down-centered">
                        <Dropdown.Toggle
                          as="button"
                          className="btn btn-link text-dark m-0 p-0 border-0 shadow-none"
                          id={`dropdown-button-${user._id}`}
                        >
                          <BsThreeDots size={18} />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                          <Dropdown.Item
                            className="text-danger d-flex align-items-center gap-1"
                            onClick={() => handleDelete(user._id)}
                          >
                            <MdDelete />
                            <span>Remove</span>
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <Row className="justify-content-center align-item-center text-dark fontweigh-500 p-4">
            No Data Available.....
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default UsersTable;
