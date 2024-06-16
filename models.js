const express = require('express');
const mongoose = require('mongoose');
const { Movie, User } = require('./models.js');
const morgan = require('morgan');
const path = require('path');

const app = express();
const port = 3000;
const Movies = Models.Movie;
const Users = Models.User;

app.use(express.json());
app.use(morgan('combined'));
mongoose.connect('mongodb://localhost:27017/movies_app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
    });


app.get('/', (req, res) => {
    res.send('Welcome to the Movie API!');
    });


    //return all the movies
    app.get('/movies', async (req, res) => {
        try{
            const movies = await Movie.find();
            res.json(movies);
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while retrieving movies.');
        }
    });
    //return data about a single movie by title

    app.get('/movies/:title', async (req, res) => {
        try {
            const movie = await Movie.findOne({ title: req.params.title });
            if(movie){
                res.json(movie);
            }else{
                res.status(404).send('The movie was not found.');
            }
         
        } catch (error) {
            console.error(error);
            res.status(500).send('An error occurred while retrieving movie data.');
        }
    });

    //return data about a genre by name
    app.get('/genres/:name', async (req, res) => {
        try{
            const movies = await Movie.find({ 'genre.name': req.params.name });
            if(movies.length > 0){
                res.status(200).json(movies.map(movie => movie.genre));  
        }else{
            res.status(404).send('No movies found for the genre.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while retrieving genre data.');
    }
});


//return data about a director by name

app.get('/directors/:name', async (req, res) => {
    try{
        const movies = await Movie.find({ 'director.name': req.params.name });
        if(movies.length > 0){
            res.status(200).json(movies.map(movie => movie.director));
        }else{
            res.status(404).send('No movies found for the director.');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while retrieving director data.');
    }
});

//allow new users to register
app.post('/users', async (req, res) => {
    try{
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(400).send('An error occurred while creating the user.');
    }
});



//allow users to update their user info by username
app.put('/users/:username', async (req, res) => {
    try{
        const updatedUser = await User.findOneAndUpdate({ username: req.params.username }, req.body);
        if(updatedUser){
            res.status(200).json(updatedUser);
        }
        else{
            res.status(404).send('The user was not found.');
        }
    } catch (error) {
        console.error(error);
        res.status(400).send('An error occurred while updating the user.');
    }
}
);


//allow users to add a movie to their list of favorites 

app.post('/users/:username/favorites', async (req, res) => {
    try{
        const user = await User.findOne({ username: req.params.username });
        if(user){
           const movie = await Movie.findOne({ title: req.body.title });
           if(movie && !user.favorite_movies.includes(movie._id)){
               user.favorite_movies.push(movie._id);
               await user.save();
               res.status(201).json(user);
           }else{
                res.status(400).send('movie is not found or already in favourites.');
           }
    }else{
        res.status(404).send('The user was not found.');
    }
} catch (error) {
    console.error(error);
    res.status(400).send('An error occurred while updating the user.');
}
}
);

//allow users to remove a movie from their list of favorites
app.delete('/users/:username/favorites/:movieId', async (req, res) => {
    try{
        const user = await User.findOne({ username: req.params.username });
        if(user){
           user.favorite_movies.pull(req.params.movieId);
              await user.save();
                res.status(201).json(user);
        }
        else{
            res.status(404).send('The user was not found.');
        }
    } catch (error) {
        console.error(error);
        res.status(400).send('An error occurred while updating the user.');
    }
}
);


//allow existing users to deregister
app.delete('/users/:username', async (req, res) => {
    try{
        const deletedUser = await User.findOneAndRemove({ username: req.params.username });
        if(deletedUser){
            res.status(200).json(deletedUser);
        }   
        else{
            res.status(404).send('The user was not found.');
        }
    } catch (error) {
        console.error(error);
        res.status(400).send('An error occurred while deleting the user.');
    }
}
);
// Serve documentation.html from the public folder
app.use('/documentation.html', express.static(path.join(__dirname, 'public/documentation.html')));

           
//listen for requests

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    });