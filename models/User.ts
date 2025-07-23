import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
  email: string;
  password: string;
  _id?: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  likedVideos: mongoose.Types.ObjectId[];
  dislikedVideos: mongoose.Types.ObjectId[];
  likedComments: mongoose.Types.ObjectId[];
  dislikedComments: mongoose.Types.ObjectId[];
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    likedVideos: [{ type: Schema.Types.ObjectId, ref: "Video" }],
    dislikedVideos: [{ type: Schema.Types.ObjectId, ref: "Video" }],
    likedComments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    dislikedComments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = models?.User || model<IUser>("User", userSchema);

export default User;
