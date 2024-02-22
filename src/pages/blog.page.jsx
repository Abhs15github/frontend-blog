import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction.component";
import BlogPostCard from "../components/blog-post.component";
import BlogContent from "../components/blog-content.component";

export const blogStructure = {
    title: '',
    des: '',
    content: [],
    tags: [],
    author: { personal_info: { }},
    banner: '',
    publishedAt: '',
}

export const BlogContext = createContext({ });

const BlogPage = () => {
    let { blog_id } = useParams()

    const [ blog, setBlog ] = useState(blogStructure);
    const [ similarBlogs, setSimilarBlogs ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ isLikedByUser, setLikedByUser] = useState(false);

    let { title, content, banner, author: { personal_info: { fullname, username: author_username, profile_img }}, publishedAt, tags } = blog;

    const fetchBlog = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog" , { blog_id })
        .then(({ data: { blog } }) => {
            setBlog(blog)
            console.log(blog.content);


            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { tag: tags[0], limit: 6, eliminate_blog: blog_id })
            .then(({ data }) => {
                console.log(tags)
                setSimilarBlogs(data.blogs);
                console.log(data.blogs);

            })
         
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
        })
    }

    useEffect(()=> {

        resetStates();
        fetchBlog();
    }, [blog_id])

    const resetStates = () => {
        setBlog(blogStructure);
        setSimilarBlogs(null);
        setLoading(true);
    }

    return (
        <AnimationWrapper>
            {loading ? (
                <Loader />
            ) : (
                <BlogContext.Provider value={{ blog, setBlog, isLikedByUser, setLikedByUser }}>
                    <div className="max-w-[900px] mx-auto py-10 px-6 sm:px-8 lg:px-10">
                        <img src={banner} className="w-full h-auto mb-8 rounded-lg" alt="Blog Banner" />
                        <div>
                            <h2 className="text-3xl font-bold mb-4">{title}</h2>
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                    <img src={profile_img} className="w-12 h-12 rounded-full mr-2" alt="Author Profile" />
                                    <p className="text-lg">{fullname} <br /> <span className="text-gray-500">@<Link to={`/user/${author_username}`} className="underline">{author_username}</Link></span></p>
                                </div>
                                <p className="text-gray-500">Shared on {getDay(publishedAt)}</p>
                            </div>
                            </div>
                            <BlogInteraction />
                            <div className="my-12 font-gelasio blog-page-content">
                                {
                                    content[0].blocks.map((block, i) => {
                                        return <div key={i} className="my-4 md:my-8">
                                            <BlogContent block={block} />
                                            </div>
                                    })
                                }


                            </div>

                            <BlogInteraction />
                            {
                                similarBlogs != null && similarBlogs.length ? 
                                <>
                                <h1 className="text-2xl mt-14 mb-10 font-medium">You Might Also Like </h1>

                                {
                                    similarBlogs.map((blog, i) => {
                                        let { author: { personal_info  } } = blog;

                                        return <AnimationWrapper key={i} transition={{ duration: 1, delay: i* 0.08 }}>
                                             <BlogPostCard content={blog} author={personal_info} />
                                        </AnimationWrapper>
                                       
                                    })
                                }
                                </> 
                                : " "
                            }


                            
                        
                    </div>
                </BlogContext.Provider>
            )}
        </AnimationWrapper>
    )
}

export default BlogPage;
