import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { fetchEmployee, fetchRoles, createSalary } from "../../../services/api/Api";

export const CreateSalaryExpense = () => {
  const [pageLoading, setPageLoading] = useState(false); // page-level loader
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [apiError, setApiError] = useState("");

  const access = JSON.parse(localStorage.getItem("authTokens")).access;

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm();
  const selectedRole = watch("role");
  const selectedEmployee = watch("employee");

  // Utility functions
  const getFullName = (employee) => employee ? `${employee.first_name || ""} ${employee.last_name || ""}`.trim() : "";

  const filteredRoles = roles.filter(role => role && (role.name === "teacher" || role.name === "office staff"));

  const getRoleNameById = (roleId) => {
    const role = roles.find(r => r && r.id == roleId);
    return role ? role.name : "";
  };

  const getEmployees = async (roleId) => {
    if (!roleId) {
      setEmployees([]);
      return;
    }

    setPageLoading(true);
    try {
      const roleName = getRoleNameById(roleId);
      if (roleName) {
        const fetchedEmployees = await fetchEmployee(access, roleName);
        setEmployees(fetchedEmployees || []);
      } else {
        setEmployees([]);
      }
      setApiError("");
    } catch (err) {
      console.log(err);
      setApiError("Failed to fetch employees");
      setEmployees([]);
    } finally {
      setPageLoading(false);
    }
  };

  const getRoles = async () => {
    try {
      setPageLoading(true);
      const fetchedRoles = await fetchRoles();
      setRoles(fetchedRoles || []);
      setApiError("");
    } catch (err) {
      console.log(err);
      setRoles([]);
      setApiError("Failed to fetch roles");
    } finally {
      setPageLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    getRoles();
  }, []);

  // Fetch employees when role changes
  useEffect(() => {
    setValue("employee", "");
    setSelectedEmployeeName("");
    getEmployees(selectedRole);
  }, [selectedRole]);

  // Update selected employee name
  useEffect(() => {
    if (selectedEmployee && employees.length > 0) {
      const emp = employees.find(e => e && e.id && e.id.toString() === selectedEmployee.toString());
      setSelectedEmployeeName(emp ? getFullName(emp) : "");
    } else {
      setSelectedEmployeeName("");
    }
  }, [selectedEmployee, employees]);

  const onSubmit = async (data) => {
    setPageLoading(true);
    try {
      const payload = {
        user: Number(data.employee),
        joining_date: data.joiningDate,
        base_salary: data.baseSalary,
      };
      await createSalary(access, payload);
      alert("Salary created successfully!");
    } catch (err) {
      console.log(err);
      setApiError("Something went wrong");
    } finally {
      setPageLoading(false);
    }
  };

  // PAGE LEVEL LOADER
  if (pageLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          <div className="w-3 h-3 bgTheme rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></div>
        </div>
        <p className="mt-2 text-gray-500 text-sm">Loading data...</p>
      </div>
    );
  }

  if (apiError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
        <i className="fa-solid fa-triangle-exclamation text-5xl text-red-400 mb-4"></i>
        <p className="text-lg text-red-400 font-medium">{apiError}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="w-full max-w-7xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-8">
          Create Salary
          <i className="fa-solid fa-money-bill ml-2"></i>
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Role */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Role <span className="text-error">*</span></span>
              </label>
              <select
                className="select select-bordered w-full"
                {...register("role", { required: "Role is required" })}
              >
                <option value="">Select Role</option>
                {filteredRoles.map(role => (
                  <option key={role.id} value={role.id}>{role.name}</option>
                ))}
              </select>
              {errors.role && <p className="text-error text-sm mt-1">{errors.role.message}</p>}
            </div>

            {/* Employee */}
            <div className="form-control relative">
              <label className="label">
                <span className="label-text">Employee <span className="text-error">*</span></span>
              </label>

              <div
                className="input input-bordered w-full flex items-center justify-between cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                {selectedEmployeeName || "Select Employee"}
                <i className={`fa-solid fa-chevron-${showDropdown ? "up" : "down"} ml-2`}></i>
              </div>

              {showDropdown && (
                <div className="absolute z-10 bg-white rounded w-full mt-1 shadow-lg max-h-48 overflow-y-auto">
                  {employees.length > 0 ? employees.map(emp => (
                    <p
                      key={emp.id}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        setValue("employee", emp.id.toString(), { shouldValidate: true });
                        setSelectedEmployeeName(getFullName(emp));
                        setShowDropdown(false);
                      }}
                    >
                      {getFullName(emp)}
                    </p>
                  )) : <p className="p-2 text-gray-500">No employees found</p>}
                </div>
              )}

              {errors.employee && <p className="text-error text-sm mt-1">{errors.employee.message}</p>}
            </div>

            {/* Joining Date */}
            <div className="form-control">
              <label className="label">Joining Date <span className="text-error">*</span></label>
              <input
                type="date"
                className="input input-bordered w-full"
                {...register("joiningDate", { required: "Joining date is required" })}
              />
              {errors.joiningDate && <p className="text-error text-sm mt-1">{errors.joiningDate.message}</p>}
            </div>

            {/* Base Salary */}
            <div className="form-control">
              <label className="label">Base Salary <span className="text-error">*</span></label>
              <input
                type="number"
                min={0}
                className="input input-bordered w-full"
                placeholder="Enter Base Salary"
                {...register("baseSalary", { required: "Base salary is required", min: { value: 0, message: "Salary must be positive" } })}
              />
              {errors.baseSalary && <p className="text-error text-sm mt-1">{errors.baseSalary.message}</p>}
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <button type="submit" className="btn btn-primary w-full md:w-40">
              <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
