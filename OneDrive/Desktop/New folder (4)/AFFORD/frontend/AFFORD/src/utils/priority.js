const priority = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export const getTopNotifications = (notifications, limit = 10) => {
  return notifications
    .sort((a, b) => {
     
      if (priority[b.Type] !== priority[a.Type]) {
        return priority[b.Type] - priority[a.Type];
      }

     
      return new Date(b.Timestamp) - new Date(a.Timestamp);
    })
    .slice(0, limit);
};