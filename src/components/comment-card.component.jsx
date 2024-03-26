import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../App";
import CommentField from "./comment-field.component";
import { BlogContext } from "../pages/blog.page";
import axios from "axios";
const getTimeDifference = (commentedAt) => {
    const currentDate = new Date();
    const commentDate = new Date(commentedAt);
    const difference = currentDate - commentDate;
    const seconds = Math.floor(difference / 1000);

    if (seconds < 60) {
        return Math.floor(seconds) + " seconds ago";
    }
    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
        return minutes + " minutes ago";
    }
    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
        return hours + " hours ago";
    }
    const days = Math.floor(hours / 24);

    if (days < 30) {
        return days + " days ago";
    }
    const months = Math.floor(days / 30);

    if (months < 12) {
        return months + " months ago";
    }
    const years = Math.floor(months / 12);

    return years + " years ago";
};

const CommentCard = ({ index, leftVal, commentData }) => {
    const { commented_by: { personal_info: { profile_img, fullname, username } }, commentedAt, comment, _id, children } = commentData;

    const { blog, blog: { comments, comments: { results: commentsArr}}, setBlog} = useContext(BlogContext)
    const { userAuth: { access_token } } = useContext(UserContext);
    const timeDifference = getTimeDifference(commentedAt);

    const [isReplying, setReplying] = useState(false);

    const removeCommentsCards = (startingPoint) => {
        if(commentsArr[startingPoint]){

            while( commentsArr[startingPoint].childrenLevel > commentData.childrenLevel ){
                commentsArr.splice(startingPoint, 1);

                if(!commentsArr[startingPoint]){
                    break;
                }
            }
        }

        setBlog({ ...blog, comments: { results: commentsArr}})
        
    }

    const loadReplies = ({ skip = 0}) => {
        if(children.length){

            hideReplies();

            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-replies", { _id, skip })
            .then(({ data: { replies } }) => {
                commentData.isReplyLoaded = true;

                for( let i = 0; i< replies.length; i++){
                    replies[i].childrenLevel = commentData.childrenLevel + 1;

                    commentsArr.splice(index + 1 + i + skip, 0, replies[i])
                }

                setBlog({ ...blog, comments: { ...comments, results: commentsArr} })
            })
            .catch(err => {
                console.log(err);
            })
        }


    }

    const hideReplies = () => {
        commentData.isReplyLoaded = false;

        removeCommentsCards(index + 1)
    }

    const handleReplyClick = () => {
        if (!access_token) {
            return toast.error("Kindly login to reply");
        }

        setReplying(true);
    };

    return (
        <div className="w-full" style={{ paddingLeft: `${leftVal * 10}px` }}>
            <div className="bg-white rounded-lg p-4 mb-4 flex items-start">
                <img src={profile_img} className="w-12 h-12 rounded-full mr-3" alt="Profile" />
                <div className="flex-grow">
                    <p className="font-semibold">{fullname}</p>
                    <p className="text-gray-500">@{username}</p>
                    <p className="text-gray-500">{timeDifference}</p>

                    <p className="text-lg mt-2">{comment}</p>
                    <div className="flex justify-end mt-2">
                    {
    commentData.isReplyLoaded ? (
        <button className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2" onClick={hideReplies}>
            <i className="fi fi-rs-comment-dots"></i>
            Hide Reply
        </button>
    ) : (
        <button className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2" onClick={loadReplies}>
            <i className="fi fi-rs-comment-dots"></i>{children.length} Reply
        </button>
    )
}
                        <button className="text-blue-500 hover:underline focus:outline-none" onClick={handleReplyClick}>
                            Reply
                        </button>
                    </div>
                    {
                        isReplying ?
                        <div className="mt-8">
                            <CommentField action="reply" index={index} replyingTo={_id} setReplying={setReplying} />
                        </div> : ""
                    }
                </div>
            </div>
        </div>
    );
};

export default CommentCard;






