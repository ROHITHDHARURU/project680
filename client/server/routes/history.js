const router = require("express").Router();
const { User } = require("../models/user");

router.get("/", async (req, res) => {
    try {
       // console.log(req)
        const email = req.query.email; // "1234@gmail.com" // Retrieve email from query parameters
        //console.log(email);
        
        const user = await User.findOne({email});
        // console.log(user);
        
        if (user) {
            return res.status(200).json(user);
        } else {
            return res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
