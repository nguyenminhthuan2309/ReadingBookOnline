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
import BlockIcon from "@mui/icons-material/Block";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LockOpenIcon from "@mui/icons-material/LockOpen";

import { useDispatch } from "react-redux";
import { changeBookStatus } from "@/utils/actions/adminAction";
import { useRouter } from "next/navigation";

function AppContainer() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  const [selectedBook, setSelectedBook] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openPendingDialog, setOpenPendingDialog] = useState(false);
  const [openApproveDialog, setOpenApproveDialog] = useState(false);

  const handleCloseApproveDialog = () => {
    setOpenApproveDialog(false);
    setSelectedBook(null);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBook(null);
  };

  const handleClosePendingDialog = () => {
    setOpenPendingDialog(false);
    setSelectedBook(null);
  };

  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setOpenDialog(true);
  };

  const handleSelectPendingBook = (book) => {
    setSelectedBook(book);
    setOpenPendingDialog(true);
  };

  const handleSelectApproveBook = (book) => {
    setSelectedBook(book);
    setOpenApproveDialog(true);
  };

  const getData = useCallback(async () => {
    setIsLoading(true);
    let url = bookAPI.getBook(pageSize, currentPage + 1);
    url += "&accessStatusId=1&&accessStatusId=4";
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

  const blockStatus = useCallback(
    async (bookId) => {
      await dispatch(changeBookStatus(bookId, +3));
      await getData();
      handleCloseDialog();
      setSelectedBook(null);
    },
    [dispatch, getData]
  );

  const pendingStatus = useCallback(
    async (bookId) => {
      await dispatch(changeBookStatus(bookId, +4));
      await getData();
      handleClosePendingDialog();
      setSelectedBook(null);
    },
    [dispatch, getData]
  );

  const approveStatus = useCallback(
    async (bookId) => {
      await dispatch(changeBookStatus(bookId, +1));
      await getData();
      handleCloseApproveDialog();
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
    {
      accessorKey: "accessStatus.name",
      header: "Access Status",
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
        muiTableBodyRowProps={({ row }) => ({
          onClick: () => {
            router.push(`/book?number=${row.original?.id}`);
          },
          sx: {
            cursor: "pointer",
            backgroundColor:
              row.original?.accessStatus?.id !== 1 ? "#ffebee" : "inherit",
            "&:hover": {
              backgroundColor:
                row.original?.accessStatus?.id !== 1 ? "#ffcdd2" : "#f5f5f5",
            },
          },
        })}
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
          <Box sx={{ display: "flex", gap: "1rem", justifySelf: "start" }}>
            {row.original.accessStatus.id !== 1 ? (
              <Tooltip title="Approve Book">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectApproveBook(row.original);
                  }}
                >
                  <LockOpenIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Pending Book">
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPendingBook(row.original);
                  }}
                >
                  <AccessTimeIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Block Book">
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectBook(row.original);
                }}
              >
                <BlockIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />
      <React.Fragment>
        <Dialog open={openApproveDialog} onClose={handleCloseApproveDialog}>
          <DialogTitle>Approve Book</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to approve {selectedBook?.title}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseApproveDialog}>Cancel</Button>
            <Button onClick={() => approveStatus(selectedBook.id)}>
              Approve
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openPendingDialog} onClose={handleClosePendingDialog}>
          <DialogTitle>Pending Book</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to pending {selectedBook?.title}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClosePendingDialog}>Cancel</Button>
            <Button onClick={() => pendingStatus(selectedBook.id)}>
              Pending
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Block Book</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to block {selectedBook?.title}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={() => blockStatus(selectedBook.id)}>Block</Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </main>
  );
}

export default AppContainer;
