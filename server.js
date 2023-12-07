const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/')));
app.use(express.json());
var id = 1
let tasks = [
  { id: id, listName: 'TO DO', cards: [{idcard:"card"+id, cardName: "card1" }] },
  { id: id += 1, listName: 'DOING', cards: [{idcard:"card"+id, cardName: "card2" }] },
  { id: id += 1, listName: 'DONE', cards: [{idcard:"card"+id, cardName: "card3" }] },
  // Add more tasks as needed
];

// CRUD operations
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});


app.get('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const index = tasks.findIndex(task => task.id === taskId);

  if (index !== -1) {
    res.json(tasks.find(task => task.id === taskId));
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.post('/api/tasks', (req, res) => {
  const newTask = req.body;
  id++
  newTask.id = id
  tasks.push(newTask);
  res.json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const updatedTask = req.body;
  const index = tasks.findIndex(task => task.id === taskId);

  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updatedTask };
    res.json(tasks[index]);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});


app.put('/api/tasks', (req, res) => {
  const updatedTasks = req.body;
  tasks = [...updatedTasks];
  res.json(updatedTasks);
});




app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const index = tasks.findIndex(task => task.id === taskId);

  if (index !== -1) {
    const deletedTask = tasks.splice(index, 1);
    res.json(deletedTask[0]);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running at http://localhost:${PORT}/`);
});

