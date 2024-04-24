import axios from 'axios';
import express from 'express';
import ports from './ports.js';
const app = express();
app.use(express.json());

app.post('/events', async (req, res) => {
  const { type, data } = req.body;
  console.log({type,data});
  if (type === 'CommentCreated') {
    const status = data.content.toLowerCase().includes('orange')
      ? 'rejected'
      : 'approved';
    await axios.post(`http://event-bus-srv:${ports.EVENT_BUS}/events`, {
      type: 'CommentModerated',
      data: {
        ...data,
        status,
      },
    });
  }
});
app.listen(ports.MODERATION, () => {
  console.log('Listening on 4003');
});
