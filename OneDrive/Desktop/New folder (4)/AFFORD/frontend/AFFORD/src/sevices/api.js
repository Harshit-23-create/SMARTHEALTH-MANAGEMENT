import axios from "axios";

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJoYXJzaGl0LjIzYjE1MzEwMzlAYWJlcy5hYy5pbiIsImV4cCI6MTc4MDk5MDEzMywiaWF0IjoxNzgwOTg5MjMzLCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNGUyMGJiNzQtZGI4Yy00YzQzLTgxZjQtMzQzMzIxYTViNWYzIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoiaGFyc2hpdCBzb25pIiwic3ViIjoiYTk2ZTJjNDMtMjU5My00OWVjLTllNjktMTg0OTk0MzAxNDJhIn0sImVtYWlsIjoiaGFyc2hpdC4yM2IxNTMxMDM5QGFiZXMuYWMuaW4iLCJuYW1lIjoiaGFyc2hpdCBzb25pIiwicm9sbE5vIjoiMjMwMDMyMTUzMDA4OCIsImFjY2Vzc0NvZGUiOiJjWHVxaHQiLCJjbGllbnRJRCI6ImE5NmUyYzQzLTI1OTMtNDllYy05ZTY5LTE4NDk5NDMwMTQyYSIsImNsaWVudFNlY3JldCI6InhEbmR6bVJzV1JDeWNudEEifQ.5ySIRAS8bFHu_pOYkeUGGr6cT7KS7_1fOx5CbukJMGk";

const API_URL =
  "http://4.224.186.213/evaluation-service/notifications";

export const fetchNotifications = async () => {
  try {
   

    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    });

   

    return response.data.notifications || [];
  } catch (error) {
    console.error("Error fetching notifications:");

    

    return [];
  }
};