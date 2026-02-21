import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// registers a new user
// route: POST: /api/users/register
export const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // guard check
    if (!username || !email || !password) {
      const error = new Error("Please provide all required fields"); // why use Error instead of console.log
      error.statusCode = 400; // bad request
      throw error; // this will be caught by error handler 
    }

    // checks if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = new Error("User with this email already exist");
      error.statusCode = 409; //conflict
      throw error; 
    }

    // creates user in database
    const user = await User.create({
      username,
      email,
      password,   // password will be hashed by pre-save middleware in user model
    });

    // generates JWT token
    const token = generateToken(user._id);

    // sends success response
    res.status(201).json({
      success: true,
      message: "User created",
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        createTime: user.createdAt,
        token // returns token
      }
    });
    
  } catch (error) {
    // passes error to error handler
    next(error);
  }
};

// logs in a user
// route: POST /api/users/login - POST because it sends sensitive information, GET will make password visible in URL, store in broswer history, log in server logs. POST will hide password, encrypt in request body, not in URL or logs
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // guard check
    if (!email || !password) {
      const error = new Error("Please provide email and password");
      error.statusCode = 400;
      throw error;
    }

    // checks if user exists
    const user = await User.findOne({ email }).select('+password'); // includes password

    if (!user) {
      const error = new Error("User does not exist");
      error.statusCode = 404;
      throw error;
    }

    // check password
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      const error = new Error("Invalid Credentials");
      error.statusCode = 401;
      throw error;
    }

    // generates JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: "Logic successful",
      data: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        token   // returns token
      },
    });

  } catch (error) {
    // passes error to error handler
    next(error);
  }
};

// fetches a user by id
// route: /api/users/:id
export const getUser = async (req, res, next) => {
  try {
    // gets user id from url parameter
    const userId = req.params.id;

    // finds the user
    const user = await User.findById(userId).select('-password'); 

    if(!user) {
      const error = new Error('User not found');
      error.statusCode = 404; 
      throw error;
    }

    // checks if user is requesting their own profile
    if(user._id.toString() !== req.user._id.toString()) {
      const error = new Error('Not authorized to view this profile');
      error.statusCode = 403;
      throw error;
    }

    // found user, sends response
    res.status(200).json({
      success: true,
      data: user
    });
    
  } catch (error) {
    // handles invalid objectId:
    if(error.name === 'CastError') {
      error.message = 'Invalid user ID format';
      error.statusCode = 400;
    }

    next(error);
  }
};

// updates a user profile by id
// route: /api/users/:id
export const updateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    // fields that can be update
    const { username, email, avatar } = req.body;

    // checks if user is updating their own profile
    if(userId !== req.user._id.toString()) {
      const error = new Error('Not authorized to update this profile');
      error.statusCode = 403;
      throw error;
    }

    // finds user
    const user = await User.findById(userId);

    if(!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // updates user profile
    if (username) user.username = username;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;

    // saves the updated user
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: 'User profile updated',
      data: {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        updatedAt: updatedUser.updateAt
      }
    })

  } catch (error) {
    // handle duplicate email error
    if (error.code === 11000) {
      error.message = 'Email already in use',
      error.statusCode = 409; //conflict
    }
    next(error);
  }
};

// deletes a user profile by id
// route: /api/users/:id
export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id;

    if(userId !== req.user._id.toString()) {
      const error = new Error('Not authorized to delete this account');
      error.statusCode = 403;
      throw error;
    }

    const user = await User.findByIdAndDelete(userId);

    if(!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({    // if using 204, dont send json body
      success: true,
      message: 'User deleted successfully',
      data: {
        username: user.username,
        email: user.email,
        deletedAt: user.updatedAt
      }
    });

  } catch (error) {
    next(error);
  }
};

// gets all users
// route: /api/users
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');

    if(users.length === 0) {
      return res.status(200).json({
        success: false,
        message: 'No users found'
      })
    }

    // found users
    res.status(200).json({
      success: true,
      count: users.length,
      data: {users}
    });

  } catch (error) {
    next(error);
  }
};


