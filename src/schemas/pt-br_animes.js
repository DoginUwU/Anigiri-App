const mongoose = require('mongoose');

const schema = mongoose.Schema({
  name: String,
  description: String,
  image: String,
  episodes: Object,
  movie: Boolean,
  ongoing: Boolean,
  ova: Boolean,
  fullname: String
});

module.exports = mongoose.model("pt-br_animes", schema)
