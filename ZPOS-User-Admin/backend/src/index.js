//import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const SuperLogin = require('superlogin');
const superloginConfig = require('./../superlogin.config');

const WindowsliveStrategy = require('passport-windowslive').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LinkedinStrategy = require('passport-linkedin-oauth2').Strategy;

// define the Express app
const app = express();

// the database
const questions = [];

// enhance your app security with Helmet
// app.use(helmet());


// use bodyParser to parse application/json content-type
app.use(bodyParser.json());

// enable all CORS requests
app.use(cors());

// log HTTP requests
app.use(morgan('combined'));

// load SuperLogin routes
const superlogin = new SuperLogin(superloginConfig);
if(superlogin.config.getItem('providers.windowslive.credentials.clientID'))
  superlogin.registerOAuth2('windowslive', WindowsliveStrategy);
if(superlogin.config.getItem('providers.facebook.credentials.clientID'))
  superlogin.registerOAuth2('facebook', FacebookStrategy);
if(superlogin.config.getItem('providers.github.credentials.clientID'))
  superlogin.registerOAuth2('github', GitHubStrategy);
if(superlogin.config.getItem('providers.google.credentials.clientID'))
  superlogin.registerOAuth2('google', GoogleStrategy);
if(superlogin.config.getItem('providers.linkedin.credentials.clientID'))
  superlogin.registerOAuth2('linkedin', LinkedinStrategy);

app.use('/auth', superlogin.router, (req, res) =>{
  console.log('Request '+ req.body);
  console.log('Response '+ res);
});

const Profile = require('./../profile');
const profile = new Profile(superlogin);
//var db;

app.get('/user/profile', superlogin.requireAuth, (req, res, next) => {
  profile.get(req.user._id)
    .then((userProfile) =>{
      res.status(200).json(userProfile);
      console.log(JSON.stringify(userProfile));
    }, (err) => {
      return next(err);
    });
});

app.post('/user/change-name', superlogin.requireAuth, (req, res, next) =>{
  if(!req.body.newName) {
    return next({
      error: "Field 'newName' is required",
      status: 400
    });
  }
  profile.changeName(req.user._id, req.body.newName)
    .then((userProfile) =>{
      res.status(200).json(userProfile);
    }, (err) =>{
      return next(err);
    });
});

app.post('/user/destroy', superlogin.requireAuth, (req, res, next) =>{
  superlogin.removeUser(req.user._id, true)
    .then(() => {
      console.log('User destroyed!');
      res.status(200).json({ok: true, success: 'User: ' + req.user._id + ' destroyed.'});
    }, function(err) {
      return next(err);
    });
});


// retrieve all questions
app.get('/', (req, res) => {
  const qs = questions.map(q => ({
    id: q.id,
    title: q.title,
    description: q.description,
    answers: q.answers.length,
  }));
  res.send(qs);
});

// get a specific question
app.get('/:id', (req, res) => {
  const question = questions.filter(q => (q.id === parseInt(req.params.id)));
  if (question.length > 1) return res.status(500).send();
  if (question.length === 0) return res.status(404).send();
  res.send(question[0]);
});

/*
const checkJwt = jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://digitalsystemsapi.auth0.com/.well-known/jwks.json`
    }),
  
    // Validate the audience and the issuer.
    audience: 'O0PBMHZYXipRXlSatxw6rre6AaNQ2Sne',
    issuer: `https://digitalsystemsapi.auth0.com/`,
    algorithms: ['RS256']
  });
*/
// insert a new question
app.post('/question', (req, res) => {
    const {title, description} = req.body;
    const newQuestion = {
      id: questions.length + 1,
      title,
      description,
      answers: [],
      author: req.user.name,
    };
    questions.push(newQuestion);
    res.status(200).send();
  });
  
  // insert a new answer to a question
  app.post('/answer/:id', (req, res) => {
    const {answer} = req.body;
  
    const question = questions.filter(q => (q.id === parseInt(req.params.id)));
    if (question.length > 1) return res.status(500).send();
    if (question.length === 0) return res.status(404).send();
  
    question[0].answers.push({
      answer,
      author: req.user.name,
    });
  
    res.status(200).send();
  });

  // Mount SuperLogin's routes to our app
app.use('/auth', superlogin.router);

// start the server
app.listen(3030, () => {
  console.log('listening on port 3030');
});