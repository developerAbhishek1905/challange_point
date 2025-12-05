import { useState, useEffect, useRef,useCallback } from "react";
import { motion } from "framer-motion";
import { Ellipsis, Trash2, Eye, Flag } from "lucide-react";
import { Dropdown, Empty, Pagination, Menu, Popover,Modal } from "antd";
import { toast } from "react-toastify";
import { getAllFeeds, deleteFeed,getFeedById,getreportById } from "../utils/api";
import FeedDetails from "./FeedDetails";


export default function FeedManageTable({ searchValue }) {
  const [allFeed, setAllFeed] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [feedToDelete, setFeedToDelete] = useState(null);

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [feedToView, setFeedToView] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [feedDetails, setFeedDetails] = useState(null);
  const [report, setReport] = useState(null);
  const [pageCountForSearch, setPageCountForSearch] = useState(1);

  const pageSize = 10;
  const isMounted = useRef(false);
  const debounceRef = useRef(null);

  // ✅ Fetch Feeds (supports search + pagination)
  const fetchFeeds = useCallback(async () => {
    try {
      const response = await getAllFeeds(searchValue,searchValue ===''? currentPage:pageCountForSearch, pageSize);
      const feeds = response.feeds || [];
      setPagination(response);
      setAllFeed(feeds);
      searchValue === '' && setPageCountForSearch(1);

      // prefer a totalCount from API; fallback to feeds.length
      setTotalItems(response.totalCount ?? feeds.length);
    } catch (err) {
      // only show toast when component is mounted (avoid toast during initial SSR/mount race)
      if (isMounted.current) toast.error("Failed to fetch feeds");

      setAllFeed([]);
      setTotalItems(0);
    }
  }, [searchValue, currentPage,pageCountForSearch]);

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
  }, [fetchFeeds]);

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

    const handlePageChange = (page) => setCurrentPage(page)||setPageCountForSearch(page);


  const fetchFeedDetails = async (feedId) => {
    try {
      const feedDetails = await getFeedById(feedId);
      const getReport = await getreportById(feedId);
      setReport(getReport)
        setFeedDetails(feedDetails);
        ;
    } catch (error) {
      console.error("Error fetching feed details:", error);
      toast.error("Failed to fetch feed details");
      return null;
    }
  }
  // ✅ Action Menu
  const ActionMenu = (feed) => (
    <Menu>
      <Menu.Item
        key="view"
        icon={<Eye size={16} />}
        onClick={() => {
          setFeedToView(feed);
          setViewModalOpen(true);
          fetchFeedDetails(feed._id);
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
                      // className="hover:bg-gray-50 border-b text-gray-800 "
                      className={`border-b ${(feed.dislikesCount >= 7 || feed?.totalReports >= 7) ? "bg-red-50" : ""} hover:bg-gray-50 border-b text-gray-800`}
                      
                    >
                      <td className="px-6 py-3 text-sm font-medium flex items-center">
  {/* Handle 4-word limit */}
  <Popover
    content={<span>{feed.title}</span>}
    title="Full Title"
    trigger="hover"
  >
    <span className="cursor-pointer">
      {feed.title.split(" ").slice(0, 4).join(" ")}
      {feed.title.split(" ").length > 4 ? "..." : ""}
    </span>
  </Popover>

  {/* Report Badge */}
  {(feed.dislikesCount >= 7 || feed?.totalReports >= 7) && (
    <span className="inline-flex items-center gap-1 px-2 py-1 ml-2 rounded-full text-xs bg-red-500 text-white">
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
            current={searchValue === '' ? currentPage : pageCountForSearch}
            total={pagination?.totalFeeds || 0}
            pageSize={pageSize}
            showSizeChanger={false}
            onChange={handlePageChange}
          />
        </div>
      </motion.div>

      {/* ✅ View Feed Details Modal */}
      <Modal
  open={viewModalOpen}
  onCancel={() => setViewModalOpen(false)}
  footer={null}
  width={800}
  destroyOnHidden
>
  <FeedDetails feed={feedToView} report={report} />
</Modal>


      {/* ✅ Delete Confirmation */}
      <Modal
  open={!!feedToDelete}
  onCancel={() => setFeedToDelete(null)}
  footer={null}
  centered
  width={400}
  destroyOnHidden
>
  <h3 className="text-lg font-semibold mb-4">Delete Feed?</h3>
  <p className="text-sm text-gray-600 mb-4">
    Are you sure you want to delete this feed? This action cannot be undone.
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
</Modal>

    </>
  );
}
