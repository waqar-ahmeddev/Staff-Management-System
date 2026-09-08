import userModel from "./models/UserModel.js";

const registerUser = async (req, res) => {
  try {
    const { name, email, password, department, position } = req.body;

    if (!name || !email || !password || !department || !position) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user instance
    const newUser = new userModel({
      name,
      email,
      password, // Plain text pass karein, Mongoose pre-save hook isey hash kar dega
      department,
      position,
    });

    // Save to Database (yeh step pre("save") hook trigger karega)
    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        department: newUser.department,
        position: newUser.position,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    // Check if user exists
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Corrected method name: matchPassword
    const isMatch = await existingUser.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Return user data
    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        department: existingUser.department,
        position: existingUser.position,
        role: existingUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { registerUser, loginUser };