import axios from 'axios';
import React, { useState } from 'react';

const CommentCreate = ({ postId }) => {
  const [content, setContent] = useState('');

  const submitHandler = async (event) => {
    event.preventDefault();
    await axios.post(`http://posts.com/posts/${postId}/comments`, {
      content,
    });
    setContent('');
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div className='form-group'>
          <label>Title</label>
          {/* 2 way property binding */}
          <input
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
            className='form-control'
          ></input>
        </div>
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  );
};

export default CommentCreate;
