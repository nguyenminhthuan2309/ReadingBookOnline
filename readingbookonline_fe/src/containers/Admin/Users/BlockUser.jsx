"use client";
import { userAPI } from "@/common/api";
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
import React, { useCallback, useEffect, useState } from "react";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useDispatch } from "react-redux";
import { changeUserStatus } from "@/utils/actions/adminAction";

function AppContainer() {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const unblockStatus = useCallback((userId) => {
    dispatch(changeUserStatus(userId, +1));
    handleCloseDialog();
    setSelectedUser(null);
  }, []);

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const getData = useCallback(async () => {
    setIsLoading(true);
    let url = userAPI.getUsers;
    url += "?status=3&role=3&limit=10";
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
        enableRowActions
        enableFullScreenToggle={false}
        enableDensityToggle={false}
        enableColumnFilters={false}
        enableHiding={false}
        positionActionsColumn="last"
        muiTablePaginationProps={{
          rowsPerPageOptions: [],
        }}
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
        renderRowActions={({ row }) => (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            <Tooltip title="Block User">
              <IconButton onClick={() => handleSelectUser(row.original)}>
                <LockOpenIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      />
      <React.Fragment>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Unblock User</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to unblock this user?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={() => unblockStatus(selectedUser.id)}>
              Unblock
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </main>
  );
}

export default AppContainer;
