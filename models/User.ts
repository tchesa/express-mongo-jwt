import { Schema, model } from "mongoose";

type User = {
  name: string;
  email: string;
  password: string;
};

const userSchema = new Schema<User>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const userModel = model("User", userSchema);

export default userModel;
