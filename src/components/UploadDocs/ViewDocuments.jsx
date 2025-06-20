import React, { useEffect, useState } from "react";
import { fetchViewDocuments } from "../../services/api/Api";
import { Link } from "react-router-dom";

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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6 border-b pb-2">
          Uploaded Documents
        </h2>

        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bgTheme text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">File Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Document Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Uploaded By</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Upload Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {details.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">{doc.file_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{doc.document_type}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{doc.uploaded_by}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{doc.role}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{doc.uploaded_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
