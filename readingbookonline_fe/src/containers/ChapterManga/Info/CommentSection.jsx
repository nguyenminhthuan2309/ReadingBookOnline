"use client";
import React, { useCallback, useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import { useSelector } from "react-redux";
import { getItem } from "@/utils/localStorage";
import { IS_ADMIN, IS_MANAGER, USER_INFO } from "@/utils/constants";
import { Button, Pagination, Stack } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { commentAPI } from "@/common/api";
import { getAPI } from "@/utils/request";
import CommentWithoutRating from "@/components/CommentWithoutRating";

function CommentSection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chapterId = searchParams.get("name");
  const userInfo = getItem(USER_INFO);
  const { chapterData, loading } = useSelector((state) => state.infoChapter);
  const [data, setData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showInput, setShowInput] = useState(false);

  const [commentList, setCommentList] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const getComment = useCallback(async () => {
    try {
      if (!data || !data.id) return;
      let url;
      if (!currentPage) {
        url = commentAPI.getComment(data.id, 10, 1);
      } else {
        url = commentAPI.getComment(data.id, 10, currentPage);
      }
      const response = await getAPI(url);
      if (response && response.data && response.data.data) {
        const { data, totalPages, totalItems } = response.data.data;
        setCommentList(data);
        setTotalPage(totalPages);
        setTotalItems(totalItems);
      }
    } catch (error) {
      console.log(error);
    }
  }, [currentPage, data]);

  useEffect(() => {
    if (!chapterId) return;

    if (loading) return;
    if (!chapterData) {
      try {
        const response = getItem(`chapter-${chapterId}`);
        if (response) {
          const parsedData =
            typeof response === "string" ? JSON.parse(response) : response;
          if (parsedData && parsedData.book) {
            setData(parsedData);
          }
        }
      } catch (error) {
        console.error("Error reading chapter data from localStorage:", error);
      }
      return;
    }
    if (Object.keys(chapterData).length === 0) {
      return;
    }
    const data = chapterData?.data;
    setData(data);
  }, [chapterId, chapterData]);

  useEffect(() => {
    return () => {
      if (chapterId) {
        const currentData = getItem(`chapter-${chapterId}`);
        if (currentData) {
          setData(null);
        }
      }
    };
  }, [chapterId]);

  useEffect(() => {
    getComment();
  }, [getComment]);

  return (
    <div className="flex flex-col self-center mt-9 w-full max-w-[1522px] max-md:max-w-full">
      <section className="mt-20 max-md:mt-10">
        <header className="flex gap-5 justify-between ml-5 max-w-full w-[454px]">
          <div className="flex gap-5">
            <div className="flex justify-center items-center px-1.5 bg-amber-600 h-[49px] w-[49px]">
              <div className="flex shrink-0 rounded-full bg-zinc-300 h-[37px] w-[37px]" />
            </div>
            <h3 className="text-2xl leading-loose text-black">DISCUSSIONS</h3>
          </div>
          <p className="text-2xl leading-10 text-center text-black">
            {totalItems} Comment(s)
          </p>
        </header>
        <hr className="border-b border-black mt-2" />
        {!userInfo ? (
          <div className="flex justify-center items-center m-10">
            <Button
              sx={{ textTransform: "none" }}
              onClick={() => router.push("/account/sign_in")}
            >
              <p className="text-black border-b-0 hover:border-b-2 hover:border-black">
                Please login to leave a review
              </p>
            </Button>
          </div>
        ) : (
          <div className="w-full">
            {IS_ADMIN || IS_MANAGER ? (
              <div />
            ) : (
              <>
                {showInput ? (
                  <CommentWithoutRating
                    typeComment="comment"
                    id={data ? data.id : 0}
                    cancel={() => setShowInput(false)}
                  />
                ) : (
                  <div className="w-full flex justify-center">
                    <Button onClick={() => setShowInput(true)}>
                      <p className=" text-black border-b-0 hover:border-b-2 hover:border-black">
                        Leave a review
                      </p>
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
        <div className="mt-7 ml-10 flex flex-col gap-5 text-black w-full max-md:mr-2.5 max-md:max-w-full">
          {commentList &&
            commentList.map((comment, index) => (
              <CommentItem
                key={index}
                user={comment.user.name}
                comment={comment.comment}
                id={comment.id}
                userId={comment.user.id}
                avatar={comment.user.avatar}
              />
            ))}
        </div>
        <Stack spacing={2} className="flex mt-14 justify-center items-end">
          <Pagination
            sx={{
              "& .MuiPaginationItem-root": {
                fontSize: 18,
              },
            }}
            count={totalPage}
            page={currentPage ? +currentPage : 1}
            onChange={(e, value) => setCurrentPage(value)}
          />
        </Stack>
      </section>
    </div>
  );
}

export default CommentSection;
