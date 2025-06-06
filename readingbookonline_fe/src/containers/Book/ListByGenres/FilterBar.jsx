import React, { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

import PropTypes from "prop-types";

import { IconButton, Tab, Tabs } from "@mui/material";

import SwapVertIcon from "@mui/icons-material/SwapVert";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const FilterBar = ({ itemLength }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sortBy = searchParams.get("sortBy");
  const sortType = searchParams.get("sortType");
  const [sortTypeValue, setSortTypeValue] = useState(sortType === "DESC");

  const handleChangeSortBy = useCallback(
    (value) => {
      if (value === sortBy) {
        const { sortBy, ...restQuery } = router.query;
        router.push(
          {
            pathname: router.pathname,
            query: restQuery,
          },
          undefined,
          { shallow: true }
        );
        return;
      }
      const query = {
        ...router.query,
        sortBy: value,
      };

      router.push(
        {
          pathname: router.pathname,
          query,
        },
        undefined,
        { shallow: true }
      );
    },
    [router, sortBy]
  );

  const handleSortTypeChange = useCallback((e) => {
    e.stopPropagation();
    setSortTypeValue((prev) =>
      prev === null ? "DESC" : prev === "DESC" ? "ASC" : null
    );
  }, []);

  // Handle URL updates in a debounced useEffect
  useEffect(() => {
    if (!router.isReady) return;

    const query = { ...router.query };

    if (sortTypeValue) {
      query.sortType = sortTypeValue;
    } else {
      delete query.sortType;
    }

    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { shallow: true }
    );
  }, [sortTypeValue, router.isReady]); // Add router.isReady to prevent premature updates

  // Optional: Sync with URL on mount and route changes
  useEffect(() => {
    if (router.isReady && router.query.sortType !== sortTypeValue) {
      setSortTypeValue(router.query.sortType || null);
    }
  }, [router.query.sortType, router.isReady]);

  return (
    <div className="flex flex-wrap gap-5 justify-between mt-12 w-full max-md:mt-10 max-md:max-w-full">
      <div className="flex gap-5">
        <div className="flex flex-col justify-center items-center px-1.5 bg-amber-600 h-[49px] w-[49px]">
          <div className="flex shrink-0 rounded-full bg-zinc-300 h-[37px] w-[37px]" />
        </div>
        <p className="self-start text-2xl leading-loose text-black basis-auto">
          {itemLength} Result(s)
        </p>
        <IconButton onClick={handleSortTypeChange}>
          {sortTypeValue === "DESC" && <ArrowDownwardIcon />}
          {sortTypeValue === "ASC" && <ArrowUpwardIcon />}
          {sortTypeValue === null && <SwapVertIcon />}
        </IconButton>
      </div>
      <div className="flex flex-wrap gap-10 justify-between items-center self-start text-xl leading-10 text-stone-400 max-md:max-w-full">
        <span className="self-stretch my-auto text-black">Order by:</span>
        <Tabs
          value={sortBy || false}
          sx={{
            "& .Mui-selected": { color: "black", opacity: 1 },
            "& .MuiTabs-indicator": { display: "none" },
          }}
          centered
        >
          <Tab
            label="Latest"
            sx={{
              color: "semi-black",
              opacity: 0.5,
              textTransform: "none",
              fontSize: "18px",
            }}
            value="updatedAt"
            onClick={() => handleChangeSortBy("updatedAt")}
          />
          <Tab
            label="A-Z"
            sx={{
              color: "semi-black",
              opacity: 0.5,
              textTransform: "none",
              fontSize: "18px",
            }}
            value="title"
            onClick={() => handleChangeSortBy("title")}
          />
          <Tab
            label="Most Views"
            sx={{
              color: "semi-black",
              opacity: 0.5,
              textTransform: "none",
              fontSize: "18px",
            }}
            value="views"
            onClick={() => handleChangeSortBy("views")}
          />
        </Tabs>
      </div>
    </div>
  );
};

FilterBar.propTypes = {
  itemLength: PropTypes.number,
};
export default FilterBar;
