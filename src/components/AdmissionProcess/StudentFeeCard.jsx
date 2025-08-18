import { useEffect, useState } from "react";
import { fetchStudentFee } from "../../services/api/Api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useParams } from "react-router-dom";

export const StudentFeeCard = () => {
  const [details, setDetails] = useState(null);
  const [filteredSummary, setFilteredSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allFeeTypes, setAllFeeTypes] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const { student_id } = useParams();

  const getStudentFeeDetails = async () => {
    if (!student_id) {
      console.warn("student_id is missing from URL");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchStudentFee(student_id);
      console.log("Student Fee Data:", data);

      if (
        !data ||
        !Array.isArray(data.monthly_summary) ||
        data.monthly_summary.length === 0
      ) {
        setDetails(null);
        setFilteredSummary([]);
        setAllFeeTypes([]);
        return;
      }

      setDetails(data);

      const uniqueTypes = new Set();
      data.monthly_summary.forEach((item) => {
        item.fee_type?.forEach((f) => uniqueTypes.add(f.type));
      });
      setAllFeeTypes([...uniqueTypes]);
      setFilteredSummary(data.monthly_summary);
    } catch (error) {
      console.error("Failed to fetch student fee data", error.response?.data || error);
      setDetails(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (student_id) {
      getStudentFeeDetails();
    }
  }, [student_id]);

  useEffect(() => {
    if (!details) return;
    let filtered = [...details.monthly_summary];
    if (selectedMonth) {
      filtered = filtered.filter((item) =>
        item.month.toLowerCase().includes(selectedMonth.toLowerCase())
      );
    }
    if (selectedYear) {
      filtered = filtered.filter((item) => item.year === selectedYear);
    }
    setFilteredSummary(filtered);
  }, [selectedMonth, selectedYear, details]);

  const exportPDF = () => {
    if (!details || !filteredSummary) return;

    const doc = new jsPDF("portrait", "pt", "A3");
    const margin = 40;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(30, 64, 175);
    doc.text(`${details.student_name}'s Fee Report`, margin, 50);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(60, 60, 60);
    doc.text(`Class: ${details.year_level}`, margin, 70);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 85);

    const headers = [["Month", ...allFeeTypes, "Total Amount", "Dues"]];
    const data = filteredSummary.map((item) => {
      const row = [item.month];
      allFeeTypes.forEach((type) => {
        const fee = item.fee_type.find((f) => f.type === type)?.amount || 0;
        row.push(`₹ ${fee.toFixed(2)}`);
      });
      row.push(`₹ ${item.total_amount.toFixed(2)}`);
      row.push(`₹ ${item.due_amount.toFixed(2)}`);
      return row;
    });

    const totalRow = ["Total"];
    allFeeTypes.forEach((type) => {
      const sum = filteredSummary.reduce(
        (acc, i) => acc + (i.fee_type.find((f) => f.type === type)?.amount || 0),
        0
      );
      totalRow.push(`₹ ${sum.toFixed(2)}`);
    });
    totalRow.push(`₹ ${filteredSummary.reduce((sum, i) => sum + i.total_amount, 0).toFixed(2)}`);
    totalRow.push(`₹ ${filteredSummary.reduce((sum, i) => sum + i.due_amount, 0).toFixed(2)}`);
    data.push(totalRow);

    autoTable(doc, {
      startY: 100,
      head: headers,
      body: data,
      styles: {
        font: "helvetica",
        fontSize: 10,
        halign: "center",
        valign: "middle",
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
      margin: { left: margin, right: margin },
    });

    doc.save(`${details.student_name}_fee_report.pdf`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <i className="fa-solid fa-spinner fa-spin mr-2 text-4xl" />
      </div>
    );
  }

  if (!details) {
    return (
      <div className="p-4 text-center text-red-600 font-medium">
        No fee data available for this student.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 bg-gray-50">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          <i className="fa-solid fa-money-check-alt mr-2"></i>{" "}
          {details.student_name}'s Fee Report Card
        </h1>

        <div className="flex gap-4 justify-center mb-6 flex-wrap">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">All Months</option>
            {[...new Set(details.monthly_summary.map((item) => item.month))].map((month, idx) => (
              <option key={idx} value={month}>
                {month}
              </option>
            ))}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2"
          >
            <option value="">All Years</option>
            {[...new Set(details.monthly_summary.map((item) => item.year).filter(Boolean))].map(
              (year, idx) => (
                <option key={idx} value={year}>
                  {year}
                </option>
              )
            )}
          </select>

          <button
            onClick={exportPDF}
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium px-4 py-2 rounded border border-blue-300"
          >
            <i className="fa-solid fa-download mr-2" /> Download Report
          </button>
        </div>

        {filteredSummary.length === 0 ? (
          <div className="text-center text-gray-600">No fee records found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-[1200px] table-auto border border-gray-300 rounded-lg overflow-hidden">
              <thead className="bgTheme text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Month</th>
                  {allFeeTypes.map((type, i) => (
                    <th key={i} className="px-4 py-3 text-left text-sm font-semibold">
                      {type}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-left text-sm font-semibold">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Dues</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSummary.map((item, index) => (
                  <tr key={index} className="hover:bg-blue-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{item.month}</td>
                    {allFeeTypes.map((type, i) => {
                      const amount = item.fee_type.find((f) => f.type === type)?.amount || 0;
                      return (
                        <td key={i} className="px-4 py-3 text-sm text-gray-500">
                          ₹{amount.toFixed(2)}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3 text-sm text-gray-500">
                      ₹{item.total_amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-sm text-red-600 font-medium">
                      ₹{item.due_amount.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
