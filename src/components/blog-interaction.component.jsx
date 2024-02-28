import { useContext, useEffect, useState } from "react";
import { BlogContext } from "../pages/blog.page";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
const BlogInteraction = () => {
    const { blog, blog: { _id, title, blog_id, activity, activity: { total_likes, total_comments }, author: { personal_info: { username: author_username } } }, setBlog, isLikedByUser, setLikedByUser, setCommentsWrapper } = useContext(BlogContext);
    const { userAuth: { username, access_token } } = useContext(UserContext);
    // const [likeColor, setLikeColor] = useState(isLikedByUser ? 'red' : '#333'); // Set initial color based on like status

    useEffect(() => {
        if( access_token ){
            //server to respond on already liked posts
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/isliked-by-user", { _id }, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            .then(({ data: { result } }) => {
                setLikedByUser(Boolean(result))
            })
            .catch(err => {
                console.log(err)
            })
        }
    })

    const handleLike = () => {
        if(access_token){
            setLikedByUser(preVal => !preVal);
            const updatedTotalLikes = isLikedByUser ? total_likes - 1 : total_likes + 1;
            const updatedActivity = { ...activity, total_likes: updatedTotalLikes };
            setBlog({ ...blog, activity: updatedActivity });
    
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/like-blog", { _id, isLikedByUser }, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }    
            })
            .then(({ data }) => {
                console.log(data);
            })
            .catch(err => {
                console.log(err);
            })
        }
        else {
            toast.error("Kindly login to like the blog");
        }
    }
    

    return (
        <>
            <Toaster />
            <hr className="border-grey my-2" />
            <div className="flex gap-6 justify-between">
                <div className="flex gap-3 items-center">
                    <button onClick={handleLike} className={"w-10 h-10 rounded-full flex items-center justify-center " + ( isLikedByUser ? "bg-red/20 text-red" : "bg-grey/80" )} >
                        <i className={"fi " + ( isLikedByUser ? "fi-sr-heart" : "fi-rr-heart" )}></i>
                    </button>
                    <p className="text-xl text-dark-grey">{total_likes}</p>

                    <button onClick={() => setCommentsWrapper(preVal => !preVal)} className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
                        <i className="fi fi-rr-comment-dots"></i>
                    </button>
                    <p className="text-xl text-dark-grey">{total_comments}</p>
                </div>

                <div className="flex gap-6 items-center">
                    {username === author_username && (
                        <Link to={`/editor/${blog_id}`} className="underline hover:text-purple">Edit</Link>
                    )}
                    <a href={`https://twitter.com/intent/tweet?text=Read ${title}&url=${encodeURIComponent(window.location.href)}`} className="hover:text-twitter" style={{ color: '#00bfff' }}>
                        <i className="fi fi-brands-twitter text-xl"></i>
                    </a>
                    <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} className="hover:text-facebook" style={{ color: '#3b5998' }}>
                        <i className="fi fi-brands-facebook text-xl"></i>
                    </a>

                    <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} className="hover:text-linkedin" style={{ color: 'blue' }}>
                        <i className="fi fi-brands-linkedin text-xl"></i>
                    </a>
                </div>
            </div>

            <hr className="border-grey my-2" />
        </>
    );
}

export default BlogInteraction;
