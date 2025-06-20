import React, { useEffect, useState } from "react";
import { fetchViewDocuments } from "../../services/api/Api";
import { Link } from "react-router-dom";
import { constants } from "../../global/constants";

export const ViewDocuments = () => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const getViewDocuments = async () => {
    try {
      const data = await fetchViewDocuments();
      setDetails(data);
      setLoading(false);
    } catch (error) {
      console.log("Failed to fetch documents", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getViewDocuments();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading documents...</div>;
  }

  if (!details || details.length === 0) {
    return <div className="p-4 text-center">No documents available.</div>;
  }

  const getRole = (doc) => {
    if (doc.student) return "Student";
    if (doc.teacher) return "Teacher";
    if (doc.guardian) return "Guardian";
    if (doc.office_staff) return "Office Staff";
    return "Unknown";
  };

  const getUploadedBy = (doc) => {
    return getRole(doc) + " ID: " + (
      doc.student ?? doc.teacher ?? doc.guardian ?? doc.office_staff ?? "N/A"
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">
          Uploaded Documents
        </h2>

        <div className="w-full overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bgTheme text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">File Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Document Types</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-nowrap">Upload Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {details.map((doc) =>
                    doc.files.map((file) => (
                      <tr key={file.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-blue-700 text-nowrap">
                          <Link to={file.file.replace("http://localhost:7000", `${constants.baseUrl}`)} target="_blank" rel="noreferrer" className="underline">
                            {file.file.split("/").pop()}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                          {doc.document_types.map((dt) => dt.name).join(", ")}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">{getRole(doc)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700 text-nowrap">
                          {new Date(doc.uploaded_at).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
