import { useEffect, useState } from "react";
import { fetchNotifications } from "../sevices/api";
import NotificationCard from "../components/NotificationCard";

import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  Box,
} from "@mui/material";

function AllNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);

  const [readNotifications, setReadNotifications] =
    useState(
      JSON.parse(
        localStorage.getItem("readNotifications")
      ) || []
    );

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchNotifications();

      console.log("All Notifications:", data);

      setNotifications(data);
    };

    loadData();
  }, []);

  const markAsRead = (id) => {
    if (readNotifications.includes(id)) return;

    const updated = [...readNotifications, id];

    setReadNotifications(updated);

    localStorage.setItem(
      "readNotifications",
      JSON.stringify(updated)
    );
  };

  
  const filteredNotifications =
    filter === ""
      ? notifications
      : notifications.filter(
          (item) => item.Type === filter
        );

  
  const totalPages = Math.ceil(
    filteredNotifications.length / ITEMS_PER_PAGE
  );

  const startIndex = (page - 1) * ITEMS_PER_PAGE;

  const paginatedNotifications =
    filteredNotifications.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>
        All Notifications
      </h1>

      {}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel>Filter By Type</InputLabel>

          <Select
            value={filter}
            label="Filter By Type"
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="">
              All Notifications
            </MenuItem>

            <MenuItem value="Placement">
              Placement
            </MenuItem>

            <MenuItem value="Result">
              Result
            </MenuItem>

            <MenuItem value="Event">
              Event
            </MenuItem>
          </Select>
        </FormControl>
      </Box>

      {}
      <p style={{ textAlign: "center" }}>
        Total Notifications:{" "}
        {filteredNotifications.length}
      </p>

      {}
      {paginatedNotifications.map((item) => (
        <NotificationCard
          key={item.ID}
          notification={item}
          isRead={readNotifications.includes(item.ID)}
          onClick={() => markAsRead(item.ID)}
        />
      ))}

      {}
      {totalPages > 1 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            color="primary"
            onChange={(event, value) =>
              setPage(value)
            }
          />
        </Box>
      )}
    </div>
  );
}

export default AllNotifications;