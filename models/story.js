const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create schema
const StorySchema = new Schema({
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'public'
  },
  allowComments: {
    type: Boolean,
    default: true
  },
  comments: [{
    commentBody: {
      type: String,
      required: true
    },
    commentData: {
      type: Date,
      default: Date.now()
    },
    commentUser: {
      type: Schema.Types.ObjectId,
      ref: 'users'
    }
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  data: {
    type: Date,
    default: Date.now
  }
})

// create collection and add schema
mongoose.model('stories', StorySchema, 'stories')