import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  createDiscount,
  createSalary,
  fetchEmployee,
  fetchRoles,
} from "../../../services/api/Api";

export const CreateSalaryExpense = () => {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedEmployeeName, setSelectedEmployeeName] = useState("");

  const access = JSON.parse(localStorage.getItem("authTokens")).access;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm();

  const selectedRole = watch("role");
  const selectedEmployee = watch("employee");

  // Helper function to get full name from employee object
  const getFullName = (employee) => {
    if (!employee) return "";
    return `${employee.first_name || ""} ${employee.last_name || ""}`.trim();
  };

  // fetch roles
  const getRole = async () => {
    try {
      const fetchedRoles = await fetchRoles();
      setRoles(fetchedRoles || []); // Ensure we always have an array
    } catch (error) {
      console.log("Could not get roles", error.message);
      setRoles([]); // Set empty array on error
    }
  };

  const getRoleNameById = (roleId) => {
    if (!roleId) return null;
    const role = roles.find((r) => r.id == roleId);
    return role ? role.name : "";
  };

  const filteredRoles = roles.filter((role) =>
    role && (role.name === "teacher" || role.name === "office staff")
      ? role
      : null
  );

  // Fixed: Filter out undefined/null employees and handle missing names
  const filteredEmployees = employees.filter(
    (employee) =>
      employee &&
      getFullName(employee) &&
      getFullName(employee).toLowerCase().includes(searchInput.toLowerCase())
  );

  // fetch employees when role changes
  const getEmployee = async () => {
    try {
      if (selectedRole) {
        const roleName = getRoleNameById(selectedRole);
        if (roleName) {
          const fetchedEmployee = await fetchEmployee(access, roleName);
          setEmployees(fetchedEmployee || []); // Ensure we always have an array
        }
      } else {
        setEmployees([]);
      }
    } catch (error) {
      console.log("Could not get employees", error.message);
      setEmployees([]); // Set empty array on error
    }
  };

  useEffect(() => {
    getRole();
  }, []);

  useEffect(() => {
    getEmployee();
  }, [selectedRole]);

  // Update selected employee name when employee changes
  useEffect(() => {
    if (selectedEmployee && employees.length > 0) {
      const employee = employees.find(
        (e) => e && e.id && e.id.toString() == selectedEmployee.toString()
      );
      if (employee) {
        setSelectedEmployeeName(getFullName(employee));
      }
    } else {
      setSelectedEmployeeName("");
    }
  }, [selectedEmployee, employees]);

  // Form submission
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const payload = {
        user: Number(data.employee),
        joining_date: data.joiningDate,
        base_salary: data.baseSalary,
      };
      const response = await createSalary(access, payload);
      if (response.status === 200 || response.status === 201) {
        alert("Successfully created a salary");
      }
    } catch (err) {
      console.error("Submission failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-base-100 rounded-box my-5 shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8">
        Create Salary
        <i className="fa-solid fa-percentage ml-2"></i>
      </h1>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
              className="select select-bordered w-full focus:outline-none"
              {...register("role", { required: "Role is required" })}
            >
              <option value="">Select Role</option>
              {filteredRoles?.map(
                (role) =>
                  role && (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  )
              )}
            </select>
            {errors.role && (
              <p className="text-error text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Employee Selection */}
          <div className="form-control relative">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                <i className="fa-solid fa-user text-sm"></i>
                Employee <span className="text-error">*</span>
              </span>
            </label>

            <div
              className="input input-bordered w-full flex items-center justify-between cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {selectedEmployeeName || "Select Employee"}
              <i
                className={`fa-solid fa-chevron-${
                  showDropdown ? "up" : "down"
                } ml-2`}
              ></i>
            </div>

            {showDropdown && (
              <div className="absolute z-10 bg-white rounded w-full mt-1 shadow-lg">
                <div className="p-2 sticky top-0 shadow-sm">
                  <input
                    type="text"
                    placeholder="Search Employee..."
                    className="input input-bordered w-full focus:outline-none"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>

                <div className="max-h-40 overflow-y-auto">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map(
                      (employee) =>
                        employee && (
                          <p
                            key={employee.id}
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => {
                              setValue("employee", employee.id.toString(), {
                                shouldValidate: true,
                              });
                              setSelectedEmployeeName(getFullName(employee));
                              setSearchInput("");
                              setShowDropdown(false);
                            }}
                          >
                            {getFullName(employee)}
                          </p>
                        )
                    )
                  ) : (
                    <p className="p-2 text-gray-500">No employees found</p>
                  )}
                </div>
              </div>
            )}
            {errors.employee && (
              <p className="text-error text-sm mt-1">
                {errors.employee.message}
              </p>
            )}
          </div>

          {/* Joining Date */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                <i className="fa-solid fa-calendar-days text-sm"></i>
                Joining Date <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full focus:outline-none"
              {...register("joiningDate", {
                required: "Joining date is required",
              })}
            />
            {errors.joiningDate && (
              <p className="text-error text-sm mt-1">
                {errors.joiningDate.message}
              </p>
            )}
          </div>

          {/* Base Salary */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                <i className="fa-solid fa-sack-dollar text-sm"></i>
                Base Salary <span className="text-error">*</span>
              </span>
            </label>
            <input
              type="number"
              min={0}
              placeholder="Enter Base Salary e.g: 15000"
              className="input input-bordered w-full focus:outline-none"
              {...register("baseSalary", {
                required: "Base salary is required",
                min: { value: 0, message: "Salary must be positive" },
              })}
            />
            {errors.baseSalary && (
              <p className="text-error text-sm mt-1">
                {errors.baseSalary.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-center pt-6 gap-4">
          <button
            type="submit"
            className="btn bgTheme text-white w-full md:w-40"
          >
            {loading ? (
              <i className="fa-solid fa-spinner fa-spin mr-2"></i>
            ) : (
              <i className="fa-solid fa-wand-magic-sparkles mr-2"></i>
            )}
            {loading ? "" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
};