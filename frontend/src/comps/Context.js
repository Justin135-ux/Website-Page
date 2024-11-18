import { createContext  } from "react";

export const myContext=createContext()


// const loginUser = async (req, res) => {
//     try {
//         // Find the user by email
//         const user = await User.findOne({ email: req.body.email });

//         // Check if the user exists
//         if (!user) {
//             return res.status(404).json({ error: 'User not found', success: false });
//         }

//         // Check if the user is banned
//         if (user.isBanned) {
//             return res.status(403).json({ error: 'Your account has been banned. Please contact admin!', success: false });
//         }

//         // Compare the provided password with the stored hashed password
//         const comparePwd = await bcrypt.compare(req.body.password, user.password);

//         if (comparePwd) {
//             // If the password is correct, generate a JWT token
//             const authToken = jwt.sign({ email: user.email }, jwtSecretKey, { expiresIn: '1d' });

//             // Return the token and user details
//             res.json({ success: true, authToken, user, userId: user._id });
//             console.log(authToken);
//         } else {
//             res.status(400).json({ error: 'Incorrect password!', success: false });
//         }
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ success: false, message: 'An error occurred' });
//     }
// };
