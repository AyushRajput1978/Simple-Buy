import axios from "../../axios";
import { useQuery } from "@tanstack/react-query";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { BsThreeDots } from "react-icons/bs";
import { Table, Dropdown, Card, ButtonGroup, Image } from "react-bootstrap";
import { useReducer, useState } from "react";
import CustomToast from "../layout/CustomToast";
import TableLoading from "../layout/TableLoading";

const UsersTable = () => {
  // Toast
  // Reducer for toast state
  const initialState = {
    showToast: false,
    toastBody: "",
    success: true,
  };

  const toastReducer = (state, action) => {
    switch (action.type) {
      case "SHOW_TOAST":
        return {
          ...state,
          showToast: true,
          toastBody: action.payload,
          success: action.success,
        };
      case "HIDE_TOAST":
        return { ...state, showToast: false };
      default:
        return state;
    }
  };
  const [toastState, dispatchToast] = useReducer(toastReducer, initialState);
  const [loading, setLoading] = useState(false);

  // Functions
  const fetchUsers = async () => {
    const res = await axios.get("/dashboard/users");
    return res.data.data;
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`/dashboard/users/${id}`);
      //  Show success toast
      dispatchToast({
        type: "SHOW_TOAST",
        payload: "User deleted successfully",
        success: true,
      });
      refetchProducts();
    } catch (err) {
      dispatchToast({
        type: "SHOW_TOAST",
        payload: err.response.data.message || "Something went wrong",
        success: false,
      });
    } finally {
      setLoading(false);
    }
  };

  // tanstack-react-query
  const {
    data,
    isLoading,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isLoading || loading) {
    return <TableLoading />;
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

      <CustomToast
        show={toastState.showToast}
        toastBody={toastState.toastBody}
        setShow={() => dispatchToast({ type: "HIDE_TOAST" })}
        success={toastState.success}
      />
    </Card>
  );
};

export default UsersTable;
