// models.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const genreSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true }
});

const directorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    bio: String,
    birth_year: Number,
    death_year: Number
});

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    genre: genreSchema,
    director: directorSchema,
    image_url: String,
    is_featured: Boolean
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    birthday: Date,
    favorite_movies: [{ type: Schema.Types.ObjectId, ref: 'Movie' }]
});

const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);

module.exports = { Movie, User };
