import React, { useEffect, useState } from 'react'
import { fetchStudents1, fetchYearLevels } from '../../../services/api/Api';

export const EditDiscount = () => {
      const [loading, setLoading] = useState(false);
      const [students, setStudents] = useState([]);
      const [classes, setClasses] = useState([]);
      const [classId, setClassId] = useState("");
      const access = JSON.parse(localStorage.getItem("authTokens")).access;
      const [fieldDisbaled, setFieldDisabled] = useState(true);
      const [btnDisabled, setBtnDisabled] = useState(true);
      const [errors, setErrors] = useState({});
    
      const [formData, setFormData] = useState({
        student_id: "",
        admission_fee_discount: "",
        tuition_fee_discount: "",
        discount_reason: "",
        is_allowed: true,
      });
    
      const handleChange = (name, value) => {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
    
        // Clear the error for this specific field when user changes it
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      };
    
      // Fetch all classes
      const getClasses = async () => {
        try {
          const response = await fetchYearLevels();
          setClasses(response);
        } catch (err) {
          console.log("Failed to load classes. Please try again." + err);
        }
      };
    
      const getStudents = async (id) => {
        if (!id) return;
        try {
          const Students = await fetchStudents1(id);
          setStudents(Students);
          setFieldDisabled(Students.length === 0);
          if (Students.length === 0) {
            setFormData({
              student_id: "",
              admission_fee_discount: "",
              tuition_fee_discount: "",
              discount_reason: "",
              is_allowed: true,
            });
          }
        } catch (err) {
          console.log("Failed to load school years. Please try again." + err);
        }
      };
    
      useEffect(() => {
        getClasses();
      }, []);
    
      useEffect(() => {
        getStudents(classId);
      }, [classId]);
    
      useEffect(() => {
        setFormData((prev) => ({
          ...prev,
          student_id: "",
        }));
      }, [classId]);
    
      useEffect(() => {
        const hasFeeValue =
          formData.admission_fee_discount.trim() !== "" ||
          formData.tuition_fee_discount.trim() !== "";
        const allRequiredFields = hasFeeValue && formData.student_id;
        setBtnDisabled(!allRequiredFields);
      }, [formData]);
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({}); // clear previous errors
    
        try {
          const payload = {
            ...formData,
            student_id: formData.student_id,
            admission_fee_discount: formData.admission_fee_discount,
            tuition_fee_discount: formData.tuition_fee_discount,
            is_allowed: true,
          };
    
          const response = await createDiscount(access, payload);
          alert("Discount created successfully!");
    
          // If success, reset form
          setFormData({
            student_id: "",
            admission_fee_discount: "",
            tuition_fee_discount: "",
            discount_reason: "",
            is_allowed: true,
          });
        } catch (err) {
          setErrors(err);
        } finally {
          setLoading(false);
        }
      };
    
  return (
    <div>EditDiscount</div>
  )
}
