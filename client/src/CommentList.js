import React from 'react';

const CommentList = ({ commentList }) => {
  // const [commentList, setCommentList] = useState([]);
  // const fetchComments = async () => {
  //   const res = await axios.get(
  //     `http://localhost:4001/posts/${postId}/comments`
  //   );
  //   setCommentList(res.data);
  // };
  // useEffect(() => {
  //   fetchComments();
  // }, []);
  console.log(commentList);
  const renderedComments = commentList.map((comment) => {
    if(comment.status==='approved'){
      return <li key={comment.commentId}>{comment.content}</li>;
    } else if(comment.status==='pending'){
      return <li key={comment.commentId}><em>Under moderation</em></li>;
    }else if(comment.status==='rejected'){
      return <li key={comment.commentId}><em>Comment Rejected</em></li>;
    }
  });
  return (
    <div>
      <ul>{renderedComments}</ul>
    </div>
  );
};

export default CommentList;
