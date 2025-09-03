import React, { useContext, useEffect, useRef, useState } from "react";
import { fetchSalaryExpense } from "../../../services/api/Api";
import { Link } from "react-router-dom";
import { allRouterLink } from "../../../router/AllRouterLinks";
import { constants } from "../../../global/constants";
import axios from "axios";
import { ConfirmationModal } from "../../Modals/ConfirmationModal";
import { Loader } from "../../../global/Loader";
import { AuthContext } from "../../../context/AuthContext";

export const ViewSalaryExpense = () => {
  const [schoolExpense, setSchoolExpense] = useState([]);
  


  // const {authTokens} = useContext(AuthContext);
  // const access = authTokens.access;
  const authTokens = JSON.parse(localStorage.getItem('authTokens'));
  const access = authTokens.access;
    const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null); // 🔹 store ID for deletion
  const modalRef = useRef();

  const getSchoolExpense = async () => {
    setLoading(true);
    try {
      const response = await fetchSalaryExpense(access);
      setSchoolExpense(response);
    } catch (error) {
      console.log("Failed to get the school salary expense", error.message);
      setError("Failed to get the school salary expense");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!selectedId) return;
    setLoading(true);
    try {
      const response = await axios.delete(
        `${constants.baseUrl}/d/Employee/${selectedId}/`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      if (response.status === 200) {
        setSchoolExpense((prev) =>
          prev.filter((expense) => expense.id !== selectedId)
        );
        setSelectedId(null);
      }
    } catch (err) {
      if (err.response?.data) {
        setApiError(err.response.data.error);
      } else {
        setApiError("Something went wrong. Try again");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    modalRef.current.show();
  };

  useEffect(() => {
    getSchoolExpense();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Error />;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
         <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-4 border-b pb-4">
           <i className="fa-solid fa-money-bill-wave mr-2"></i> Salary
          </h1>
        </div>
        

        {/* Display API error message */}
        {apiError && (
          <div className="border border-error/50 rounded-lg p-4 mb-6 bg-white">
            <div className="flex items-center text-error">
              <i className="fa-solid fa-circle-exclamation mr-2"></i>
              <span className="font-medium">{apiError}</span>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bgTheme text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                  Joining Date
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                  Base Salary
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-semibold text-nowrap"
                  width={10}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {schoolExpense.length > 0 ? (
                schoolExpense.map((expense) => (
                  <tr key={expense.id}>
                    <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                      {expense.name}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                      {expense.role.map((r) => r)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                      {expense.joining_date}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                      {expense.base_salary}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm w-56">
                      <div className="flex space-x-2">
                        <Link
                          to={allRouterLink.editSalaryExpense.replace(
                            ":id",
                            expense.id
                          )}
                          className="inline-flex items-center px-3 py-1 border border-yellow-300 rounded-md shadow-sm text-sm font-medium text-yellow-700 bg-yellow-50 hover:bg-yellow-100"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(expense.id)}
                          className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100"
                        >
                          Delete
                        </button>
                        <Link
                          to={allRouterLink.paySalaryExpense.replace(
                            ":id",
                            expense.id
                          )}
                          className="inline-flex items-center px-3 py-1 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100"
                        >
                          Pay
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="10"
                    className="px-4 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <i className="fa-solid fa-inbox text-4xl mb-2 text-gray-400"></i>
                      <p>No Salary Found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🔹 Modal for confirmation */}
      <ConfirmationModal
        ref={modalRef}
        onConfirm={confirmDelete}
        onCancel={() => setSelectedId(null)}
      />
    </div>
  );
};
