const express = require('express'); // Express

// importing the routers for each route

const cors = require('cors');
const productsRouter = require('./routes/productsRouter');
const usersRouter = require('./routes/usersRouter');
const ProcessesRouter = require('./routes/ProcessesRouter');
const resetRouter = require('./routes/resetRouter');
const AppError = require('./utils/appError');
const globalErrorController = require('./controllers/errorController');
// Define the Server
const app = express();

app.use(cors());
// MiddleWares
app.use(express.json()); //  Avoid undefined Post req.body [bodyParser]

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//Normal Get Request
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to my Server', app: 'my firstapp' });
});

app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use('/processes', ProcessesRouter);
app.use('/resetdatabase', resetRouter);

// All Unhandled Routes [Must be the last Route or it will be handled no matter what is the req url]
app.all('*', (req, res, next) => {
  next(new AppError(`Could Not Found ${req.originalUrl} on this server`, 404));
});

// Error Handling MiddleWare
app.use(globalErrorController);

module.exports = app;
