import express from 'express';
import { randomBytes } from 'crypto';
import cors from 'cors';
import axios from 'axios';
import ports from './ports.js';
const app = express();

//in order to read HTTP POST data , we have to use this express middleware that reads a form's input and stores it as a javascript object accessible through req.body---
app.use(express.json());
//---
app.use(cors());
/*
  {
    "e92dd7da": [
        {
            "commentId": "531097d9",
            "content": "First Comment"
        },
        {
            "commentId": "0bf48bc9",
            "content": "Second Comment"
        }
    ],
    "254b6d64": [
        {
            "commentId": "c51a1a3f",
            "content": "First"
        }
    ]
  }
*/
const commentsByPostId = {};
app.get('/posts/:id/comments', (req, res) => {
  console.log('GET');
  res.send(commentsByPostId[req.params.id] || []);
});
app.post('/posts/:id/comments', async (req, res) => {
  console.log('POST');
  //generate a random id
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;
  const prevCommentsOnPost = commentsByPostId[req.params.id] || [];
  const updatedComments = [
    ...prevCommentsOnPost,
    {
      commentId,
      content,
      status: 'pending',
    },
  ];
  commentsByPostId[req.params.id] = updatedComments;
  //emmit an event---
  await axios
    .post(`http://event-bus-srv:${ports.EVENT_BUS}/events`, {
      type: 'CommentCreated',
      data: {
        commentId,
        content,
        postId: req.params.id,
        status: 'pending',
      },
    })
    .catch((error) => {
      console.log(error.message);
    });
  //---
  //The HTTP 201 Created success status response code indicates that the request has succeeded and has led to the creation of a resource.
  res.status(201).send(commentsByPostId);
});
app.post('/events', async (req, res) => {
  console.log('Received event', req.body.type);
  const { type, data } = req.body;
  if (type === 'CommentModerated') {
    const { commentId, postId, status, content } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => (comment.commentId === commentId));
    comment.status = status;

    await axios.post(`http://event-bus-srv:${ports.EVENT_BUS}/events`, {
      type: 'CommentUpdated',
      data: {
        commentId,
        status,
        postId,
        content,
      },
    });
  }
  res.send({});
});
app.listen(ports.COMMENTS, () => {
  console.log('Listening on port 4001');
});
