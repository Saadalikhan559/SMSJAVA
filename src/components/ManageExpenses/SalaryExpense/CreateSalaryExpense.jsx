import React, { useEffect, useState } from "react";
import { fetchEmployee, fetchRoles } from "../../../services/api/Api";

export const CreateSalaryExpense = () => {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const access = JSON.parse(localStorage.getItem("authTokens")).access;

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const getRole = async () => {
    try {
      const fetchedRoles = await fetchRoles();
      setRoles(fetchedRoles);
    } catch (error) {
      console.log("Could not get roles", error.message);
    }
  };

  const filteredRoles = roles.filter((role)=>{
    if(role.name === "teacher" || role.name === "office staff"){
        return role
    }
  })

  const getEmployee = async () => {
    try {
      const fetchedEmployee = await fetchEmployee(access);
      setEmployees(fetchedEmployee);
    } catch (error) {
      console.log("Could not get employees", error.message);
    }
  };

  useEffect(() => {
    getEmployee();
    getRole();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8">
        Create Salary
        <i className="fa-solid fa-percentage ml-2"></i>
      </h1>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Role Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                <i className="fa-solid fa-school text-sm"></i>
                Role <span className="text-error">*</span>
              </span>
            </label>
            <select
              className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Select Roles</option>
              {filteredRoles?.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* Employee Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                <i className="fa-solid fa-school text-sm"></i>
                Employee <span className="text-error">*</span>
              </span>
            </label>
            <select
              className="select select-bordered w-full focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">Select Employee</option>
              {employees?.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-center pt-6 gap-4">
          {/* Submit Button */}
          <button
            type="submit"
            className="btn bgTheme text-white w-full md:w-40"
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin mr-2"></i>
              </>
            ) : (
              <>
                <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>
                Create
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
