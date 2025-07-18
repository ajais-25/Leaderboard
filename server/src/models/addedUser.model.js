import mongoose, { Schema } from "mongoose";

const addedUserSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    name: {
        type: String,
        required: true,
    },
    points: {
        type: Number,
        default: 0,
    },
});

export const AddedUser = mongoose.model("AddedUser", addedUserSchema);
