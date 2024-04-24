// An event occurs e.g., a post is created
// Then, event-bus will throw this event to all the routes(including the one that threw the event first)
// Then, this event will be intercepted by all endpoints AND also to the query

import axios from 'axios';
import express from 'express';
import cors from 'cors';
import ports from './ports.js';
const app = express();
app.use(express.json());
app.use(cors());
const events = [];
app.get('/events', (req, res) => {
  res.send(events);
});
//listen on to events
app.post('/events', (req, res) => {
  console.log('POST');
  console.log(req.body);
  const event = req.body;
  events.push(event);
  axios.post(`http://posts-clusterip-srv:${ports.POSTS}/events`, event).catch((err) => {
    console.log(err.message);
  });
  axios.post(`http://comments-srv:${ports.COMMENTS}/events`, event).catch((err) => {
    console.log(err.message);
  });
  axios.post(`http://query-srv:${ports.QUERY}/events`, event).catch((err) => {
    console.log(err.message);
  });
  axios
    .post(`http://moderation-srv:${ports.MODERATION}/events`, event)
    .catch((err) => {
      console.log(err.message);
    });

  res.send({ status: 'OK' });
});

app.listen(ports.EVENT_BUS, () => {
  console.log('Listening on 4005');
});
