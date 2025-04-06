"use client";
import { userAPI } from "@/common/api";
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
    let url = userAPI.getUsers;
    url += "?role=2&limit=10";
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
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "status.name",
      header: "Status",
    },
  ];

  return (
    <main className="text-black">
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
