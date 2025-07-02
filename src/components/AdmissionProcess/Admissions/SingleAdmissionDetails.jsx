import React, { useEffect, useState } from "react";
import { fetchAdmissionDetailsById } from "../../../services/api/Api";
import { useParams } from "react-router-dom";

export const SingleAdmissionDetails = () => {
  const { id } = useParams();
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const getAdmissionDetailsById = async () => {
    try {
      const data = await fetchAdmissionDetailsById(id);
      setDetails(data);
      setLoading(false);
    } catch (error) {
      console.log("failed to fetch admission details", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAdmissionDetailsById();
  }, [id]);

  if (loading) {
    return <div className="p-4 text-center">Loading details...</div>;
  }

  if (!details) {
    return <div className="p-4 text-center">Failed to load data</div>;
  }

  return (
    <div className="p-3 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="bgTheme text-white px-6 py-4">
          <h1 className="text-2xl font-bold">
            {details.student_input.first_name || "Unknown"} {details.student_input.last_name || ""}'s Admission Details
          </h1>
        </div>

        <div className="p-6">
          {/* Student Information Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">Student Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Full Name:</p>
                <p>
                  {details.student_input.first_name || "Unknown"} {details.student_input.middle_name || ""} {details.student_input.last_name || ""}
                </p>
              </div>
              <div>
                <p className="font-medium">Father's Name:</p>
                <p>{details.student_input.father_name || "Not Provided"}</p>
              </div>
              <div>
                <p className="font-medium">Mother's Name:</p>
                <p>{details.student_input.mother_name || "Not Provided"}</p>
              </div>
              <div>
                <p className="font-medium">Roll No:</p>
                <p>{details.student_input.roll_number || "Not Assigned"}</p>
              </div>
              <div>
                <p className="font-medium">Date of Birth:</p>
                <p>{details.student_input.date_of_birth || "Not Provided"}</p>
              </div>
              <div>
                <p className="font-medium">Gender:</p>
                <p>{details.student_input.gender || "Not Specified"}</p>
              </div>
              <div>
                <p className="font-medium">Email:</p>
                <p>{details.student_input.email || "Not Provided"}</p>
              </div>
              <div>
                <p className="font-medium">Blood Group:</p>
                <p>{details.student_input.blood_group || "Not Provided"}</p>
              </div>
              <div>
                <p className="font-medium">Religion:</p>
                <p>{details.student_input.religion || "Not Specified"}</p>
              </div>
              <div>
                <p className="font-medium">Category:</p>
                <p>{details.student_input.category || "Not Specified"}</p>
              </div>
              <div>
                <p className="font-medium">Height/Weight:</p>
                <p>
                  {details.student_input.height || "Not Measured"} cm / {details.student_input.weight || "Not Measured"} kg
                </p>
              </div>
              <div>
                <p className="font-medium">Siblings:</p>
                <p>{details.student_input.number_of_siblings ?? "None"}</p>
              </div>
              <div>
                <p className="font-medium">Contact number:</p>
                <p>{details.student_input.contact_number || "Not Provided"}</p>
              </div>
              <div>
                <p className="font-medium">Roll Number:</p>
                <p>{details.student_input.roll_number || "Not Assigned"}</p>
              </div>
              <div>
                <p className="font-medium">Scholar Number:</p>
                <p>{details.student_input.scholar_number || "Not Assigned"}</p>
              </div>
            </div>
          </div>

          {/* Parent/Guardian Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">Parent/Guardian Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Guardian Type:</p>
                <p>{details.guardian_type || "Not Specified"}</p>
              </div>
              <div>
                <p className="font-medium">Name:</p>
                <p>
                  {details.guardian_input.first_name || "Unknown"} {details.guardian_input.last_name || ""}
                </p>
              </div>
              <div>
                <p className="font-medium">Phone:</p>
                <p>{details.guardian_input.phone_no || "Not Provided"}</p>
              </div>
              <div>
                <p className="font-medium">Email:</p>
                <p>{details.guardian_input.email || "Not Provided"}</p>
              </div>
              <div>
                <p className="font-medium">Occupation:</p>
                <p>{details.guardian_input.occupation || "Not Specified"}</p>
              </div>
              <div>
                <p className="font-medium">Annual Income:</p>
                <p>
                  {details.guardian_input.annual_income
                    ? `₹${details.guardian_input.annual_income.toLocaleString()}`
                    : "Not Provided"}
                </p>
              </div>
              <div>
                <p className="font-medium">Qualification:</p>
                <p>{details.guardian_input.qualification || "Not Specified"}</p>
              </div>
              <div>
                <p className="font-medium">Designation:</p>
                <p>{details.guardian_input.designation || "Not Specified"}</p>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">Address Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Address:</p>
                <p>
                  {details.address.house_no || "Not Provided"}, {details.address.address_line || "Not Provided"}
                </p>
              </div>
              <div>
                <p className="font-medium">Habitation:</p>
                <p>{details.address.habitation || "Not Specified"}</p>
              </div>
              <div>
                <p className="font-medium">City/State:</p>
                <p>
                  {details.address.city_name || "Not Provided"}, {details.address.state_name || "Not Provided"}
                </p>
              </div>
              <div>
                <p className="font-medium">Country:</p>
                <p>{details.address.country_name || "Not Provided"}</p>
              </div>
              <div>
                <p className="font-medium">District:</p>
                <p>{details.address.district || "Not Specified"}</p>
              </div>
              <div>
                <p className="font-medium">Division:</p>
                <p>{details.address.division || "Not Specified"}</p>
              </div>
              <div>
                <p className="font-medium">Area Code:</p>
                <p>{details.address.area_code || "Not Provided"}</p>
              </div>
            </div>
          </div>

          {/* Admission Details */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">Admission Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Class:</p>
                <p>{details.year_level || "Not Assigned"}</p>
              </div>
              <div>
                <p className="font-medium">Academic Year:</p>
                <p>{details.school_year || "Not Specified"}</p>
              </div>
              <div>
                <p className="font-medium">Admission Date:</p>
                <p>{details.admission_date || "Not Provided"}</p>
              </div>
              <div>
                <p className="font-medium">Enrollment No:</p>
                <p>{details.enrollment_no || "Not Assigned"}</p>
              </div>
              <div>
                <p className="font-medium">Distance to School:</p>
                <p>{details.entire_road_distance_from_home_to_school || "Not Provided"}</p>
              </div>
              <div>
                <p className="font-medium">Previous School:</p>
                <p>{details.previous_school_name || "None"}</p>
              </div>
              <div>
                <p className="font-medium">Previous Standard:</p>
                <p>{details.previous_standard_studied || "None"}</p>
              </div>
              <div>
                <p className="font-medium">Previous Percentage:</p>
                <p>{details.previous_percentage != null ? `${details.previous_percentage.toFixed(2)}%` : "Not Available"}</p>
              </div>
              <div>
                <p className="font-medium">TC Letter:</p>
                <p>{details.tc_letter || "Not Provided"}</p>
              </div>
              <div>
                <p className="font-medium">Emergency Contact:</p>
                <p>{details.emergency_contact_no || "Not Provided"}</p>
              </div>
            </div>
          </div>

          {/* Banking Details */}
          <div>
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">Banking Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Account Holder:</p>
                <p>{details.banking_detail.holder_name || "Not Provided"}</p>
              </div>
              <div>
                <p className="font-medium">Account Number:</p>
                <p>{details.banking_detail.account_no || "Not Provided"}</p>
              </div>
              <div>
                <p className="font-medium">IFSC Code:</p>
                <p>{details.banking_detail.ifsc_code || "Not Provided"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};