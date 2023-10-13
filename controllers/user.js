// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const User = require("../models/user")

exports.signup = async (
    req,
    res
) => {
    const { uid, email } = req.body;

    if (!uid || !email) {
        return res
            .status(400)
            .json({ success: false, message: "Please fill all required fields" });
    }

    try {

        const userExist = await User.findOne({ uid })

        if (userExist) {
            return res.status(200).json({
                success: true,
                message: "User login successfully !",
            });
        }

        const user = await User.create(req.body);

        res.status(200).json({
            success: true,
            message: "User data stored successfully !",
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message:
                error?.response?.data?.message ||
                error?.message ||
                "Internal server error",
        });
    }
}