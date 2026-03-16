import React, { useState } from "react";
import { Drawer, IconButton } from "@mui/material";
import { logo } from "../customer/json/common";
import { useNavigate } from "react-router-dom";
import { Menu } from "@mui/icons-material";

const Navbar = ({ DrawerList }) => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const toggleDrawer = (newOpen) => {
    setOpen(newOpen);
  };
  return (
    <div className="h-10 flex items-center px-5 border-b">
      <div className="flex items-center gap-5">
        <IconButton className="lg:-left-20" onClick={() => toggleDrawer(true)} color="primary">
          <Menu color="primary"  />
        </IconButton>
          <h1 onClick={()=>navigate("/")} className="logo text-xl cursor-pointer ">{logo.name}</h1>
      </div>
      <Drawer open={open} onClose={()=>toggleDrawer(false)}>
        <DrawerList toggleDrawer={toggleDrawer} />
      </Drawer>
    </div>
  );
};

export default Navbar;
