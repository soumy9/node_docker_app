import express from 'express';
import { randomBytes } from 'crypto';
import cors from 'cors';
import axios from 'axios';
import ports from './ports.js';
const app = express();

//in order to read HTTP POST data , we have to use this express middleware that reads a form's input and stores it as a javascript object accessible through req.body---
app.use(express.json());
//---

//Any time that we are looking at some domain or domain with a port or domain with a subdomain that is different than the URL or the domain that we're trying to make a request to, we will encounter CORS error---
app.use(cors());
//---
const posts = {};
// app.get('/posts', (req, res) => {
//   console.log('GET');
//   res.send(posts);
// });
app.post('/posts/create', async (req, res) => {
  console.log('POST');
  //generate a random id---
  const id = randomBytes(4).toString('hex');
  //---
  const { title } = req.body;
  posts[id] = {
    id,
    title,
  };
  //emmit an event---
  await axios
    .post(`http://event-bus-srv:${ports.EVENT_BUS}/events`, {
      type: 'PostCreated',
      data: {
        id,
        title,
      },
    })
    .catch((error) => {
      console.log(error.message);
    });
  //---
  //The HTTP 201 Created success status response code indicates that the request has succeeded and has led to the creation of a resource.
  res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
  console.log('Received event', req.body.type);
  res.send({});
});
app.listen(ports.POSTS, () => {
  console.log('V101');
  console.log('Listening on port 4000');
});
