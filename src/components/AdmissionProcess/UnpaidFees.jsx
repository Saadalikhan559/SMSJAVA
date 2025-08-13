import React, { useEffect, useState, useContext } from "react";
import { fetchUnpaidFees } from "../../services/api/Api";
import { AuthContext } from "../../context/AuthContext";
import { constants } from "../../global/constants";

const UnpaidFeesList = () => {
  const { userRole, yearLevelID, userID, studentID } = useContext(AuthContext);
  const [unpaidFees, setUnpaidFees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const loadUnpaidFees = async () => {
    try {
      setLoading(true);

      let params = {
        role: userRole,
        month: selectedMonth || "",
        class_id: "",
        student_id: ""
      };

      if (userRole === constants.roles.director || userRole === constants.roles.officeStaff) {
        params.class_id = selectedClass || "";
      } else if (userRole === constants.roles.classTeacher) {
        params.class_id = yearLevelID || "";
      } else if (userRole === constants.roles.guardian) {
        params.student_id = studentID || "";
      } else if (userRole === constants.roles.student) {
        params.student_id = userID || "";
      }

      console.log("Params being sent:", params);

      const data = await fetchUnpaidFees(params);
      setUnpaidFees(data || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching unpaid fees:", err.response?.data || err.message);
      setError("Failed to load unpaid fees");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadUnpaidFees();
  }, [selectedMonth, selectedClass]);

  if (loading) return <p>Loading unpaid fees...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Unpaid Accounts</h2>

      {/* Filters (only for Director/Office Staff) */}
      {(userRole === constants.roles.director || userRole === constants.roles.officeStaff) && (
        <div style={{ marginBottom: "10px" }}>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            <option value="">All Months</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
          </select>

          <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} style={{ marginLeft: "8px" }}>
            <option value="">All Classes</option>
            <option value="1">Class 1</option>
            <option value="2">Class 2</option>
          </select>
        </div>
      )}

      {/* Month filter for all other roles */}
      {(userRole === constants.roles.classTeacher || userRole === constants.roles.guardian || userRole === constants.roles.student) && (
        <div style={{ marginBottom: "10px" }}>
          <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
            <option value="">All Months</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
          </select>
        </div>
      )}

      {unpaidFees.length === 0 ? (
        <p>No unpaid fees found.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Month</th>
              <th>Class</th>
              <th>Fee Type</th>
              <th>Total Amount</th>
              <th>Paid Amount</th>
              <th>Due Amount</th>
              <th>Payment Status</th>
            </tr>
          </thead>
          <tbody>
            {unpaidFees.map((item) =>
              item.year_level_fees_grouped?.map((group) =>
                group.fees?.map((fee) => (
                  <tr key={`${item.id}-${group.year_level}-${fee.id}`}>
                    <td>{item.student?.name}</td>
                    <td>{item.month}</td>
                    <td>{group.year_level}</td>
                    <td>{fee.fee_type}</td>
                    <td>{fee.amount}</td>
                    <td>{item.paid_amount}</td>
                    <td>{item.due_amount}</td>
                    <td>{item.payment_status}</td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UnpaidFeesList;







