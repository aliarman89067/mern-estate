import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHgAmAMBIgACEQEDEQH/xAAbAAEAAwEBAQEAAAAAAAAAAAAAAQUGAwQCB//EADgQAAIBAgEHCgQFBQAAAAAAAAABAwIEEQUUITFBVJMGEhNRUmFxkbHRMjRz4RYiI3KBM0JTocH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8A/agAAAAAAAACmyplum3qcNqlXKtFVT+Gn3YFy9Cx2HPp4ccOmjx6uejFXF1Pc1c6eWuvub0eRy0Ab7ZitQMLBcz21WMEtdH7Xo8jQZMy3TNUobxKmt6KZFoVXj1AXQAAAAAAAAAAAAAAAAAAq8vXztbdRRPCWXU1sXWZQsMvSuXKcvVHhQv4++JXgAAAGIAGo5P39VzA4JaudLFqfXSW5jciyuHKcDWqqrmP+TZAAAAAAAAAAAAAAAAAYrKq5uUrlPX0jPKXHKW2cd3TOl+WVLH9y+2BTgAAAAAHoyenVfW6WvpKfU25leTls5b7pmvyQrHHvehGqAAAAAAAAAAAAAAAAA4XtrReW9UMmp6U+y+sxt3ay2kzimpwexrVUutG5OVzbQ3UfRzxqunZjs8AMKC/ueTmlu1nWHZk917Hl/D99jh+j48/7AVR2tbeW6lUUNPOqfku9lxb8nHjjczpLsxr/rLu1tYbSPo7eNULa9r8QPiwtKLK2pho0vXVV2n1npAAAAAAAAAAAAAAAAPiWSiGOqSSpU0UrFt7DNZRy5NO3RauqKLtJ4VVewF/c39ra6J5qaauytL8kVsvKKCn+jBXX31PmmbenWALurlHM/gt4141Nnx+Irr/ABQeT9ynCAu6eUk391vG/Cpo9UXKKCrRLBJR30tVexmgmBtrW/tbrRBNTVV2Xofkz0mALfJ2W5rdqO5dUsXW/ip9wNQD4ikoljpkirVVFSxTR9gAAAAAAAAAD4mr6OGSTs0t/wCgM1ygv3PcO2of6UTwffVt8ioJeL01PFvWyGAAAAAANgQABE6CABbcn79wXKt5HjFK8Fjsq2eZqTAYtaU8GtTN3BX0kEcj110KrzQHQAAAAAAAA43nyk/0qvRnY43nyk/0qvRgYYDRgAAAAAAAAADAAA3Fl8nB9On0MMbmy+Tg+nT6AdwAAAAAAACGk001imsGmSAOGZ227w8NDM7bd4eGiQBGZ227w8NDM7bd4eGiQBGZ227w8NDM7bd4eGiQBGZ227w8NDM7bd4eGiQBGZ227w8NDM7bd4eGiQBGZ227w8NHZJKlJLBLUkSAAAAAAD//2Q==",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
