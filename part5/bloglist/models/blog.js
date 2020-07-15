const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({
  title: { type: String, required: true },
  author: String,
  url: { type: String, required: true },
  likes: { type: Number, default: 0 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

//blogSchema.set('toJSON', { virtuals: true });

/*
blogSchema.method('toJSON', function convertId() {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});
*/

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

blogSchema.post('save', (doc, next) => {
  doc.populate('user', ['username', 'name'])
    .execPopulate()
    .then(() => { next() });
} );

module.exports = mongoose.model('Blog', blogSchema);
