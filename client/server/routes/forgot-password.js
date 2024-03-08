const router = require("express").Router();
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { redirect } = require("react-router-dom");

router.post("/", async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;
        
        // Find user by email
        let user = await User.findOne({ email });

        // Check if the user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the new password matches the confirm password
       // if (newPassword !== confirmPassword) {
           // return res.status(400).json({ message: "Passwords do not match" });
        //}
        


        // Hash the new password
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(newPassword, salt);

        // Update the user's password
      
        user.password = hashPassword;

        // Save the updated user
        await user.save();

        res.status(200).json({ message: "Password updated successfully" });
        await(3000);
        redirect("/login");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
