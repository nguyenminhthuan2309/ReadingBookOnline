import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  Paper,
  Container,
} from "@mui/material";

import { userAPI } from "@/common/api";
import { getAPI } from "@/utils/request";
import moment from "moment";
import { useRouter } from "next/router";

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const getData = useCallback(async () => {
    const url = userAPI.getRecentlyRead(limit, page);
    try {
      const response = await getAPI(url);
      if (response.status === 200) {
        const { data, totalItems, totalPages } = response.data.data;
        setHistory(data);
        setTotalItems(totalItems);
        setTotalPages(totalPages);
      }
    } catch (error) {
      console.log(error);
    }
  }, [limit, page]);

  const handleRedirect = useCallback(
    (bookTypeID, chapterId) => {
      if (bookTypeID === 1) {
        router.push(`/chapter?name=${chapterId}`);
      } else {
        router.push(`/chapter-manga?name=${chapterId}`);
      }
    },
    [router]
  );

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{ bgcolor: "#ffffff", color: "black", p: 3, borderRadius: 2 }}
      >
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <List sx={{ width: "100%", p: 0 }}>
            {history.map((item, index) => (
              <React.Fragment key={item.id}>
                <ListItem
                  sx={{
                    py: 1.5,
                    px: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.05)",
                    },
                  }}
                >
                  {/* Time */}
                  <Typography
                    variant="body2"
                    sx={{ width: "70px", color: "text.secondary" }}
                  >
                    {moment(item.createdAt).format("HH:mm DD/MM/YYYY")}
                  </Typography>

                  {/* Title and URL */}
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                      {item.book.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {item.book.author?.name}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                      {item.chapter.title}
                    </Typography>
                  </Box>

                </ListItem>
                {index < history.length - 1 && (
                  <Divider
                    variant="fullWidth"
                    sx={{ bgcolor: "rgba(255, 255, 255, 0.1)" }}
                  />
                )}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Paper>
    </Container>
  );
}
