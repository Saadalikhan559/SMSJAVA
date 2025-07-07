import { useEffect, useState } from "react";
import { fetchStudentFee } from "../../services/api/Api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Manual import for Vite ESM setup

export const StudentFeeCard = () => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const getStudentFeeDetails = async () => {
    setLoading(true);
    try {
      const data = await fetchStudentFee();
      setDetails(data || null);
    } catch (error) {
      console.error("Failed to fetch student fee data", error);
      setDetails(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStudentFeeDetails();
  }, []);

const exportPDF = () => {
  if (!details || !details.monthly_summary) return;

  const doc = new jsPDF("portrait", "pt", "A3");
  const margin = 40;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(30, 64, 175); // Theme color
  doc.text(`${details.student_name}'s Fee Report`, margin, 50);

  // Subtitle
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(`Class: ${details.year_level}`, margin, 70);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 85);

  // Table Headers
  const headers = [
    [
      "Month",
      "Tuition Fee",
      "Activity/Exam Fee",
      "MIS/Form/Lab Fee",
      "Total Amount",
      "Dues",
    ],
  ];

  // Table Body
  const data = details.monthly_summary.map((item) => {
    const tuitionFee = item.fee_type.find(f => f.type === "Tuition Fee")?.amount || 0;
    const activityFee = item.fee_type.find(f => f.type === "Activity/Exam Fee")?.amount || 0;
    const labFee = item.fee_type.find(f => f.type === "MIS/Form/Lab Fee")?.amount || 0;

    return [
      item.month,
      `₹ ${tuitionFee.toFixed(2)}`,
      `₹ ${activityFee.toFixed(2)}`,
      `₹ ${labFee.toFixed(2)}`,
      `₹ ${item.total_amount.toFixed(2)}`,
      `₹ ${item.due_amount.toFixed(2)}`,
    ];
  });

  // Optional total row
  const totalRow = [
    "Total",
    `₹ ${details.monthly_summary.reduce((sum, i) => sum + (i.fee_type.find(f => f.type === "Tuition Fee")?.amount || 0), 0).toFixed(2)}`,
    `₹ ${details.monthly_summary.reduce((sum, i) => sum + (i.fee_type.find(f => f.type === "Activity/Exam Fee")?.amount || 0), 0).toFixed(2)}`,
    `₹ ${details.monthly_summary.reduce((sum, i) => sum + (i.fee_type.find(f => f.type === "MIS/Form/Lab Fee")?.amount || 0), 0).toFixed(2)}`,
    `₹ ${details.monthly_summary.reduce((sum, i) => sum + i.total_amount, 0).toFixed(2)}`,
    `₹ ${details.monthly_summary.reduce((sum, i) => sum + i.due_amount, 0).toFixed(2)}`
  ];
  data.push(totalRow);

  autoTable(doc, {
    startY: 100,
    head: headers,
    body: data,
    tableWidth: "auto",
    styles: {
      font: "helvetica",
      fontSize: 10,
      halign: "center",
      valign: "middle",
      overflow: "linebreak",
      cellPadding: { top: 8, bottom: 8, left: 14, right: 14 }, 
      textColor: [33, 37, 41],
    },
    headStyles: {
      fillColor: [30, 64, 175],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 11,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: "auto" },
      2: { cellWidth: "auto" },
      3: { cellWidth: "auto" },
      4: { cellWidth: "auto" },
      5: { cellWidth: "auto" },
    },
    margin: { left: margin, right: margin },
  });

  doc.save(`${details.student_name}_fee_report.pdf`);
};


  if (loading) {
    return <div className="p-4 text-center">Loading details...</div>;
  }

  if (!details) {
    return <div className="p-4 text-center">Failed to load data</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 border-b pb-4 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-gray-800">
              {details.student_name}'s Fee Report Card
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mt-1">
              Class: {details.year_level}
            </p>
          </div>

          <button
            className="btn btn-outline btn-sm sm:btn-md text-gray-600 border-gray-500 hover:bg-blue-50"
            onClick={exportPDF}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
              />
            </svg>
            Download Report
          </button>
        </div>

        {details.monthly_summary.length === 0 ? (
          <p className="text-gray-600">No fee records found.</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bgTheme text-white">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                        Month
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                        Tuition Fee
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                        Activity/Exam Fee
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                        MIS/Form/Lab Fee
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                        Total Amount
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">
                        Dues
                      </th>
                      {/* <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Received by</th> */}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {details.monthly_summary.map((item, index) => {
                      const tuitionFee =
                        item.fee_type.find((f) => f.type === "Tuition Fee")
                          ?.amount || 0;
                      const activityFee =
                        item.fee_type.find(
                          (f) => f.type === "Activity/Exam Fee"
                        )?.amount || 0;
                      const labFee =
                        item.fee_type.find((f) => f.type === "MIS/Form/Lab Fee")
                          ?.amount || 0;

                      return (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                            {item.month}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                            ₹{tuitionFee.toFixed(2)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                            ₹{activityFee.toFixed(2)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                            ₹{labFee.toFixed(2)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                            ₹{item.total_amount.toFixed(2)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-red-600 font-medium">
                            ₹{item.due_amount.toFixed(2)}
                          </td>
                          {/* <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">N/A</td> */}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
