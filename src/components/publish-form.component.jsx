import { Toaster, toast } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import { useContext, useState } from "react";
import { EditorContext } from "../pages/editor.pages";
import Tag from './tags.component';
import axios from "axios";
import { UserContext } from "../App";
import { useNavigate, useParams } from "react-router-dom";


const PublishForm = () => {
    let characterLimit = 250;
    let tagLimit = 10;

    let { blog_id } = useParams();

    const { blog, setEditorState, setBlog } = useContext(EditorContext);
    const [blogTitle, setBlogTitle] = useState(blog.title);
    const [blogDescription, setBlogDescription] = useState(blog.des);

    const { blog: { banner, title, tags, des, content } } = useContext(EditorContext);

    let { userAuth: { access_token } } = useContext(UserContext);

    let navigate = useNavigate();


    const handleCloseEvent = () => {
        setEditorState("editor");
    };

    const handleBlogTitleChange = (e) => {
        setBlogTitle(e.target.value);
        setBlog({ ...blog, title: e.target.value });
    };

    const handleBlogDescriptionChange = (e) => {
        setBlogDescription(e.target.value);
        setBlog({ ...blog, des: e.target.value });
    };

    const handleTitleKeyDown = (e) => {
        if (e.keyCode == 13) {
            e.preventDefault();
        }
    }


    const handleKeyDown = (e) => {
        if(e.keyCode == 13 || e.keyCode == 188){
            e.preventDefault();

            let tag = e.target.value;

            if(tags.length < tagLimit){
                if(!tags.includes(tag) && tag.length){
                    setBlog({ ...blog, tags: [ ...tags, tag ]})
                }
            } else{
                toast.error(`You are excedding Tag limit. Only  ${tagLimit} Tags are allowed`)
            }
            e.target.value = "";
          
        }
    }

    const publishBlog = (e) => {
        if(e.target.className.includes("disable")){
            return;
        }

        if(!title.length) {
            return toast.error("Kindly update the title before publishing")
        }

        if(!des.length || des.length > characterLimit){
            return toast.error(`Kindly add some description about your blog ${characterLimit} characters to publish`)
        }

        if(!tags.length){
            return toast.error("Enter at least 1 tag to increase your blog reach")
        }

        let loadingToast = toast.loading("Publishing...");

        e.target.classList.add('disable');
        let blogObj = {
            title, banner, des, content, tags, draft: false
        }

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", { ...blogObj, id: blog_id }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        .then(() => {
            e.target.classList.remove('disable');

            toast.dismiss(loadingToast)
            toast.success("Post Published succesfully");

            setTimeout(() => {
                navigate("/")
            }, 500);
        })
        .catch(({ response }) => {
            e.target.classList.remove('disable');
            toast.dismiss(loadingToast);
            return toast.error(response.data.error);
          })
          


    }


    return (
        <AnimationWrapper>    
            <section className="w-secret min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
                <Toaster />

                <button className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]"
                onClick={handleCloseEvent}>
                    <i className="fi fi-br-cross"> </i>
                </button>

                <div className="max-w-[550px] center">
                    <p className="text-dark-grey mb-1"> Preview </p>
                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
                        <img src={blog.banner} alt="Banner" />
                    </div>

                    <h1 className="text-4xl font-medium mt-2 leading-tight lin-clamp-2">{blogTitle}</h1>

                    <p className="font-gelasio line-clamp-2 text-xl leading-7 mt-4">{blogDescription}</p>
                </div>

                <div className="border-grey lg:border-1 lg:pl-8">
                    <p className="text-dark-grey mb-2 mt-9"> Blog Title </p>
                    <input type="text" placeholder="Blog Title" 
                    value={blogTitle} className="input-box pl-4" 
                    onChange={handleBlogTitleChange} />

                    <p className="text-dark-grey mb-2 mt-9"> Brief on your Topic </p>

                    <textarea
                         maxLength={characterLimit}
                         value={blogDescription}
                         className="h-40 resize-none leading-7 input-box pl-4"
                         onChange={handleBlogDescriptionChange}
                         onKeyDown={handleTitleKeyDown}    
                    >
                    </textarea>

                    <p className="mt-1 text-dark-grey text-sm text-right">{ characterLimit - blogDescription.length } characters left </p>
                    <p className="text-dark-grey mb-2 mt-9"> Topics - ( Helps is searching and ranking your blog post )</p>

                    <div className="relative input-box pl-2 py-2 pb-4">
                        <input type="text" placeholder="Topic" className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white "
                        onKeyDown={handleKeyDown}
                         />
                        {
                            tags.map((tag, i) => {
                                return <Tag tag={tag} tagIndex={i} key={i} />
                            })
                        }

                    </div>

                    <p className="mt-1 mb-4 text-dark-grey text-right"> { tagLimit - tags.length } Tags Left </p>

                    <button className="btn-dark px-8" onClick={publishBlog}> Publish </button>


                </div>
            </section>
        </AnimationWrapper>
    )
}


export default PublishForm;
