import mongoose from 'mongoose'
import timestamps from 'mongoose-timestamp'

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
  isnew: {
    type: Number,
    default: 1
  },
  updated: {
    type: Date,
    default: Date.now
  }

});
userSchema.plugin(timestamps);

export default mongoose.model('User', userSchema);
