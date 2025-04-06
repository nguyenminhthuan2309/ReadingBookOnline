"use client";
import { userAPI } from "@/common/api";
import { getAPI } from "@/utils/request";
import { Button } from "@mui/material";
import { MaterialReactTable } from "material-react-table";
import React, { useCallback, useEffect, useState } from "react";
import CreateManagerDialog from "./CreateManagerDialog";
import { useSelector } from "react-redux";

function AppContainer() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [openCreateManagerDialog, setOpenCreateManagerDialog] = useState(false);

    const loading = useSelector((state) => state.createManager.loading);

  const getData = useCallback(async () => {
    setIsLoading(true);
    let url = userAPI.getUsers;
    url += "?status=1&role=2&limit=10";
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

  const handleCloseCreateManagerDialog = () => {
    setOpenCreateManagerDialog(false);
  };

  return (
    <main className="text-black">
      <MaterialReactTable
        columns={columns}
        data={data}
        enablePagination
        manualPagination
        rowCount={totalItems}
        pageCount={totalPages}
        enableFullScreenToggle={false}
        enableDensityToggle={false}
        enableColumnFilters={false}
        enableHiding={false}
        onPaginationChange={({ pageIndex }) => {
          setCurrentPage(pageIndex);
        }}
        renderTopToolbarCustomActions={() => (
          <Button
            variant="contained"
            sx={{ backgroundColor: "#FFAF98" }}
            onClick={() => setOpenCreateManagerDialog(true)}
          >
            Create New Manager
          </Button>
        )}
        state={{
          isLoading: isLoading || loading,
          pagination: {
            pageIndex: currentPage,
            pageSize: 10,
          },
        }}
      />

      <React.Fragment>
        <CreateManagerDialog
          open={openCreateManagerDialog}
          handleClose={handleCloseCreateManagerDialog}
        />
      </React.Fragment>
    </main>
  );
}

export default AppContainer;
