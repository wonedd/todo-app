const express = require('express')
const { v4 } = require('uuid'); 

const app = express()

app.use(express.json())

const users = [];

function verifyIfExistsAccount(req, res, next){
  const { username } = req.headers; 

  const user = users.find(user => user.username === username);

  if(!user){
      return res.status(400).json({error: "User not found"})
  }

  req.user = user;

  return next()
}

app.post('/account', (req, res) => {
  const { name, username	} = req.body;

  if (!name || !username) {
    return res.status(400).json({ error: 'Name and username are required' });
  }

  if(users.some(user => user.username === username)){
      return res.status(400).json({ error: 'Username already exists' });
  }
  
  const user = {
    name,
    username,
    id: v4(),
    todos: [] 
  }
 
  users.push(user)

  
  return res.status(201).json(user)
 
})

app.use(verifyIfExistsAccount);

app.get('/todos', (req, res) => {
  const { user } = req;

  return res.json(user.todos);
})

app.post('/todos', (req, res) => {
  const { title, deadline } = req.body;

  const { user } = req;

  const { username } = req.headers

  const todo = {
    id: v4(),
    username,
    title,
    done: false,
    deadline: new Date(deadline),
    createdAt: new Date(),
  }

  user.todos.push(todo)

  return res.status(201).json(todo)
  
})

app.put('/todos/:id', (req, res) => {
  const { title, deadline } = req.body;

  const { id } = req.params;
  
  const { user } = req;

  const todo = user.todos.find(todo => todo.id === id);

  if(!todo){
      return res.status(400).json({error: "Todo not found"})
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return res.status(200).json(todo)

})

app.patch('/todos/:id', (req, res) => {
  const { id } = req.params;

  const { user } = req;

  const todo = user.todos.find(todo => todo.id === id);

  if(!todo){
      return res.status(400).json({error: "Todo not found"})
  }

  todo.done = true;

  return res.status(200).json(todo)
  
})

app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;

  const { user } = req;

  const todo = user.todos.find(todo => todo.id === id);

  if(!todo){
      return res.status(400).json({error: "Todo not found"})
  }

  user.todos.splice(user.todos.indexOf(todo), 1);

  return res.status(204).send()
})

app.listen(3333)