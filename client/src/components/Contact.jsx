import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fethcUser = async () => {
      const res = await fetch(`/api/user/${listing.userRef}`);
      const data = await res.json();
      setUser(data);
    };
    fethcUser();
  }, [listing.userRef]);
  if (!user) {
    return <p>Loading...</p>;
  }
  return (
    <>
      {user && (
        <div className="flex flex-col gap-2">
          <p>
            Contact <span className="font-semibold">{user.username}</span> for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            className="w-full border p-3 rounded-lg resize-none "
            name="Message"
            id="message"
            rows="2"
            placeholder="Message"
            onChange={onChange}
          ></textarea>
          <Link
            to={`mailto:${user.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
