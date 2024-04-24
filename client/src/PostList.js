import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

const PostList = () => {
  const [posts, setPosts] = useState({});
  const fetchPosts = async () => {
    const res = await axios.get('http://posts.com/posts');
    setPosts(res.data);
  };
  useEffect(() => {
    fetchPosts();
  }, []);
  console.log({ posts });
  const renderedPosts = Object.values(posts).map((post) => {
    return (
      <div
        key={post.id}
        className='card'
        style={{ width: '30%', marginBottom: '20px' }}
      >
        <div className='card-body'>
          <h3>{post.title}</h3>
        </div>
        <CommentCreate postId={post.id} />
        <CommentList postId={post.id} commentList={post.comments}/>
      </div>
    );
  });
  return (
    <div className='d-flex flex-wrap flex-row iustify-content-between'>
      {renderedPosts}
    </div>
  );
};

export default PostList;
