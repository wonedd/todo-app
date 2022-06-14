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

  users.push({
    name,
    username,
    id: v4(),
    todos: [] 
})
return( 
  res.status(201).send() && res.send(console.log(users))
)
})

app.use(verifyIfExistsAccount);

app.get('/todos', (req, res) => {
  const { username } = req.headers; 

  const user = users.find(user => user.username === username);

  return res.json(user.todos);
})

app.post('/todos', (req, res) => {
  const { title, deadline } = req.body;

  const { username } = req.headers;

  const user = users.find(user => user.username === username);

  const todo = {
    id: v4(),
    username,
    title,
    done: false,
    deadline: new Date(deadline),
    createdAt: new Date(),
  }

  user.todos.push(todo)

  return res.status(201).send() && console.log(user);

  
  
})

app.listen(3333)