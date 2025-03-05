import React, { useState } from "react";
import PropTypes from "prop-types";
import CommentSection from "./CommentSection";
import axios from "axios"
const NewsCard = ({postId, title, content, factStatus, upvotes: initialUpvotes, downvotes: initialDownvotes, comments: initialComments }) => {
  const [upvotes, setUpvotes] = useState(initialUpvotes || 0);
  const [downvotes, setDownvotes] = useState(initialDownvotes || 0);
  const [comments, setComments] = useState(initialComments || []);
  const [showComments, setShowComments] = useState(false);

  const handleAddComment = (newComment) => {
    setComments([...comments, newComment]);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };
const handleVotes=async (voteType)=>{
try {
  const response = await axios.post(`/api/news/vote/${postId}`,{voteType});
  if(!response.data.error){
    setDownvotes(response.data.downvotes);
    setUpvotes(response.data.upvotes);
  }
} catch (error) {
  console.error("error voting:", error);
}
};
  console.log("NewsCard Props:", { postId,title, content, factStatus, upvotes, downvotes, comments }); // Debugging log

  return (
    <div className="bg-white p-4 mb-4 rounded-lg shadow-md w-full">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-600">{content}</p>
      <span
        className={`inline-block mt-2 px-2 py-1 text-sm font-bold rounded ${
          factStatus === "Verified"
            ? "bg-green-100 text-green-700"
            : factStatus === "Needs Review"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {factStatus}
      </span>
      <div className="mt-3 flex items-center space-x-4">
        <button
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={()=>handleVotes('upvote')}
        >
          👍 {upvotes}
        </button>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={()=>handleVotes('downvote')}
        >
          👎 {downvotes}
        </button>
        <p
          className="text-gray-600 cursor-pointer"
          onClick={toggleComments}
        >
          💬 {comments.length} Comments
        </p>
      </div>
      {showComments && (
        <CommentSection comments={comments} onAddComment={handleAddComment} onClose={toggleComments} />
      )}
    </div>
  );
};

NewsCard.propTypes = {
 postId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  factStatus: PropTypes.string.isRequired,
  upvotes: PropTypes.number,
  downvotes: PropTypes.number,
  comments: PropTypes.arrayOf(PropTypes.string),
};

NewsCard.defaultProps = {
  upvotes: 0,
  downvotes: 0,
  comments: [],
};

export default NewsCard;