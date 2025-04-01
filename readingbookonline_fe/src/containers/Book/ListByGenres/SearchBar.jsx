import React, { useCallback, useState } from "react";

import { IconButton } from "@mui/material";
import { useSearchParams } from "next/navigation";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";

const SearchBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const param = searchParams.get("search");
  const [search, setSearch] = useState(param);

  const handleSearch = useCallback(
    (value) => {
      if (!router.isReady) return;
      const query = { ...router.query };
      if (value) {
        query.search = value;
      } else {
        delete query.search;
      }

      router.push(
        {
          pathname: router.pathname,
          query,
        },
        undefined,
        { shallow: true }
      );
    },
    [router.isReady]
  );

  return (
    <div className="flex flex-wrap gap-5 justify-between items-start self-center px-7 py-3.5 max-w-full text-3xl bg-white rounded-xl text-slate-800 w-[1087px] max-md:px-5">
      <input
        type="text"
        placeholder="SEARCH . . ."
        className="bg-transparent outline-none flex-1"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <IconButton onClick={() => handleSearch(search)}>
        <SearchIcon />
      </IconButton>
    </div>
  );
};

export default SearchBar;
