import axios from 'axios';
import React, { useState } from 'react';

const PostCreate = () => {
  const [title, setTitle] = useState('');

  const submitHandler = async (event) => {
    event.preventDefault();
    await axios.post('http://posts.com/posts/create', { title });
    setTitle('');
  };
  return (
    <div>
      <form onSubmit={submitHandler}>
        <div className='form-group'>
          <label>Title</label>
          {/* 2 way property binding */}
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className='form-control'
          ></input>
        </div>
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  );
};

export default PostCreate;
