const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const authRoute = require('./routes/auth');
const PlayerRoute = require('./routes/Players');
const ClubRoute = require('./routes/Clubs');
const LeagueRoute = require('./routes/Leagues');
const morgan  = require('morgan');

dotenv.config();
//connect to DB
mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true},  () => {
    console.log('connected to db!')
})


app.use(express.json());
app.use(morgan('combined'));
//route middleware
app.use('/api/user', authRoute)
app.use('/api/player', PlayerRoute)
app.use('/api/club', ClubRoute)
app.use('/api/league', LeagueRoute)
app.listen(3000, () => console.log('Server is running'));
