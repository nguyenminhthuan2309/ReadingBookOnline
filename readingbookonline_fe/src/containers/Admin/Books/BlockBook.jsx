"use client";
import { bookAPI } from "@/common/api";
import { getAPI } from "@/utils/request";
import { MaterialReactTable } from "material-react-table";
import React, { useCallback, useEffect, useState } from "react";

function AppContainer() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);    

  const getData = useCallback(async () => {
    setIsLoading(true);
    let url = bookAPI.getBook(20, 1);
    url += "&sortBy=updatedAt&sortType=DESC&accessStatusId=3";
    if (currentPage) {
      url += `&page=${currentPage}`;
    }
    try {
      const response = await getAPI(url);
      const { data, totalPages, totalItems } = response.data.data;
      setData(data);
      setTotalPages(totalPages);
      setTotalItems(totalItems);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    getData();
  }, [getData]);

  const columns = [
    {
      accessorKey: "cover",
      header: "Cover",
      Cell: ({ cell }) => (
        <img
          src={cell.getValue()}
          alt="Book cover"
          style={{
            width: "70px",
            height: "90px",
            objectFit: "cover",
            borderRadius: "4px",
          }}
        />
      ),
    },
    {
      accessorKey: "title",
      header: "Book",
    },
    {
      accessorKey: "author.name",
      header: "Author",
    },
    {
      accessorKey: "progressStatus.name",
      header: "Status",
    },
  ];

  return (
    <main className="text-black max-h-[70vh] overflow-y-auto">
      <MaterialReactTable
        columns={columns}
        data={data}
        enablePagination
        manualPagination
        rowCount={totalItems}
        pageCount={totalPages}
        onPaginationChange={({ pageIndex }) => {
          setCurrentPage(pageIndex);
        }}
        state={{
          isLoading,
          pagination: {
            pageIndex: currentPage,
            pageSize: 10,
          },
        }}
      />
    </main>
  );
}

export default AppContainer;
