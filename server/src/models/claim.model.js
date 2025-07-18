import mongoose, { Schema } from "mongoose";

const claimSchema = new Schema(
    {
        to: {
            type: Schema.Types.ObjectId,
            ref: "AddedUser",
            required: true,
        },
        pointsClaimed: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export const Claim = mongoose.model("Claim", claimSchema);
