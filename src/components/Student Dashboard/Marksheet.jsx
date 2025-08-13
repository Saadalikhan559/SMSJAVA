import React, { useState, useEffect, useRef } from "react";
import { fetchMarksheet } from "../../services/api/Api";
import { useParams } from "react-router-dom";

const Marksheet = () => {
  const printRef = useRef();
  const { id } = useParams();
  const [marksheet, setMarksheet] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const tokenData = localStorage.getItem("authTokens");
    if (tokenData) {
      try {
        const tokens = JSON.parse(tokenData);
        if (tokens?.access && tokens.access !== accessToken) {
          setAccessToken(tokens.access);
        }
      } catch (error) {
        console.error("Error parsing auth tokens:", error);
      }
    }
  }, []);

  const getMarksheet = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!accessToken) {
        throw new Error("No access token available");
      }

      if (!id) {
        throw new Error("No id available");
      }

      const obj = await fetchMarksheet(accessToken, id); 
      if (obj && obj.length > 0) {
        setMarksheet(obj);
      } else {
        throw new Error("Received empty response from fetchMarksheet");
      }
    } catch (err) {
      console.error("Failed to load marksheet:", err);
      setError(err.message || "Failed to load marksheet data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      // Only call getExamType if we have a token
      getMarksheet();
    }
  }, [accessToken]);

  const handlePrint = () => {
    const originalContents = document.body.innerHTML;
    const printContents = printRef.current.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload(); // reload to restore the app
  };

  // Static payload data
  const data = marksheet;
  // Static payload data
  // const data = {
  //   id: 47,
  //   student: 4,
  //   student_name: "Ayaan Mohammad Sheikh",
  //   father_name: "Salman Sheikh",
  //   mother_name: "Farah Sheikh",
  //   date_of_birth: "2010-03-10",
  //   contact_number: "9952115463",
  //   scholar_number: "4544545",
  //   standard: "Class 7",
  //   academic_year: "2025-2026",
  //   total_marks: 67.0,
  //   max_marks: 100,
  //   percentage: 67.0,
  //   grade: "B",
  //   division: "First",
  //   rank: 21,
  //   attendance: "2/230",
  //   teacher_remark: "ok",
  //   supplementary_in: [],
  //   promoted_to_class: "Class 8",
  //   school_reopen_date: "2025-07-21",
  //   documents: [],
  //   subjects: [
  //     {
  //       exam_type: "fa1",
  //       subjects: {
  //         Science: 56.0,
  //         Mathematics: 78.0,
  //         English: 82.0,
  //         Hindi: 65.0,
  //         "Social Studies": 70.0,
  //       },
  //       total: 56.0,
  //       max_marks: 10,
  //       percentage: 560.0,
  //       grade: "A+",
  //     },
  //     {
  //       exam_type: "sa1",
  //       subjects: {
  //         Science: 58.0,
  //         Mathematics: 72.0,
  //         English: 75.0,
  //         Hindi: 68.0,
  //         "Social Studies": 65.0,
  //       },
  //       total: 58.0,
  //       max_marks: 100,
  //       percentage: 58.0,
  //       grade: "C",
  //     },
  //     {
  //       exam_type: "sa2",
  //       subjects: {
  //         Science: 76.0,
  //         Mathematics: 85.0,
  //         English: 80.0,
  //         Hindi: 72.0,
  //         "Social Studies": 78.0,
  //       },
  //       total: 76.0,
  //       max_marks: 100,
  //       percentage: 76.0,
  //       grade: "A",
  //     },
  //   ],
  //   subject_avg: {
  //     Science: 67.0,
  //     Mathematics: 78.3,
  //     English: 79.0,
  //     Hindi: 68.3,
  //     "Social Studies": 71.0,
  //   },
  //   non_scholastic: [
  //     {
  //       subject: "Conversation",
  //       term: 1,
  //       grade: "A",
  //     },
  //     {
  //       subject: "Conversation",
  //       term: 2,
  //       grade: "A+",
  //     },
  //     {
  //       subject: "Drawing/Craft",
  //       term: 1,
  //       grade: "B+",
  //     },
  //     {
  //       subject: "Drawing/Craft",
  //       term: 2,
  //       grade: "A",
  //     },
  //   ],
  //   personal_social: [
  //     {
  //       quality: "Cleanliness",
  //       term: "Term 1",
  //       grade: "B",
  //       remark: "Maintains good hygiene",
  //     },
  //     {
  //       quality: "Cleanliness",
  //       term: "Term 2",
  //       grade: "A",
  //       remark: "Excellent improvement",
  //     },
  //     {
  //       quality: "Discipline",
  //       term: "Term 1",
  //       grade: "A",
  //       remark: "Well behaved",
  //     },
  //     {
  //       quality: "Discipline",
  //       term: "Term 2",
  //       grade: "A+",
  //       remark: "Role model for others",
  //     },
  //   ],
  // };

  // Process subject data for the table
  const getSubjectScores = (subjectName) => {
    const fa1 =
      data.subjects.find((e) => e.exam_type === "fa1")?.subjects?.[
        subjectName
      ] || "-";
    const fa2 =
      data.subjects.find((e) => e.exam_type === "fa2")?.subjects?.[
        subjectName
      ] || "-";
    const sa1 =
      data.subjects.find((e) => e.exam_type === "sa1")?.subjects?.[
        subjectName
      ] || "-";
    const fa3 =
      data.subjects.find((e) => e.exam_type === "fa3")?.subjects?.[
        subjectName
      ] || "-";
    const sa2 =
      data.subjects.find((e) => e.exam_type === "sa2")?.subjects?.[
        subjectName
      ] || "-";
    const avg = data.subject_avg[subjectName] || "-";

    return [fa1, fa2, sa1, fa3, sa2, avg];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  if (!marksheet) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-600">No marksheet data available</p>
      </div>
    );
  }

  // Get all subject names from the data
  const allSubjects = Object.keys(data.subject_avg || {});

  return (
    <div className="bg-gray-100 min-h-screen p-2 md:p-6">
      {/* Printable Marksheet Section */}
      <div ref={printRef}>
        <div className="max-w-2xl mx-auto border-3 border-red-700 p-4 bg-white shadow-xl font-sans text-sm m-4">
          {/* Header */}
          <div className="border-2 border-black">
            <div className="flex items-center justify-start bg-yellow-400 border-b-2 border-black px-2 md:px-4 py-1 md:py-2 relative">
              {/* Diamond 4S */}
              <div className="absolute -left-2 md:-left-3 top-1/2 transform -translate-y-1/2 rotate-45 w-8 h-8 md:w-12 md:h-12 bg-red-700 flex items-center justify-center border border-black z-10 ml-4 md:ml-8">
                <span className="rotate-[315deg] text-yellow-300 font-extrabold text-xl md:text-4xl">
                  4S
                </span>
              </div>

              {/* School Info */}
              <div className="flex-1 text-center ml-12 md:ml-18">
                <h1 className="text-lg md:text-2xl font-extrabold uppercase text-red-700 tracking-wider">
                  New Progressive Education Public School
                </h1>
              </div>
            </div>

            <div>
              <p className="text-xxs md:text-xs text-black ml-20 md:ml-32 font-bold">
                10, Prince Colony, Behind Old Civil Court, Lower Idgah Hills,
                Bhopal
              </p>
            </div>
            {/* Result Line */}
            <div className="text-center py-1 bg-blue-100 text-blue-800 font-bold tracking-wider text-xs md:text-sm border-t border-gray-700">
              ANNUAL RESULT {data.academic_year}
            </div>
          </div>

          {/* Student Info */}
          <div className="border border-black text-xxs md:text-xs font-sans">
            {[
              [
                ["Name", data.student_name],
                ["Scholar No.", data.scholar_number, true],
                ["SSSM ID", "1727456484"],
              ],
              [
                ["Father's Name", `Mr. ${data.father_name}`],
                ["Class", data.standard, true],
                ["Aadhaar No.", "89675475854"],
              ],
              [
                ["Mother's Name", `Mrs. ${data.mother_name}`],
                [
                  "DOB",
                  new Date(data.date_of_birth).toLocaleDateString("en-GB"),
                  true,
                ],
                ["Pen No.", "21258294654"],
              ],
              [
                ["Mobile No.", data.contact_number],
                ["Aapaar ID", "124748344697"],
              ],
            ].map((row, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row border-b border-black last:border-b-0"
              >
                {row.map(([label, value, boxed], i) => (
                  <div
                    key={i}
                    className={`flex items-center ${
                      i === 2 ? "sm:w-2/6" : "sm:w-1/3"
                    } px-1 md:px-2 py-0.5 md:py-1`}
                  >
                    {/* Label */}
                    <span className="w-[40%] sm:w-[45%] text-black tracking-tight font-bold">
                      {label}:
                    </span>

                    {/* Value */}
                    <span
                      className={`w-[60%] sm:w-[55%] text-gray-900 italic font-medium tracking-wide ${
                        boxed
                          ? "border border-black px-0.5 md:px-1 py-0.5 ml-0.5 rounded-sm bg-white"
                          : ""
                      }`}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Scholastic Table */}
          <div className="mb-2 md:mb-4 overflow-x-auto">
            <h2 className="text-center bg-blue-100 text-blue-800 font-bold tracking-wider text-xs md:text-sm border-t border-b border-gray-700 py-1">
              Scholastic Evaluation
            </h2>
            <div className="min-w-full">
              <table className="w-full border border-black text-xxs md:text-xs text-center border-collapse">
                <thead className="bg-gray-200">
                  <tr>
                    {[
                      "Subject",
                      "FA1",
                      "FA2",
                      "SA1",
                      "FA3",
                      "SA2",
                      "Avg SA1+SA2",
                    ].map((h, i) => (
                      <th
                        key={i}
                        className="border border-black px-1 py-0.5 md:px-2 md:py-1"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allSubjects.map((subject) => {
                    const [fa1, fa2, sa1, fa3, sa2, avg] =
                      getSubjectScores(subject);
                    return (
                      <tr key={subject} className="bg-white">
                        <td className="border border-black px-1 py-0.5 md:px-2 md:py-1 text-center text-red-500 font-bold">
                          {subject.length > 10
                            ? subject.substring(0, 30) + ""
                            : subject.toUpperCase()}
                        </td>
                        <td
                          className={`border border-black px-1 py-0.5 md:px-2 md:py-1 ${
                            fa1 < 40 ? "text-red-600" : ""
                          }`}
                        >
                          {fa1}
                        </td>
                        <td
                          className={`border border-black px-1 py-0.5 md:px-2 md:py-1 ${
                            fa2 < 40 ? "text-red-600" : ""
                          }`}
                        >
                          {fa2}
                        </td>
                        <td
                          className={`border border-black px-1 py-0.5 md:px-2 md:py-1 ${
                            sa1 < 40 ? "text-red-600" : ""
                          }`}
                        >
                          {sa1}
                        </td>
                        <td
                          className={`border border-black px-1 py-0.5 md:px-2 md:py-1 ${
                            fa3 < 40 ? "text-red-600" : ""
                          }`}
                        >
                          {fa3}
                        </td>
                        <td
                          className={`border border-black px-1 py-0.5 md:px-2 md:py-1 ${
                            sa2 < 40 ? "text-red-600" : ""
                          }`}
                        >
                          {sa2}
                        </td>
                        <td
                          className={`border border-black px-1 py-0.5 md:px-2 md:py-1 ${
                            avg < 40 ? "text-red-600" : ""
                          }`}
                        >
                          {avg}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-white">
                    <td className="border border-black px-1 py-0.5 md:px-2 md:py-1 text-center text-red-500 font-bold">
                      TOTAL
                    </td>
                    <td className="border border-black px-1 py-0.5 md:px-2 md:py-1">
                      {data.subjects.find((e) => e.exam_type === "fa1")
                        ?.total ?? "0"}
                      /500
                    </td>
                    <td className="border border-black px-1 py-0.5 md:px-2 md:py-1">
                      {data.subjects.find((e) => e.exam_type === "fa2")
                        ?.total ?? "0"}
                      /500
                    </td>
                    <td className="border border-black px-1 py-0.5 md:px-2 md:py-1">
                      {data.subjects.find((e) => e.exam_type === "sa1")
                        ?.total ?? "0"}
                      /500
                    </td>
                    <td className="border border-black px-1 py-0.5 md:px-2 md:py-1">
                      {data.subjects.find((e) => e.exam_type === "fa3")
                        ?.total ?? "0"}
                      /500
                    </td>
                    <td className="border border-black px-1 py-0.5 md:px-2 md:py-1">
                      {data.subjects.find((e) => e.exam_type === "sa2")
                        ?.total ?? "0"}
                      /500
                    </td>
                    <td className="border border-black px-1 py-0.5 md:px-2 md:py-1">
                      {data.total_marks}/500
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-black px-1 py-0.5 md:px-2 md:py-1 text-center text-red-500 font-bold">
                      PERCENTAGE
                    </td>
                    <td
                      className="border border-black px-1 py-0.5 md:px-2 md:py-1"
                      colSpan="1"
                    >
                      {data.subjects.find((e) => e.exam_type === "fa1")
                        ?.percentage ?? ""}
                      %
                    </td>
                    <td
                      className="border border-black px-1 py-0.5 md:px-2 md:py-1"
                      colSpan="1"
                    >
                      {data.subjects.find((e) => e.exam_type === "fa2")
                        ?.percentage ?? ""}
                      %
                    </td>
                    <td
                      className="border border-black px-1 py-0.5 md:px-2 md:py-1"
                      colSpan="1"
                    >
                      {data.subjects.find((e) => e.exam_type === "sa1")
                        ?.percentage ?? ""}
                      %
                    </td>
                    <td
                      className="border border-black px-1 py-0.5 md:px-2 md:py-1"
                      colSpan="1"
                    >
                      {data.subjects.find((e) => e.exam_type === "fa3")
                        ?.percentage ?? ""}
                      %
                    </td>
                    <td
                      className="border border-black px-1 py-0.5 md:px-2 md:py-1"
                      colSpan="1"
                    >
                      {data.subjects.find((e) => e.exam_type === "sa2")
                        ?.percentage ?? ""}
                      %
                    </td>
                    <td
                      className="border border-black px-1 py-0.5 md:px-2 md:py-1"
                      colSpan="1"
                    >
                      {data.percentage}%
                    </td>
                  </tr>
                  <tr className="bg-white">
                    <td className="border border-black px-1 py-0.5 md:px-2 md:py-1 text-center text-red-500 font-bold">
                      GRADE
                    </td>
                    <td
                      className="border border-black px-1 py-0.5 md:px-2 md:py-1"
                      colSpan="1"
                    >
                      {data.subjects.find((e) => e.exam_type === "fa1")
                        ?.grade ?? ""}
                    </td>
                    <td
                      className="border border-black px-1 py-0.5 md:px-2 md:py-1"
                      colSpan="1"
                    >
                      {data.subjects.find((e) => e.exam_type === "fa2")
                        ?.grade ?? ""}
                    </td>
                    <td
                      className="border border-black px-1 py-0.5 md:px-2 md:py-1"
                      colSpan="1"
                    >
                      {data.subjects.find((e) => e.exam_type === "sa1")
                        ?.grade ?? ""}
                    </td>
                    <td
                      className="border border-black px-1 py-0.5 md:px-2 md:py-1"
                      colSpan="1"
                    >
                      {data.subjects.find((e) => e.exam_type === "fa3")
                        ?.grade ?? ""}
                    </td>
                    <td
                      className="border border-black px-1 py-0.5 md:px-2 md:py-1"
                      colSpan="1"
                    >
                      {data.subjects.find((e) => e.exam_type === "sa2")
                        ?.grade ?? ""}
                    </td>
                    <td
                      className="border border-black px-1 py-0.5 md:px-2 md:py-1"
                      colSpan="1"
                    >
                      {data.grade}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 text-xxs md:text-xs border border-black p-1 md:p-2 mb-1 md:mb-2 bg-gray-50 rounded-md shadow-sm">
            <div className="text-gray-700 mb-1 sm:mb-0">
              <span className="font-semibold uppercase text-blue-800">
                Rank:
              </span>{" "}
              <span className="font-bold text-black">{data.rank || "—"}</span>
            </div>
            <div className="text-gray-700 mb-1 sm:mb-0">
              <span className="font-semibold uppercase text-blue-800">
                Attendance:
              </span>{" "}
              <span className="font-bold text-black">{data.attendance}</span>
            </div>
            <div className="text-gray-700">
              <span className="font-semibold uppercase text-blue-800">
                Division:
              </span>{" "}
              <span className="font-bold text-black">{data.division}</span>
            </div>
          </div>

          {/* Non-Scholastic & Social */}
          <div>
            <h2 className="text-center bg-blue-100 text-blue-800 font-bold tracking-wider text-xs md:text-sm border-t border-b border-gray-700 py-1">
              <span>NON-SCHOLASTIC EVALUATION</span>
              <span className="hidden sm:inline">
                {" "}
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
              </span>
              <span className="sm:hidden"> </span>
              <span>PERSONAL & SOCIAL QUALITIES</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4 mb-2 md:mb-4">
            {/* Non-Scholastic Table - Static Subjects with Dynamic Grades */}
            <div className="overflow-x-auto">
              <table className="w-full text-xxs md:text-xs border border-black text-center border-collapse">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border border-black px-1 py-0.5">Subject</th>
                    <th className="border border-black px-1 py-0.5">I Term</th>
                    <th className="border border-black px-1 py-0.5">II Term</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Conversation - Static Row */}
                  <tr className="bg-white">
                    <td className="border border-black px-1 py-0.5 text-left">
                      Conversation
                    </td>
                    <td className="border border-black font-bold">
                      {data.non_scholastic.find(
                        (item) =>
                          item.subject === "Conversation" &&
                          item.term === "Term 1"
                      )?.grade || "-"}
                    </td>
                    <td className="border border-black font-bold">
                      {data.non_scholastic.find(
                        (item) =>
                          item.subject === "Conversation" &&
                          item.term === "Term 2"
                      )?.grade || "-"}
                    </td>
                  </tr>

                  {/* Drawing/Craft - Static Row */}
                  <tr className="bg-white">
                    <td className="border border-black px-1 py-0.5 text-left">
                      Drawing/Craft
                    </td>
                    <td className="border border-black font-bold">
                      {data.non_scholastic.find(
                        (item) =>
                          item.subject === "Drawing/Craft" &&
                          item.term === "Term 1"
                      )?.grade || "-"}
                    </td>
                    <td className="border border-black font-bold">
                      {data.non_scholastic.find(
                        (item) =>
                          item.subject === "Drawing/Craft" &&
                          item.term === "Term 2"
                      )?.grade || "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xxs md:text-xs border border-black border-collapse">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border border-black px-1 py-0.5">Trait</th>
                    <th className="border border-black px-1 py-0.5">I Term</th>
                    <th className="border border-black px-1 py-0.5">II Term</th>
                    <th className="border border-black px-1 py-0.5">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Cleanliness */}
                  <tr className="bg-white">
                    <td className="border border-black px-1 py-0.5 text-left">
                      Cleanliness
                    </td>
                    <td className="border border-black font-bold pl-1">
                      {data.personal_social.find(
                        (item) =>
                          item.quality === "Cleanliness" &&
                          item.term === "Term 1"
                      )?.grade || "-"}
                    </td>
                    <td className="border border-black font-bold pl-1">
                      {data.personal_social.find(
                        (item) =>
                          item.quality === "Cleanliness" &&
                          item.term === "Term 2"
                      )?.grade || "-"}
                    </td>
                    <td className="border border-black pl-1 text-left">
                      {data.personal_social.find(
                        (item) =>
                          item.quality === "Cleanliness" &&
                          item.term === "Term 2"
                      )?.remark || "-"}
                    </td>
                  </tr>

                  {/* Discipline */}
                  <tr className="bg-white">
                    <td className="border border-black px-1 py-0.5 text-left">
                      Discipline
                    </td>
                    <td className="border border-black font-bold pl-1">
                      {data.personal_social.find(
                        (item) =>
                          item.quality === "Discipline" &&
                          item.term === "Term 1"
                      )?.grade || "-"}
                    </td>
                    <td className="border border-black font-bold pl-1">
                      {data.personal_social.find(
                        (item) =>
                          item.quality === "Discipline" &&
                          item.term === "Term 2"
                      )?.grade || "-"}
                    </td>
                    <td className="border border-black pl-1 text-left">
                      {data.personal_social.find(
                        (item) =>
                          item.quality === "Discipline" &&
                          item.term === "Term 2"
                      )?.remark || "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t-2 border-black pt-1 md:pt-3 text-xxs md:text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 mb-2 md:mb-4">
              <div>
                <strong>Pass/Promoted to Class:</strong>{" "}
                {data.promoted_to_class}
              </div>
              <div>
                <strong>Supplementary In:</strong>{" "}
                {data.supplementary_in.length > 0
                  ? data.supplementary_in.join(", ")
                  : "—"}
              </div>
              <div>
                <strong>School Re-opens on:</strong>{" "}
                {new Date(data.school_reopen_date).toLocaleDateString("en-GB")}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 text-center pt-2 md:pt-4 border-t border-gray-400 font-semibold text-red-700 gap-2 md:gap-0">
              <div>
                <p>Sign of Class Teacher</p>
                <img
                  src="https://a.storyblok.com/f/191576/1176x882/0707bde47c/make_signature_hero_after.webp"
                  alt="Class Teacher Signature"
                  className="h-16 md:h-22 mx-auto object-contain"
                />
              </div>
              <div>
                <p>Sign of Principal</p>
                <img
                  src="https://www.signwell.com/assets/vip-signatures/muhammad-ali-signature-3f9237f6fc48c3a04ba083117948e16ee7968aae521ae4ccebdfb8f22596ad22.svg"
                  alt="Principal Signature"
                  className="h-16 md:h-22 mx-auto object-contain"
                />
              </div>
              <div>
                <p>Parent's/Guardian's Sign</p>
                <img
                  src="https://www.shutterstock.com/image-vector/signature-vector-hand-drawn-autograph-600nw-2387543207.jpg"
                  alt="Parent/Guardian Signature"
                  className="h-16 md:h-22 mx-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print Button */}
      <div className="text-center mb-2 md:mb-4">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white font-bold px-4 py-1 md:px-6 md:py-2 rounded hover:bg-blue-700 text-sm md:text-base"
        >
          Download Marksheet
        </button>
      </div>
    </div>
  );
};

export default Marksheet;
