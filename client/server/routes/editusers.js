const router = require("express").Router();
const { User } = require("../models/user");

router.post("/", async(req, res) => 
{
	


  try {
    const { email, predicateExpression, coverageType } = req.body;
    console.log(req.body)
    // Find user by username
    let user = await User.findOne({ email });

  
    // Add new predicate and coverage type combination to the array
    user.predicatesAndCoverageTypes.push({ predicateExpression, coverageType });

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
module.exports = router;