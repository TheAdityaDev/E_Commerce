import { Edit } from "@mui/icons-material";
import { Avatar, Button } from "@mui/material";
import React from "react";
import ProfileFiledCard from "../../customer/pages/account/ProfileFiledCard";

const Profile = () => {
  return (
    <div className="lg:px-20 pt-5 pb-20 space-y-20">
      <div className="w-full lg:w-[70%]">
        <div className="flex items-center pb-3 justify-between">
          <h1>Personal Details</h1>
          <div className="">
            <Button className="w-13 h-13 rounded-full" variant="contained">
              <Edit />
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <Avatar
            sx={{ height: "10rem", width: "10rem" }}
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT8V4AsFc60ZjGW9hwMjQnzjSWmPwn93IjmrT6jEku_JxIZbUj4fZ2kmBmkkW-dkm8EbWVXVg6fYgkJsaZ4Eav4&s&ec=121528423"
            className=""
          />
        </div>
        <ProfileFiledCard keys="Name" value="Aditya" />
        <ProfileFiledCard keys="Email" value="Aditya@gmail.com" />
        <ProfileFiledCard keys="Phone No" value="12345668789" />
      </div>
    </div>
  );
};

export default Profile;
