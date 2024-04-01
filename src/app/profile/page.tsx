"use client";

import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Trocchi } from "next/font/google";

export default function ProfilePage() {
  const router = useRouter();

  const [userData, setUserData] = useState("nothing");

  const getUserDetails = async () => {
    try {
      const response = await axios.post("/api/users/me");
      console.log(response.data);
      setUserData(response.data.data._id);
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("logout successfully");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-h-screen py-2">
      <h1>Profile page</h1>
      <hr />
      <h2>
        {userData === "nothing" ? (
          "Nothing"
        ) : (
          <Link href={`/profile/${userData}`}>{userData}</Link>
        )}
      </h2>
      <hr />
      <button
        onClick={logout}
        className="bg-red-500 mt-4 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        logout
      </button>
      <button
        onClick={getUserDetails}
        className="bg-blue-500 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        get user details
      </button>
    </div>
  );
}
