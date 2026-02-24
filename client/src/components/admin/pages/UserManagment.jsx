import React, { useContext, useEffect, useState } from "react";
import "../../admin/style/usermanagment.css";
import { Trash2, Search, Plus } from "lucide-react";
import axios from "axios";
import { authcontext } from "../../../context/Authcontext";
import toast from "react-hot-toast";

const UserManagment = () => {
  const [faculty, setFaculty] = useState([]);
  const [search, setSearch] = useState("");
  const { url } = useContext(authcontext);

  // 🔹 FETCH FACULTY
  const getFaculty = async () => {
    const toastId = toast.loading("Fetching faculty...");
    try {
      const res = await axios.get(`${url}/api/admin/allteachers`);
      setFaculty(res.data.users || res.data.user || []);
      toast('Faculty loaded', {
        id: toastId,
        icon: '✅',
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
        duration:"85",
        position:"bottom-right"
      });
    } catch (error) {
      toast.error("Failed to fetch faculty", { id: toastId });
    }
  };

  useEffect(() => {
    getFaculty();
  }, [url]);

  // 🔍 SEARCH FILTER
  const filteredFaculty = faculty.filter((user) =>
    `${user.fullname} ${user.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // 🗑️ DELETE FACULTY
  const deleteFaculty = async (id) => {
    if (!window.confirm("Are you sure you want to delete this faculty?"))
      return;

    const toastId = toast.loading("Deleting faculty...");

    try {
      await axios.delete(`${url}/api/admin/${id}`);
      setFaculty((prev) => prev.filter((f) => f._id !== id));
      toast.success("Faculty deleted successfully", { id: toastId });
    } catch (error) {
      toast.error("Delete failed", { id: toastId });
    }
  };

  return (
    <div className="user-page">
      {/* HEADER */}
      <div className="user-header">
        <div>
          <h1>Faculty Management</h1>
          <p className="sub-text">Faculty List</p>
        </div>

        <div className="header-right">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search faculty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button className="add-btn">
            <Plus size={16} />
            Create Faculty
          </button>
        </div>
      </div>

      <p className="total-users">
        Total Faculty: {filteredFaculty.length}
      </p>

      {/* TABLE */}
      <div className="user-table-box">
        <table>
          <thead>
            <tr>
              <th>Faculty</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredFaculty.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No faculty found
                </td>
              </tr>
            ) : (
              filteredFaculty.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="user-info">
                      <img
                        src={
                          user.image
                            ? user.image
                            : `https://ui-avatars.com/api/?name=${user.fullname}&background=000&color=fff`
                        }
                        alt={user.fullname}
                        className="user-avatar"
                      />
                      <span>{user.fullname}</span>
                    </div>
                  </td>

                  <td>{user.email}</td>

                  <td>
                    <span className="role faculty">Faculty</span>
                  </td>

                  <td className="actions-cell">
                    <button
                      className="delete-btn"
                      onClick={() => deleteFaculty(user._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagment;
