const path = require('path');
const express = require('express');
const open = require('open');
const session = require('express-session');
const redis = require('redis')
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');

const sequelize = require('./config/connection');
let RedisStore = require('connect-redis')(session)

const app = express();
const PORT = process.env.PORT || 3001;

// Set up Handlebars.js engine with custom helpers
const hbs = exphbs.create({ helpers });

const sess = {
  secret: 'Super secret secret',
  cookie: {},
  resave: false,
  saveUninitialized: true,
  store: new RedisStore({ client: redis.createClient({ url: "//DX9UoIkRVHnFaTDjoEa0qseIg0BCcOTV@redis-14675.c251.east-us-mz.azure.cloud.redislabs.com:14675"}) })
};

app.use(session(sess));

// Inform Express.js on which template engine to use
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log('Now listening'), open('http://localhost:3001/'));
});
