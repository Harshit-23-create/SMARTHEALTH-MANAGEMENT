import { AppBar, Toolbar, Button } from "@mui/material";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} to="/">
          Priority Inbox
        </Button>

        <Button color="inherit" component={Link} to="/notifications">
          All Notifications
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;