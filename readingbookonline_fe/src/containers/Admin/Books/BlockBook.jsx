/* eslint-disable react/prop-types */
"use client";
import React, { useCallback, useEffect, useState } from "react";

import { bookAPI } from "@/common/api";
import { getAPI } from "@/utils/request";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";

import { MaterialReactTable } from "material-react-table";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useDispatch } from "react-redux";
import { changeBookStatus } from "@/utils/actions/adminAction";

function AppContainer() {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const [selectedBook, setSelectedBook] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBook(null);
  };

  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setOpenDialog(true);
  };

  const getData = useCallback(async () => {
    setIsLoading(true);
    let url = bookAPI.getBook(pageSize, currentPage + 1);
    url += "&accessStatusId=3";
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
  }, [currentPage, pageSize]);

  const unblockStatus = useCallback(
    async (bookId) => {
      await dispatch(changeBookStatus(bookId, +1));
      await getData();
      handleCloseDialog();
      setSelectedBook(null);
    },
    [dispatch, getData]
  );

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
        enableRowActions
        positionActionsColumn="last"
        enableFullScreenToggle={false}
        enableDensityToggle={false}
        enableColumnFilters={false}
        enableHiding={false}
        rowCount={totalItems}
        pageCount={totalPages}
        onPaginationChange={(updater) => {
          const newPagination =
            typeof updater === "function"
              ? updater({ pageIndex: currentPage, pageSize })
              : updater;
          setCurrentPage(newPagination.pageIndex);
          setPageSize(newPagination.pageSize);
        }}
        state={{
          isLoading,
          pagination: {
            pageIndex: currentPage,
            pageSize,
          },
        }}
        initialState={{
          pagination: {
            pageIndex: 0,
            pageSize: 10,
          },
        }}
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip title="Block Book">
              <IconButton onClick={() => handleSelectBook(row.original)}>
                <LockOpenIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Unblock Book</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to unblock {selectedBook?.title}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={() => unblockStatus(selectedBook.id)}>
            Unblock
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}

export default AppContainer;
