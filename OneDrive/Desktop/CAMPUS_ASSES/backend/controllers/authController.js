import User from '../models/User.js';
import College from '../models/College.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'placeholder_client_id');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, role, collegeDomain } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let collegeId = null;
    
    // Find college if domain is provided
    if (collegeDomain) {
      const college = await College.findOne({ domain: collegeDomain });
      if (!college) {
        // For development, we auto-create the college if it doesn't exist
        const newCollege = await College.create({
          name: collegeDomain.split('.')[0].toUpperCase() + " University",
          domain: collegeDomain
        });
        collegeId = newCollege._id;
      } else {
        collegeId = college._id;
      }
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'STUDENT',
      collegeId
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        collegeId: user.collegeId,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate('collegeId', 'name domain logo');

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        college: user.collegeId,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('collegeId');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Google Login/Register
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req, res) => {
  const { credential } = req.body;
  try {
    const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID || 'placeholder_client_id',
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;
    const picture = payload.picture;
    const domain = payload.hd; // Hosted domain (Google Workspace)

    let user = await User.findOne({ email });

    if (!user) {
      // Register user
      let collegeId = null;
      if (domain) {
        const college = await College.findOne({ domain });
        if (!college) {
          const newCollege = await College.create({
            name: domain.split('.')[0].toUpperCase() + " University",
            domain: domain
          });
          collegeId = newCollege._id;
        } else {
          collegeId = college._id;
        }
      }

      // Generate random password for google users
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), salt);

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        avatar: picture,
        collegeId,
        isVerified: true
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      college: user.collegeId,
      token: generateToken(user._id),
      avatar: user.avatar
    });
  } catch (error) {
    console.error("Google Auth Error", error);
    res.status(401).json({ message: 'Invalid Google Token' });
  }
};

// @desc    Demo Google Login (For Client Demos without real Client ID)
// @route   POST /api/auth/demo-google
// @access  Public
export const demoGoogleLogin = async (req, res) => {
  try {
    const email = "demo.google@university.edu";
    const name = "Google User (Demo)";
    const domain = "university.edu";

    let user = await User.findOne({ email });

    if (!user) {
      let collegeId = null;
      const college = await College.findOne({ domain });
      if (!college) {
        const newCollege = await College.create({
          name: "Google Demo University",
          domain: domain
        });
        collegeId = newCollege._id;
      } else {
        collegeId = college._id;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), salt);

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "STUDENT",
        collegeId,
        isVerified: true
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      college: user.collegeId,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
