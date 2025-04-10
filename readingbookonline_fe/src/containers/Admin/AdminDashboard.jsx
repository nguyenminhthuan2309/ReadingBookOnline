"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";

import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import BlockIcon from "@mui/icons-material/Block";

// import NotificationsIcon from "@mui/icons-material/Notifications";
import BarChartIcon from "@mui/icons-material/BarChart";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

import Users from "./Users";
import Manager from "./Manager";
import BookTable from "./Books";
import BlockBook from "./Books/BlockBook";
import BlockUser from "./Users/BlockUser";
import Statistical from "./Statistic";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { IS_ADMIN } from "@/utils/constants";

const tabs = [
  {
    id: "account",
    label: "Account",
    icon: <AdminPanelSettingsIcon />,
    subTabs: [
      { id: "user", label: "User", icon: <PersonIcon /> },
      ...(IS_ADMIN
        ? [{ id: "manager", label: "Manager", icon: <SupervisorAccountIcon /> }]
        : []),
    ],
  },
  { id: "book", label: "Book", icon: <MenuBookIcon /> },
  {
    id: "blocked-list",
    label: "Blocked list",
    icon: <BlockIcon />,
    subTabs: [
      { id: "blocked-user", label: "User", icon: <PersonIcon /> },
      ...(IS_ADMIN
        ? [
            {
              id: "blocked-manager",
              label: "Manager",
              icon: <SupervisorAccountIcon />,
            },
          ]
        : []),
      { id: "blocked-book", label: "Book", icon: <MenuBookIcon /> },
    ],
  },
  // { id: "notices", label: "Notices", icon: <NotificationsIcon /> },
  { id: "statistical", label: "Statistical", icon: <BarChartIcon /> },
];

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#f8a9a0",
    },
    secondary: {
      main: "#4a4173",
    },
    error: {
      main: "#d32f2f",
    },
    warning: {
      main: "#f9a825",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
  },
});

function AdminDashboard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  const [activeTab, setActiveTab] = useState("account");
  const [activeSubTab, setActiveSubTab] = useState("user");
  const [expandedTabs, setExpandedTabs] = useState(["account"]);

  const drawerWidth = 240;

  const updateURL = (tabID, subTabID = "") => {
    const query = new URLSearchParams();
    query.set("tab", tabID);
    if (subTabID) query.set("subTab", subTabID);
    router.replace(`?${query.toString()}`, undefined, { scroll: false });
  };
  // Toggle expanded state for tabs with subtabs
  const toggleExpand = (tabId) => {
    if (expandedTabs.includes(tabId)) {
      setExpandedTabs(expandedTabs.filter((id) => id !== tabId));
    } else {
      setExpandedTabs([...expandedTabs, tabId]);
    }
  };

  // Handle tab click
  const handleTabClick = (tabId, hasSubTabs) => {
    setActiveTab(tabId);

    // If tab has subtabs, expand it and select first subtab
    if (hasSubTabs) {
      if (!expandedTabs.includes(tabId)) {
        setExpandedTabs([...expandedTabs, tabId]);
      }

      // Find the tab and get its first subtab
      const tab = tabs.find((t) => t.id === tabId);
      if (tab && tab.subTabs && tab.subTabs.length > 0) {
        const firstSubTab = tab.subTabs[0].id || "";
        setActiveSubTab(firstSubTab);
        updateURL(tabId, firstSubTab);
      }
    } else {
      // Reset active subtab if main tab doesn't have subtabs
      setActiveSubTab("");
      updateURL(tabId);
    }
  };

  // Handle subtab click
  const handleSubTabClick = (parentTabId, subTabId) => {
    setActiveTab(parentTabId);
    setActiveSubTab(subTabId);
    updateURL(parentTabId, subTabId);

    // Ensure the parent tab is expanded
    if (!expandedTabs.includes(parentTabId)) {
      setExpandedTabs([...expandedTabs, parentTabId]);
    }
  };

  // Get the current page title based on active tab and subtab
  const getPageTitle = () => {
    // Find the active main tab
    const tab = tabs.find((t) => t.id === activeTab);
    if (!tab) return "Dashboard";

    // If there's an active subtab, find it
    if (activeSubTab && tab.subTabs) {
      const subtab = tab.subTabs.find((st) => st.id === activeSubTab);
      if (subtab) {
        return `${tab.label} - ${subtab.label}`;
      }
    }

    return tab.label;
  };

  // Only run client-side effects after mounting
  useEffect(() => {
    setMounted(true);
    const tabFromURL = searchParams.get("tab");
    const subTabFromURL = searchParams.get("subTab");

    if (tabFromURL) {
      setActiveTab(tabFromURL);
      if (subTabFromURL) {
        setActiveSubTab(subTabFromURL);
      } else {
        setActiveSubTab("");
      }
    }
  }, [searchParams]);

  // Don't render anything until after mounting to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
        {/* Sidebar Navigation */}
        <Box
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            bgcolor: "#3F3D6E",
            color: "white",
            height: "80vh",
            display: "flex",
            flexDirection: "column",
            overflow: "auto",
          }}
        >
          <List disablePadding sx={{ flexGrow: 1 }}>
            {tabs.map((tab) => (
              <Box key={tab.id}>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={
                      activeTab === tab.id && (!tab.subTabs || !activeSubTab)
                    }
                    onClick={() =>
                      tab.subTabs
                        ? toggleExpand(tab.id)
                        : handleTabClick(tab.id, !!tab.subTabs)
                    }
                    sx={{
                      py: 2,
                      "&.Mui-selected": {
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                      },
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                      {tab.icon}
                    </ListItemIcon>
                    <ListItemText primary={tab.label} />
                    {tab.subTabs &&
                      (expandedTabs.includes(tab.id) ? (
                        <ExpandLessIcon />
                      ) : (
                        <ExpandMoreIcon />
                      ))}
                  </ListItemButton>
                </ListItem>

                {/* Subtabs */}
                {expandedTabs.includes(tab.id) && tab.subTabs && (
                  <Collapse
                    in={expandedTabs.includes(tab.id)}
                    timeout="auto"
                    unmountOnExit
                  >
                    <List component="div" disablePadding>
                      {tab.subTabs.map((subtab) => (
                        <ListItemButton
                          key={subtab.id}
                          selected={activeSubTab === subtab.id}
                          onClick={() => {
                            handleTabClick(tab.id, true);
                            handleSubTabClick(tab.id, subtab.id);
                          }}
                          sx={{
                            pl: 4,
                            py: 1.5,
                            "&.Mui-selected": {
                              bgcolor: "rgba(255, 255, 255, 0.1)",
                            },
                            "&:hover": {
                              bgcolor: "rgba(255, 255, 255, 0.1)",
                            },
                          }}
                        >
                          <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                            {subtab.icon}
                          </ListItemIcon>
                          <ListItemText primary={subtab.label} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
              </Box>
            ))}
          </List>
          <Box sx={{ p: 2, textAlign: "center" }}>
            <Typography variant="caption" color="rgba(255, 255, 255, 0.7)">
              v0.0.0
            </Typography>
          </Box>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: "100%",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Page Title */}
          <Typography
            variant="h5"
            component="h1"
            sx={{
              p: 2,
              borderBottom: "1px solid",
              borderColor: "divider",
              color: "black",
            }}
          >
            {getPageTitle()}
          </Typography>

          {/* Content Area */}
          <Box sx={{ p: 3, flexGrow: 1, overflow: "auto" }}>
            {activeTab === "account" && activeSubTab === "user" && <Users />}
            {activeTab === "account" && activeSubTab === "manager" && (
              <Manager />
            )}
            {activeTab === "book" && <BookTable />}
            {activeTab === "blocked-list" &&
              activeSubTab === "blocked-book" && <BlockBook />}
            {activeTab === "blocked-list" &&
              activeSubTab === "blocked-user" && <BlockUser />}
            {activeTab === "statistical" && <Statistical />}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default AdminDashboard;
