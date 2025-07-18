import { Claim } from "../models/claim.model.js";
import { AddedUser } from "../models/addedUser.model.js";

const claimPoints = async (req, res) => {
    const user = req.user;

    try {
        const { to } = req.query;

        if (!to) {
            return res
                .status(400)
                .json({ message: "Please select a user to award points to" });
        }

        const awardedUser = await AddedUser.findById(to);

        if (!awardedUser) {
            return res
                .status(404)
                .json({ success: false, message: "User not found" });
        }

        const pointsClaimed = Math.floor(Math.random() * 10) + 1; // Random points between 1 and 10

        const claim = await Claim.create({
            to,
            pointsClaimed,
        });

        // Update user history
        user.history.push(claim._id);
        await user.save();

        // Update awarded user's points
        awardedUser.points += pointsClaimed;
        await awardedUser.save();

        return res.status(201).json({
            success: true,
            data: claim,
            message: "Points claimed successfully",
        });
    } catch (error) {
        console.error("Error claiming points:", error);
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};

export { claimPoints };
