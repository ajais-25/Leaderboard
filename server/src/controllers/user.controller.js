import mongoose from "mongoose";
import { AddedUser } from "../models/addedUser.model.js";
import { User } from "../models/user.model.js";

const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required",
        });
    }

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const newUser = await User.create({
            name,
            email,
            password,
        });

        const user = await User.findById(newUser._id).select("-password");

        if (!user) {
            return res.status(500).json({
                success: false,
                message: "User registration failed",
            });
        }

        const token = user.generateAuthToken();

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
        });

        res.status(200).json({
            success: true,
            message: "User registered successfully",
            data: user,
            token,
        });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required",
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        const token = user.generateAuthToken();

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
        });

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                points: user.points,
                history: user.history,
            },
            token,
        });
    } catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const logout = async (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: true,
    });

    res.status(200).json({
        success: true,
        message: "User logged out successfully",
    });
};

const addUser = async (req, res) => {
    const { name, points } = req.body;
    const userId = req.user._id;

    if (!name || !points) {
        return res.status(400).json({
            success: false,
            message: "Name and points are required",
        });
    }

    try {
        const newUser = await AddedUser.create({
            userId,
            name,
            points,
        });

        res.status(201).json({
            success: true,
            message: "User added successfully",
            data: newUser,
        });
    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const getAllUsers = async (req, res) => {
    const userId = req.user._id;

    try {
        const users = await AddedUser.find({ userId })
            .sort({ points: -1 })
            .select("-__v");

        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const getClaimHistory = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await User.aggregate([
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId),
                },
            },
            {
                $lookup: {
                    from: "claims",
                    localField: "history",
                    foreignField: "_id",
                    as: "history",
                    pipeline: [
                        {
                            $lookup: {
                                from: "addedusers",
                                localField: "to",
                                foreignField: "_id",
                                as: "toUser",
                                pipeline: [
                                    {
                                        $project: {
                                            _id: 0,
                                            name: 1,
                                            points: 1,
                                        },
                                    },
                                ],
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                pointsClaimed: 1,
                                createdAt: 1,
                                toUser: { $arrayElemAt: ["$toUser", 0] },
                            },
                        },
                        {
                            $sort: {
                                createdAt: -1,
                            },
                        },
                    ],
                },
            },
        ]);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: user[0].history,
        });
    } catch (error) {
        console.error("Error fetching claim history:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export { register, login, logout, addUser, getAllUsers, getClaimHistory };
