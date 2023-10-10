import React, { useEffect, useState } from "react";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState([]);
  const [errorMessage, setErrorMessage] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [formData, setFormData] = useState({
    imageUrl: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedRooms: 1,
    bathRooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      const res = await fetch("/api/listing/getListing/" + id);
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setFormData(data);
    };
    fetchListing();
  }, []);

  function handleSubmitFiles() {
    setImageLoading(true);
    if (files.length > 0 && files.length + formData.imageUrl.length < 8) {
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeFile(files[i]));
      }
      Promise.all(promises)
        .then((url) => {
          setFormData({ ...formData, imageUrl: formData.imageUrl.concat(url) });
          setErrorMessage(false);
          setImageLoading(false);
        })
        .catch((error) => {
          setErrorMessage("Upload Failed (2 mb per image)!");
          setImageLoading(false);
        });
    } else {
      setErrorMessage("You can only upload 8 Images!");
      setImageLoading(false);
    }
  }
  const storeFile = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress + "% Upload");
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadUrl) => {
              resolve(downloadUrl);
            })
            .catch((error) => {
              reject(error);
              setImageLoading(false);
            });
        }
      );
    });
  };
  function handleRemoveImage(index) {
    setFormData({
      ...formData,
      imageUrl: formData.imageUrl.filter((url, i) => i !== index),
    });
  }
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }
    if (
      e.target.type === "text" ||
      e.target.type === "number" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };
  async function handleSubmit(e) {
    e.preventDefault();
    if (formData.imageUrl.length < 1)
      return setError("You Must Upload atleast 1 image");
    if (+formData.regularPrice < +formData.discountPrice)
      return setError("Discounted Price need to be less than regular price");
    try {
      setLoading(true);
      setError(false);
      const res = await fetch(`/api/listing/update/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, userRef: currentUser._id }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  }
  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Update a Listing
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength={62}
            minLength={10}
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="sale"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="rent"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="parking"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="furnished"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="offer"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bedRooms"
                min={1}
                max={10}
                required
                className="p-3 w-20 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bedRooms}
              />
              <p>BedRooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="bathRooms"
                min={1}
                max={10}
                required
                className="p-3 w-20 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.bathRooms}
              />
              <p>BathRooms</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min={50}
                max={100000}
                required
                className="p-3 w-20 border border-gray-300 rounded-lg"
                onChange={handleChange}
                value={formData.regularPrice}
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / month)</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="discountPrice"
                  min={0}
                  max={100000}
                  required
                  className="p-3 w-20 border border-gray-300 rounded-lg"
                  onChange={handleChange}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col items-center">
                  <p>Discount Price</p>
                  <span className="text-xs">($ / month)</span>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The First Image will be cover (max 6)
            </span>
          </p>
          <div className="flex">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border border-gray-300 rounded w-full"
              type="file"
              id="images"
              accept="image/*"
              multiple
            />
            <button
              onClick={handleSubmitFiles}
              type="button"
              className="p-3 text-green-700 border border-green-700 rounded hover:shadow-lg disabled:opacity-80"
            >
              {imageLoading ? "Uploading.." : "Upload"}
            </button>
          </div>
          <p className="text-red-700 text-sm">{errorMessage && errorMessage}</p>
          {formData.imageUrl.length > 0 &&
            formData.imageUrl.map((url, index) => {
              return (
                <div
                  key={url}
                  className="flex justify-between p-3 border border-gray-300 items-center"
                >
                  <img
                    src={url}
                    alt="Listing Image"
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
                  >
                    Delete
                  </button>
                </div>
              );
            })}
          <button
            disabled={loading || imageLoading}
            className="p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            {loading ? "Updating..." : "Update"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
        </div>
      </form>
    </main>
  );
}
