import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import { Table, Dropdown, Card, ButtonGroup, Image, Row } from "react-bootstrap";
import { BsThreeDots } from "react-icons/bs";
import { MdDelete } from "react-icons/md";
import type { ApiError, User } from "type";

import axios from "../../axios";
import { toast } from "../../utils/helper";
import ConfirmModal from "../layout/AlertModal";
import { TableLoadingShimmer } from "../layout/LoadingShimmers";

interface UserResponse{
  data:User[];
  status:string
}

const UsersTable = () => {
  const [loading, setLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userId, setUserId] = useState("");

  const fetchUsers = async ():Promise<User[]> => {
    const res = await axios.get<UserResponse>("/dashboard/users");
    return res.data.data;
  };
  const {
    data:users=[],
    isLoading,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const deleteUser = async (id:string) => {
    setLoading(true);
    try {
      await axios.delete(`/dashboard/users/${id}`);
      toast("User deleted successfully");
      void refetchProducts();
    } catch (err) {
      const error=err as AxiosError<ApiError>
      toast(error.response?.data.message || "Something went wrong", false);
    } finally {
      setLoading(false);
    }
  };
  const handleConfirmDeleteUser = () => {
   void deleteUser(userId);
    setShowConfirmModal(false);
    setUserId("");
  };
  if (isLoading || loading) {
    return <TableLoadingShimmer />;
  }

  return (
    <Card border="light" className="shadow-sm">
      <Card.Body className="p-0 pb-4 justify-content-center">
        {users.length > 0 ? (
          <div className="table-responsive">
            <Table
              hover
              className="user-table min-height"
              style={{ minWidth: "800px" }}
            >
              <thead>
                <tr>
                  <th>SNo.</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
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
                            onClick={() => {
                              setShowConfirmModal(true);
                              setUserId(user._id);
                            }}
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
      <ConfirmModal
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        handleConfirmClear={handleConfirmDeleteUser}
        heading="Confirm Delete User"
        bodyText="This action is permanent, Are you sure you want to permanently delete this User?"
        confirmText="Yes, I m sure"
      />
    </Card>
  );
};

export default UsersTable;
