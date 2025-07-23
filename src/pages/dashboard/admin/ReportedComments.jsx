import { useQuery } from "@tanstack/react-query";
import { FaTrash, FaCheck, FaBan, FaEye } from "react-icons/fa";
import { toast } from "sonner";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

export const ReportedComments = () => {
  const axiosSecure = useAxiosSecure();

  const { data: reports = [], refetch } = useQuery({
    queryKey: ["reports"],
    queryFn: async () => {
      const res = await axiosSecure.get("/reports");
      return res.data;
    },
  });
  const handleAction = async (reportId, action) => {
    try {
      await axiosSecure.patch(`/reports/${reportId}`, { action });
      toast.success(`Action completed: ${action}`);
      refetch();
    } catch (error) {
      console.log(error);
      toast.error("Failed to perform action");
    }
  };
  const handleDelete = async (reportId) => {
    try {
      await axiosSecure.delete(`/reports/${reportId}`);
      toast.success("Report deleted successfully");
      refetch();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete report");
    }
  };

  const actions = [
    {
      name: "Dismiss",
      icon: <FaCheck />,
      color: "green",
      handler: (id) => handleAction(id, "dismiss"),
    },
    {
      name: "Delete",
      icon: <FaTrash />,
      color: "red",
      handler: (id) => handleDelete(id),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#6D7CFF] to-[#A167FF] bg-clip-text text-transparent">
        Reported Content
      </h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Reporter
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Feedback
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.map((report) => (
              <tr key={report._id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={report.reporterPhoto}
                      alt={report.reporterName}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <div>
                      <p className="text-sm font-medium">
                        {report.reporterName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {report.reporterEmail}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                    {report.feedback}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      report.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : report.status === "resolved"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    {actions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => action.handler(report._id)}
                        className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm bg-${action.color}-100 text-${action.color}-700 hover:bg-${action.color}-200`}
                      >
                        {action.icon}
                        {action.name}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
