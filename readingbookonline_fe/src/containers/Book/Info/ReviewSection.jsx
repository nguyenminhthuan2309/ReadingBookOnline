"use client";
import React, { useCallback, useEffect, useState } from "react";
import CommentItem from "./CommentItem";
import { useSelector } from "react-redux";
import { getItem } from "@/utils/localStorage";
import { USER_INFO } from "@/utils/constants";
import { Button, Pagination, Stack } from "@mui/material";
import { useRouter } from "next/router";
import { reviewAPI } from "@/common/api";
import { getAPI } from "@/utils/request";
import SpoilerEditor from "@/components/CommentWithSpoilerTag";

function ReviewSection() {
  const router = useRouter();
  const userInfo = getItem(USER_INFO);
  const { bookData } = useSelector((state) => state.bookInfo);
  const [currentPage, setCurrentPage] = useState(1);
  const [showInput, setShowInput] = useState(false);

  const [reviewList, setReviewList] = useState([]);
  const [totalPage, setTotalPage] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const getReview = useCallback(async () => {
    try {
      if (!bookData || !bookData.id) return;
      let url;
      if (!currentPage) {
        url = reviewAPI.getReview(bookData.id, 10, 1);
      } else {
        url = reviewAPI.getReview(bookData.id, 10, currentPage);
      }
      const response = await getAPI(url);
      if (response && response.data && response.data.data) {
        const { data, totalPages, totalItems } = response.data.data;
        setReviewList(data);
        setTotalPage(totalPages);
        setTotalItems(totalItems);
      }
    } catch (error) {
      console.log(error);
    }
  }, [currentPage, bookData]);

  useEffect(() => {
    getReview();
  }, [getReview]);

  return (
    <section className="mt-20 max-md:mt-10">
      <header className="flex gap-5 justify-between ml-5 max-w-full w-[454px]">
        <div className="flex gap-5">
          <div className="flex justify-center items-center px-1.5 bg-amber-600 h-[49px] w-[49px]">
            <div className="flex shrink-0 rounded-full bg-zinc-300 h-[37px] w-[37px]" />
          </div>
          <h3 className="text-2xl leading-loose text-black">REVIEWS</h3>
        </div>
        <p className="text-2xl leading-10 text-center text-black">
          {totalItems} Review(s)
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
          {showInput ? (
            <SpoilerEditor
              typeComment="review"
              id={bookData ? bookData.id : 0}
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
        </div>
      )}
      {/* <div className="flex gap-5 justify-baseline mt-11 text-lg max-md:mt-10">
        <button className="text-amber-400 underline">Upvote</button>
        <button className="text-stone-400">Newest</button>
        <button className="text-stone-400">Oldest</button>
      </div> */}

      <div className="mt-7 ml-10 flex flex-col gap-5 text-black w-full max-md:mr-2.5 max-md:max-w-full">
        {reviewList &&
          reviewList.map((comment, index) => (
            <CommentItem
              key={index}
              user={comment.user.name}
              comment={comment.comment}
              rating={comment.rating}
              id={comment.id}
              userId={comment.user.id}
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
  );
}

export default ReviewSection;
