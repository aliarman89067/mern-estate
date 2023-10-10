import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteFailure,
  deleteStart,
  deleteSuccess,
  signoutStart,
  signoutSuccess,
  signoutFailure,
} from "../redux/user/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { Link } from "react-router-dom";

export default function Profile() {
  const dispatch = useDispatch();
  const profileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePer, setFilePer] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [success, setSuccess] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);
  const [loadingListings, setloadingListings] = useState(false);

  const { currentUser, loading, error } = useSelector((state) => state.user);
  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);
  function handleFileUpload(file) {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapShot) => {
        const progress =
          (snapShot.bytesTransferred / snapShot.totalBytes) * 100;
        setFilePer(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  }
  function handleChange(e) {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(updateStart());
    try {
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateFailure(data.message));
        return;
      }
      dispatch(updateSuccess(data));
      setSuccess(true);
    } catch (error) {
      dispatch(updateFailure(error.message));
    }
  };
  async function handleDeleteClick(e) {
    e.preventDefault();
    dispatch(deleteStart());
    try {
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteFailure(data.message));
      }
      dispatch(deleteSuccess(data));
    } catch (error) {
      dispatch(deleteFailure(error.message));
    }
  }
  async function handleLogoutClick(e) {
    e.preventDefault();
    dispatch(signoutStart());
    try {
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(signoutFailure(data.message));
      }
      dispatch(signoutSuccess());
    } catch (error) {
      dispatch(signoutFailure(error.message));
    }
  }
  async function handleShowListing() {
    try {
      setloadingListings(true);
      setShowListingError(false);
      const res = await fetch("/api/user/listings/" + currentUser._id);
      const data = await res.json();
      if (data.success == false) {
        setShowListingError(data.message);
        setloadingListings(false);
        return;
      }
      setloadingListings(false);
      setUserListings(data);
    } catch (error) {
      setloadingListings(false);
      setShowListingError(error.message);
    }
  }
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success == false) {
        setShowListingError(data.message);
      }
      setUserListings((prev) => prev.filter((list) => list._id !== listingId));
    } catch (error) {
      setShowListingError(error.message);
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={profileRef}
          hidden
          accept="image/*"
        />
        <img
          src={formData.avatar || currentUser.avatar}
          alt=""
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          onClick={() => profileRef.current.click()}
        />
        <p className="text-center">
          {fileUploadError ? (
            <span className="text-red-700">Image Must be less than 2 mb</span>
          ) : filePer > 0 && filePer < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePer} %`}</span>
          ) : filePer === 100 ? (
            <span className="text-green-700">Image Successfully Uplaoded</span>
          ) : (
            ""
          )}
        </p>
        <input
          id="username"
          defaultValue={currentUser.username}
          type="text"
          placeholder="Username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          id="email"
          defaultValue={currentUser.email}
          type="email"
          placeholder="Email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          id="password"
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading.." : "Update"}
        </button>
        <Link
          className="bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
          to={"/create-listing"}
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          onClick={handleDeleteClick}
          className="text-red-700 cursor-pointer"
        >
          Delete Account
        </span>
        <span
          onClick={handleLogoutClick}
          className="text-red-700 cursor-pointer"
        >
          Sign out
        </span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {success ? "User Updated Successfully" : ""}
      </p>
      {userListings.length < 1 && (
        <button onClick={handleShowListing} className="text-green-700 w-full">
          {loadingListings ? "Load Listings.." : "Show Listings"}
        </button>
      )}
      {userListings.length > 0 && (
        <button
          onClick={() => setUserListings([])}
          className="text-green-700 w-full"
        >
          Hide Listings
        </button>
      )}
      {showListingError && (
        <p className="text-red-700 mt-5">{showListingError}</p>
      )}

      {userListings && userListings.length > 0 && (
        <div className="flex flex-col gap-4">
          <h1 className="text-center text-2xl font-semibold my-7">
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              className="border rounded-lg p-3 flex justify-between items-center gap-4"
              key={listing._id}
            >
              <Link to={"/listing/" + listing._id}>
                <img
                  src={listing.imageUrl[0]}
                  alt="Listing Image"
                  className="h-16 w-16 object-cover rounded-lg"
                />
              </Link>
              <Link
                to={"/listing/" + listing._id}
                className="text-slate-700 font-semibold flex-1 hover:underline"
              >
                <p>{listing.name}</p>
              </Link>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className="text-red-700 uppercase"
                >
                  Delete
                </button>
                <Link to={"/update-listing/" + listing._id}>
                  <button className="text-green-700 uppercase">Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
