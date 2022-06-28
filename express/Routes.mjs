import express from 'express';
import morgan from 'morgan';
import bp from 'body-parser';
import cors from 'cors';
const { urlencoded, json } = bp;
const db = { todo: [] };
const app = express();

//those are all midlware

app.use(urlencoded({ extended: true }));
app.use(cors());
app.use(json());
app.use(morgan('dev'));

app
  .route('/todo')
  .get((req, res) => {
    res.json({ data: db.todo });
  })
  .post((req, res) => {
    //=> this function are controllers
    //todo here is a route
    const newTodo = { id: Date.now, text: req.body.text };
    db.todo.push(newTodo);
    res.json({ data: newTodo });
  });

app.listen(8000, () => {
  console.log('Server on http://localhost:8000');
});
