import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Ellipsis, Trash2, Eye, Flag } from "lucide-react";
import { Dropdown, Empty, Pagination, Menu, Popover } from "antd";
import { toast } from "react-toastify";
import { getAllFeeds, deleteFeed } from "../utils/api";
import FeedDetails from "./FeedDetails";
const reportCount = [
  {
    profile: "https://randomuser.me/api/portraits/men/1.jpg",
    name: "Amit Sharma",
    email: "amit.sharma@example.com",
    comment: "Inappropriate content found in the post. ",
  },
  {
    profile: "https://randomuser.me/api/portraits/women/2.jpg",
    name: "Priya Mehta",
    email: "priya.mehta@example.com",
    comment: "Spam links shared repeatedly.",
  },
  {
    profile: "https://randomuser.me/api/portraits/men/3.jpg",
    name: "Rahul Verma",
    email: "rahul.verma@example.com",
    comment: "Harassment reported in chat.",
  },
  {
    profile: "https://randomuser.me/api/portraits/women/4.jpg",
    name: "Sneha Kapoor",
    email: "sneha.kapoor@example.com",
    comment: "False information being shared.",
  },
  {
    profile: "https://randomuser.me/api/portraits/men/5.jpg",
    name: "Vikram Singh",
    email: "vikram.singh@example.com",
    comment: "User using offensive language.",
  },
  {
    profile: "https://randomuser.me/api/portraits/women/6.jpg",
    name: "Anjali Gupta",
    email: "anjali.gupta@example.com",
    comment: "Duplicate posts cluttering the feed.",
  },
  

];

export default function FeedManageTable({ searchValue }) {
  const [allFeed, setAllFeed] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [feedToDelete, setFeedToDelete] = useState(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [feedToView, setFeedToView] = useState(null);
  const [pagination, setPagination] = useState(null);

  const pageSize = 8;
  const isMounted = useRef(false);
  const debounceRef = useRef(null);

  // ✅ Fetch Feeds (supports search + pagination)
  const fetchFeeds = async (search = "") => {
    try {
      const response = await getAllFeeds(search, currentPage, pageSize);
      const feeds = response.feeds || [];
      setPagination(response);
      setAllFeed(feeds);

      // prefer a totalCount from API; fallback to feeds.length
      setTotalItems(response.totalCount ?? feeds.length);
    } catch (err) {
      // only show toast when component is mounted (avoid toast during initial SSR/mount race)
      if (isMounted.current) toast.error("Failed to fetch feeds");

      setAllFeed([]);
      setTotalItems(0);
    }
  };

  // Debounced effect: runs on searchValue or currentPage change
  useEffect(() => {
    isMounted.current = true;

    // reset to first page when search query changes
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      // ensure currentPage is used (if search changed we usually want page 1)
      const pageToFetch = currentPage;
      fetchFeeds(searchValue || "", pageToFetch);
    }, 400);

    return () => {
      clearTimeout(debounceRef.current);
    };
    // intentionally DO NOT include allFeed in deps to avoid refetch loops
  }, [searchValue, currentPage]);

  // initial mount fetch
  useEffect(() => {
    fetchFeeds(searchValue || "", currentPage);
    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  const pagedFeeds = allFeed.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // ✅ Delete Feed
  const handleDelete = async () => {
    if (!feedToDelete) return;
    try {
      await deleteFeed(feedToDelete);
      toast.success("Feed deleted successfully");
      setFeedToDelete(null);
      // re-fetch current page (use current search + page)
      fetchFeeds(searchValue || "", currentPage);
    } catch (err) {
      toast.error("Failed to delete feed");
    }
  };

  // ✅ Action Menu
  const ActionMenu = (feed) => (
    <Menu>
      <Menu.Item
        key="view"
        icon={<Eye size={16} />}
        onClick={() => {
          setFeedToView(feed);
          setViewModalOpen(true);
        }}
      >
        View
      </Menu.Item>

      <Menu.Item
        key="delete"
        icon={<Trash2 size={16} />}
        danger
        onClick={() => setFeedToDelete(feed._id)}
      >
        Delete
      </Menu.Item>
    </Menu>
  );

  // Add this helper function
  const getReportStatus = (feed) => {
    const reportCount = 7;
    if (reportCount >= 7) return { color: "red", text: "Reported" };

    return { color: "green", text: "None" };
  };

  return (
    <>
      {/* ✅ Table */}
      <motion.div
        className="bg-white rounded-xl border pb-2 "
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="overflow-x-auto rounded-xl ">
          <table className="min-w-full border-collapse ">
            <thead className="bg-gray-100">
              <tr>
                {["Title", "Uploader", "Location", "Actions"].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {allFeed.length > 0 ? (
                allFeed.map((feed) => {
                  const address = feed.address || "N/A";
                  const words = address.split(" ");
                  const shortAddress =
                    words.slice(0, 4).join(" ") +
                    (words.length > 4 ? "..." : "");
                  const reportStatus = getReportStatus(feed);

                  return (
                    <motion.tr
                      key={feed._id}
                      className="hover:bg-gray-50 border-b text-gray-800 "
                      
                    >
                        
                      <td className="px-6 py-3 text-sm font-medium flex ">
                       
                        
                         {feed.title}
                         {(feed.dislikesCount >= 7 || reportCount.length >= 7) && (
  <span className="inline-flex items-center gap-1 px-2 py-1 ml-2 rounded-full text-xs bg-red-500 text-white">
    {/* <Flag size={12} /> */}
    Reported
  </span>
)}

                      </td>

                      <td className="px-6 py-3 text-sm">
                        {feed.uploadedBy?.name || "N/A"}
                      </td>

                      {/* ✅ Location with popover */}
                      <td className="px-6 py-3 text-sm">
                        <Popover
                          content={
                            <span className="max-w-xs block">{address}</span>
                          }
                          title="Full Location"
                          trigger="click"
                        >
                          <span className="cursor-pointer">{shortAddress}</span>
                        </Popover>
                      </td>

                      {/* <td className="px-6 py-3 text-sm">{feed.youtubeViews?.toLocaleString() || 0}</td> */}

                      {/* Add Report Status Column */}
                      {/* <td className="px-6 py-3 text-sm">
                        <Popover 
                          content={
                            <div className="p-2">
                              <p>Report Count: {feed.reportCount || 0}</p>
                              {feed.reportCount > 0 && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Last reported: {new Date(feed.lastReportDate).toLocaleDateString()}
                                </p>
                              )}
                            </div>
                          } 
                          title="Report Details"
                          trigger="hover"
                        >
                          <span className={`
                            inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs
                            ${reportStatus.color === 'red' ? 'bg-red-300 text-red-700' : ''}
                            
                            ${reportStatus.color === 'green' ? 'bg-green-300 text-green-700' : ''}
                          `}>
                            <Flag size={12} />
                            {reportStatus.text}
                          </span>
                        </Popover>
                      </td> */}

                      <td className="px-6 py-3 text-right">
                        <Dropdown
                          overlay={ActionMenu(feed)}
                          trigger={["click"]}
                        >
                          <Ellipsis className="text-gray-600 hover:text-gray-800 cursor-pointer" />
                        </Dropdown>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <Empty
                      description="No feeds found"
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-2 pr-4">
          <Pagination
            current={currentPage}
            total={pagination?.totalFeeds || 0}
            pageSize={pageSize}
            showSizeChanger={false}
            onChange={setCurrentPage}
          />
        </div>
      </motion.div>

      {/* ✅ View Feed Details Modal */}
      {viewModalOpen && feedToView && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-5xl h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setViewModalOpen(false)}
              className="absolute top-4 right-4  text-gray-600 rounded-full px-3 py-1 text-lg"
            >
              ✕
            </button>

            <FeedDetails feed={feedToView} />
          </div>
        </div>
      )}

      {/* ✅ Delete Confirmation */}
      {feedToDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Delete Feed?</h3>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this feed? This action cannot be
              undone.
            </p>

            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded-md border text-gray-700"
                onClick={() => setFeedToDelete(null)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
