import React, { useEffect, useState } from "react";
import { fetchDiscounts } from "../../../services/api/Api";
import { deleteDiscount } from "../../../services/api/Api";
import { updateDiscount } from "../../../services/api/Api";
import { Link } from "react-router-dom";
import { allRouterLink } from "../../../router/AllRouterLinks";


const DiscountedStudents = () => {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    student_name: "",
    admission_fee_discount: "",
    tuition_fee_discount: "",
    admission_fee: "",
    tuition_fee: "",
    discount_reason: "",
  });

  const token = JSON.parse(localStorage.getItem("authTokens"))?.access;

  // Fetch students
  useEffect(() => {
    loadDiscounts();
  }, []);

  const loadDiscounts = async () => {
    try {
      const data = await fetchDiscounts(token);
      setStudents(data);
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  // Delete student
  const handleDelete = async (id) => {
    try {
      await deleteDiscount(token, id);
      setStudents(students.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error deleting student:", err);
    }
  };

  // Edit student
  const handleEdit = (student) => {
    setEditingStudent(student.id);
    setFormData({ ...student });
  };

  // Save edited student
  const handleSave = async () => {
    try {
      await updateDiscount(token, editingStudent, formData);
      loadDiscounts();
      setEditingStudent(null);
    } catch (err) {
      console.error("Error updating student:", err);
    }
  };


  // Confirm delete
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteDiscount(token, deleteId);
      setStudents(students.filter((s) => s.id !== deleteId));
    } catch (err) {
      console.error("Error deleting student:", err);
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  //  Filter 
  const filteredStudents = students.filter((s) =>
    s.student_name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const openDeleteModal = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };


  return (
    <>
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-4 sm:p-6">
          <div className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 border-b pb-2">
              <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800 flex items-center gap-2">
                <i className="fa-solid fa-percentage ml-2"></i> Discounted Students
              </h2>

              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border px-3 py-2 rounded w-full sm:w-64"
              />
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto rounded-lg">
              <table className="min-w-full divide-y divide-gray-300 text-xs sm:text-sm">
                <thead className="bgTheme text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Student Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Year Level</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Admission Fee Discount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Tuition Fee Discount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Admission Fee</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Tuition Fee</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Reason</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold pl-22 text-nowrap">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-700 font-bold capitalize text-nowrap">
                          {s.student_name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-nowrap text-center">{s.year_level}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">₹{s.admission_fee_discount}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">₹{s.tuition_fee_discount}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">₹{s.admission_fee}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-center">₹{s.tuition_fee}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-nowrap text-center">{s.discount_reason || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-500 flex gap-5">
                          <Link
                            to={`${allRouterLink.editDiscount}/${s.id}`}
                            className="btn bgTheme text-white w-23"
                          >
                            <i class="fa-solid fa-pen-to-square"></i> Edit
                          </Link>

                          <button
                            className="btn bgTheme text-white w-23"
                            onClick={() => openDeleteModal(s.id)}
                          >
                            <i className="fa-solid fa-trash"></i> Delete
                          </button>

                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-4 py-6 text-center text-sm text-gray-500">
                        No students found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {confirmOpen && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg ">Confirm Delete</h3>
            <p className="py-4">Are you sure you want to delete this student’s discount record?</p>
            <div className="modal-action">
              <button className="btn btn-primary text-white" onClick={confirmDelete}>
                Yes, Delete
              </button>
              <button className="btn btn-outline" onClick={() => setConfirmOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
};

export default DiscountedStudents;
