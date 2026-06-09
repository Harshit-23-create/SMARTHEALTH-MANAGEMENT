import {
  Card,
  CardContent,
  Typography,
  Chip,
} from "@mui/material";

function NotificationCard({
  notification,
  isRead,
  onClick,
}) {
  return (
    <Card
      onClick={onClick}
      sx={{
        mb: 2,
        cursor: "pointer",
        backgroundColor: isRead
          ? "#ffffff"
          : "#fff8e1",
      }}
    >
      <CardContent>
        <Chip
          label={notification.Type}
          color={
            notification.Type === "Placement"
              ? "success"
              : notification.Type === "Result"
              ? "primary"
              : "warning"
          }
        />

        <Typography variant="h6" sx={{ mt: 1 }}>
          {notification.Message}
        </Typography>

        <Typography variant="body2">
          {notification.Timestamp}
        </Typography>

        {!isRead && (
          <Typography
            color="error"
            sx={{ mt: 1 }}
          >
            New
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default NotificationCard;