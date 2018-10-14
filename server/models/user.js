import mongoose from 'mongoose';

const { Schema } = mongoose;

// To fix https://github.com/Automattic/mongoose/issues/4291
mongoose.Promise = global.Promise;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  country: String,
  zipCode: Number,
  updated: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('User', userSchema);
