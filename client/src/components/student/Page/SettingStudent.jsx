import React, { useContext, useState } from "react";
import axios from "axios";
import "../style/setting.css";
import { authcontext } from "../../../context/Authcontext";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import {useNavigate} from 'react-router-dom'

const SettingStudent = () => {
  const { url } = useContext(authcontext);
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate()

  const [preview, setPreview] = useState(null);
  const { register, handleSubmit } = useForm({
    defaultValues: {
      fullname: user.fullname,
      email: user.email,
    },
  });

  // 🔥 IMAGE SAVE
  const saveImage = async (data) => {
  const toastId = toast.loading("Uploading image...");
  try {
    const formData = new FormData();
    if (data.image?.[0]) {
      formData.append("image", data.image[0]);
    }

    const res = await axios.put(
      `${url}/api/admin/updateUser/${user._id}`,
      formData,
      { withCredentials: true }
    );

    localStorage.setItem("user", JSON.stringify(res.data.updatedUser));
    toast.success("Profile image updated", { id: toastId });
    navigate('/student/dashboard')
  } catch {
    toast.error("Image update failed", { id: toastId });
  }
};


  // 🔥 NAME SAVE
  const saveName = async (data) => {
  const toastId = toast.loading("Updating name...");
  try {
    const res = await axios.put(
      `${url}/api/admin/updateUser/${user._id}`,
      { fullname: data.fullname },
      { withCredentials: true }
    );

    localStorage.setItem("user", JSON.stringify(res.data.updatedUser));
    toast.success("Name updated", { id: toastId });
    navigate('/student/dashboard')
  } catch {
    toast.error("Failed to update name", { id: toastId });
  }
};


  // 🔥 EMAIL SAVE
  const saveEmail = async (data) => {
  const toastId = toast.loading("Updating email...");
  try {
    const res = await axios.put(
      `${url}/api/admin/updateUser/${user._id}`,
      { email: data.email },
      { withCredentials: true }
    );

    localStorage.setItem("user", JSON.stringify(res.data.updatedUser));
    toast.success("Email updated", { id: toastId });
    navigate('/student/dashboard')
    
  } catch {
    toast.error("Failed to update email", { id: toastId });
  }
};


  return (
    <div className="settings-page">
      <div className="settings-container">

        {/* 🔵 PROFILE IMAGE */}
        <div className="settings-card">
          <h3>Profile Image</h3>
          <p className="hint">Upload your profile picture</p>

          <form onSubmit={handleSubmit(saveImage)}>
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <img
                src={preview || user.image || "https://via.placeholder.com/100"}
                alt="profile"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />

              <input
                type="file"
                accept="image/*"
                {...register("image")}
                onChange={(e) =>
                  setPreview(URL.createObjectURL(e.target.files[0]))
                }
              />
            </div>

            <button className="btn-save">Save</button>
          </form>
        </div>

        {/* 🔵 NAME */}
        <div className="settings-card">
          <h3>Name</h3>
          <p className="hint">Please enter your full name or display name.</p>

          <form onSubmit={handleSubmit(saveName)}>
            <input type="text" {...register("fullname")} />
            <button className="btn-save">Save</button>
          </form>
        </div>

        {/* 🔵 EMAIL */}
        <div className="settings-card">
          <h3>Email</h3>
          <p className="hint">Enter the email address you want to use to log in.</p>

          <form onSubmit={handleSubmit(saveEmail)}>
            <input type="email" {...register("email")} />
            <button className="btn-save">Save</button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default SettingStudent;
