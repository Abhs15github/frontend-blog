import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../App";
import CommentField from "./comment-field.component";

const CommentCard = ({ index, leftVal, commentData }) => {
    const { commented_by: { personal_info: { profile_img, fullname, username } }, commentedAt, comment, _id } = commentData;
    const { userAuth: { access_token } } = useContext(UserContext);
    const [isReplying, setReplying] = useState(false);

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
                    <p className="text-lg mt-2">{comment}</p>
                    <div className="flex justify-end mt-2">
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



