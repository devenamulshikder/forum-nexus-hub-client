import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export const AnnouncementList = () => {
  const axiosSecure = useAxiosSecure();
  const { data: announcements = [] } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const res = await axiosSecure.get("/announcements");
      return res.data;
    },
  });

  if (!announcements.length) return null;

  return (
    <div className="max-w-3xl mx-auto my-6">
      <h3 className="text-xl font-bold mb-4">Latest Announcements</h3>
      <div className="space-y-4">
        {announcements.map((a) => (
          <div
            key={a._id}
            className="p-4 border border-gray-200 rounded shadow"
          >
            <div className="flex items-center gap-3 mb-2">
              <img
                src={a.image}
                className="w-10 h-10 rounded-full object-cover"
              />
              <p className="font-semibold">{a.name}</p>
            </div>
            <h4 className="font-bold text-lg">{a.title}</h4>
            <h4 className=" text-lg">{a.priority}</h4>
            <h4 className="font-bold text-lg">
              {new Date(a?.createdAt).toLocaleDateString() || "N/A"}
            </h4>
            <p>{a.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
