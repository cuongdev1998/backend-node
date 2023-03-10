const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const AuthRoute = require('./routes/AuthRoute');
const PlayerRoute = require('./routes/PlayerRoute');
const ClubRoute = require('./routes/ClubRoute');
const LeagueRoute = require('./routes/LeagueRoute');
const UserRoute = require('./routes/UserRoute');
const morgan  = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/ErrorController')

dotenv.config();
//connect to DB
mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true},  () => {
    console.log('connected to db!')
})


app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
})
app.use(morgan('combined'));
//route middleware
app.use('/api/authentication', AuthRoute)
app.use('/api/player', PlayerRoute)
app.use('/api/club', ClubRoute)
app.use('/api/league', LeagueRoute)
app.use('/api/user', UserRoute)

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
})
app.use(globalErrorHandler);
app.listen(3000, () => console.log('Server is running'));
