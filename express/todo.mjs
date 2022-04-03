import express from 'express';
import morgan from 'morgan';
import bp from 'body-parser';
import cors from 'cors';
const { urlencoded, json } = bp;
const db = { todo: [] };
const app = express();

//those are all midlware

app.use(urlencoded({ extended: true })); //=> to attach to the url string some parametres with ?
app.use(cors()); //=>used to enable interact with other domains.
app.use(json()); //=>used to get responsve from body in json
app.use(morgan('dev')); //this what show all the logs from our server

// implement custom middlware
// we can call this middlware in 3 way
/*  1-with app.use to run with each request
    2- in specified request to run just in that request 
    3- array in specified request to run servel middlware with that request
    */

const log = (req, res, next) => {
  console.log('loggingig');
  next();
};
app.use(log);
app.get('/todo', log, (req, res) => {
  res.json({ data: db.todo });
});
app.post('/todo', [log, log], (req, res) => {
  //=> this function are controllers
  //todo here is a route
  const newTodo = { id: Date.now, text: req.body.text };
  db.todo.push(newTodo);
  res.json({ data: newTodo });
});
app.listen(8000, () => {
  console.log('Server on http://localhost:8000');
});
