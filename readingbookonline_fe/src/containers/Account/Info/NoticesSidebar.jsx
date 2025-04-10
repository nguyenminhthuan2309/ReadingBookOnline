import { userAPI } from "@/common/api";
import { getAPI } from "@/utils/request";
import { useSocketContext } from "@/utils/SocketContext";
import { Pagination } from "@mui/material";
import { Stack } from "@mui/system";
import moment from "moment";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";

const NoticesSidebar = () => {
  const { socket, isConnected } = useSocketContext();
  const [notices, setNotices] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

  const highlightNotice = useCallback((notice) => {
    return notice.split(/(Pending:|Block:)/g).map((part, index) => {
      switch (part) {
        case "Pending:":
          return (
            <span key={index} className="text-yellow-500 font-bold">
              {part}
            </span>
          );
        case "Block:":
          return (
            <span key={index} className="text-red-500 font-bold">
              {part}
            </span>
          );
        default:
          return part;
      }
    });
  }, []);

  const getNotifications = useCallback(async () => {
    try {
      const response = await getAPI(userAPI.getNotifications(10, page));
      if (response.status === 200) {
        const { data, totalPages } = response.data.data;
        setNotices(data);
        setTotalPages(totalPages);
      }
    } catch (error) {
      console.log(error);
    }
  }, [page]);

  // Only fetch notifications when page changes
  useEffect(() => {
    getNotifications();
  }, [getNotifications]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewChapter = (data) => {
      console.log("📘 New chapter:", data);
    };

    const handleBookStatus = (data) => {
      console.log("📕 Book status:", data);
      // Refresh notifications only when we receive a book status update
      getNotifications();
    };

    socket.on("new-chapter", handleNewChapter);
    socket.on("book-status", handleBookStatus);

    return () => {
      socket.off("new-chapter", handleNewChapter);
      socket.off("book-status", handleBookStatus);
    };
  }, [socket, isConnected]);

  return (
    <aside className="w-[24%] max-md:ml-0 max-md:w-full">
      <div className="flex flex-col grow px-5 pt-11 pb-6 w-full h-[65vh] text-black bg-[#FFDFCA] rounded-xl border-4 border-amber-600 border-solid max-md:mt-8">
        <div className="flex items-center justify-between">
          <h2 className="self-center text-2xl text-center">NOTICES</h2>
          <div
            className={`w-3 h-3 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
            title={isConnected ? "Connected" : "Disconnected"}
          />
        </div>
        <hr className="shrink-0 mt-5 mr-3 ml-3.5 max-w-full h-px border border-black border-solid w-[296px] max-md:mx-2.5" />
        <p className="px-3.5 pt-8 mt-10 text-lg bg-white rounded-xl min-h-[400px] overflow-y-auto max-md:pr-5 max-md:pb-28 max-md:mt-10">
          {!isConnected ? (
            <span className="text-red-500">
              Connection lost. Please check your network or server status.
            </span>
          ) : (
            <>
              {notices.map((notice) => (
                <div key={notice.id}>
                  <span className="text-sm">
                    - {highlightNotice(notice.message)}
                  </span>
                  <span className="text-sm text-gray-500 italic">
                    {" "}
                    {moment(notice.createdAt).format("DD/MM/YYYY hh:mm")}
                  </span>
                </div>
              ))}

              <Stack className="mt-5 justify-center items-center">
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={(event, value) => setPage(value)}
                />
              </Stack>
            </>
          )}
        </p>
      </div>
    </aside>
  );
};

NoticesSidebar.propTypes = {
  userInfo: PropTypes.object.isRequired,
};

export default NoticesSidebar;
