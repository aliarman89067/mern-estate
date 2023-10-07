import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loadingStart,
  loadingSuccess,
  loadingFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({});

  const navigate = useNavigate();

  function handleSignUp(e) {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  }
  async function handleSubmit(e) {
    e.preventDefault();
    dispatch(loadingStart());
    if (formData.email && formData.password) {
      try {
        const res = await fetch("/api/auth/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(loadingFailure(data.message));
          return;
        }
        dispatch(loadingSuccess(data));
        navigate("/");
      } catch (error) {
        dispatch(loadingFailure(error.message));
      }
    } else {
      alert("Please Fill All tThe Inputs");
    }
  }
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          id="email"
          onChange={handleSignUp}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          id="password"
          onChange={handleSignUp}
        />
        <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
          {user.loading ? "Loading.." : "Sign In"}
        </button>
        <OAuth />
      </form>
      <div className="flex justify-center gap-2 mt-5">
        <p>Dont Have an Account ?</p>
        <Link className="text-blue-700" to={"/sign-up"}>
          Sign up
        </Link>
      </div>
      <p className="text-red-500">{user.error}</p>
    </div>
  );
}
