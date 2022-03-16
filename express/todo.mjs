import express from 'express';
import morgan from 'morgan';
import bp from 'body-parser';
const { urlencoded, json } = bp;
const db = { todo: [] };
const app = express();
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(morgan('dev'));
app.get('/todo', (req, res) => {
  res.json({ data: db.todo });
});
app.post('/todo', (req, res) => {
  const newTodo = { id: Date.now, text: req.body.text };
  db.todo.push(newTodo);
  res.json({ data: newTodo });
});
app.listen(8000, () => {
  console.log('Server on http://localhost:8000');
});
