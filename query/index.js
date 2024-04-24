// this acts like a database
import express from 'express';
import cors from 'cors';
import ports from './ports.js';
import axios from 'axios';
const app = express();
app.use(express.json());
app.use(cors());
const posts = {};
/*
  posts={
    'jklmn12':{
      id:'abcd',
      title:'A post title',
      comments: 
      [
        {
          id: 'rty1222',
          content: 'A comment'
        },
        {
          id: 'qwe123',
          content: 'A second comment'
        },
      ]
    },
    'lmnop34': {
      ...
    },
  }
*/
const handleEvent = (type, data) => {
  if (type === 'PostCreated') {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === 'CommentCreated') {
    const { commentId, content, postId, status } = data;
    posts[postId].comments.push({
      commentId,
      content,
      status,
    });
  }
  if (type === 'CommentUpdated') {
    const { commentId, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find(
      (comment) => comment.commentId === commentId
    );
    comment.status = status;
    comment.content = content;
  }
};
app.get('/posts', (_req, res) => {
  res.send(posts);
});
app.post('/events', (req, res) => {
  const { type, data } = req.body;
  handleEvent(type, data);
  console.log({ posts });
  res.send({});
});
app.listen(ports.QUERY, async () => {
  console.log('Listening on 4002');
  //When this server is started or restarted, then it will fetch events from event-bus and add them to database
  const res = await axios.get(`http://event-bus-srv:${ports.EVENT_BUS}/events`);
  res.data.forEach((event) => handleEvent(event.type, event.data));
});
