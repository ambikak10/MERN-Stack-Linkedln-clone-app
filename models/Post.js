const mongoose =  require('mongoose');
const Schema  = mongoose.Schema;

const PostSchema = new Schema({

  user: {
    type: Schema.Types.ObjectId,
    ref: 'udemyUser'
  },
  text: {
    type: String,
    required: true
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  likes:[
    {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'udemyUser'
      }
    }
  ],
  comments: [
    {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'udemyUser'
    },
    text: {
      type: String,
      required: true
    },
    name: {
      type: String
      },
    avatar: {
      type: String, 
      },
    }
  ],
  date: {
    type: Date,
    default: Date.now
  }
});
module.exports = Post = mongoose.model('udemyPosts', PostSchema);