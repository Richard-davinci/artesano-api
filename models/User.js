import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  profileImage: { type: String, default: null },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
});

const User = mongoose.model('users', userSchema);

export default User;
