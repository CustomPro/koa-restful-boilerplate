import mongoose from 'mongoose';

const { Schema } = mongoose;

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
