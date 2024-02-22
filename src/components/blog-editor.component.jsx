import React, { useContext, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import logo from "../imgs/original blog logo.png";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { uploadImage } from "../common/aws";
import { Toaster, toast } from "react-hot-toast";
import { tools } from "./tools.component";
import axios from "axios";
import { UserContext } from "../App";

const BlogEditor = () => {

  let { blog, blog: { title, banner, content, tags, des}, setBlog, textEditor, setTextEditor, setEditorState } = useContext(EditorContext);
  
  let { userAuth: { access_token } } = useContext(UserContext)
  let { blog_id } = useParams(); 
  let navigate = useNavigate();

  const handleBannerUpload = (e) => {
    let img = e.target.files[0];
  
    if (img) {
      let loadingToast = toast.loading("Your banner image is getting uploaded");
      uploadImage(img)
        .then((url) => {
          if (url) {
            toast.dismiss(loadingToast);
            toast.success("Successfully uploaded");
            setBlog({ ...blog, banner: url }); // Update the blog banner URL in state
          } else {
            toast.error("Failed to upload the image");
          }
        })
        .catch((err) => {
          toast.dismiss(loadingToast);
          toast.error(`Error uploading image: ${err.message}`);
        });
    }
  };
  
  useEffect(() => {
    if (!textEditor.isReady) {
      const initializeEditor = async () => {
        try {
          setTextEditor(new EditorJS({
            holder: "textEditor",
            tools: tools, 
            data: Array.isArray(content) ? content[0] : content, 
            placeholder: "Words do have impact! Let's start blogging"
          }));
        } catch (error) {
          console.error("Error initializing EditorJS:", error);
        } 
      };
  
      initializeEditor();
    }
  }, []);

  const handlePublishEvent = () => {
    if (!blog.banner.length) {
      return toast.error("Kindly upload the banner as well");
    }

    if (!blog.title.length) {
      return toast.error("Blog title is missing");
    }

    if (textEditor.isReady) {
      textEditor.save().then(data => {
        if (data.blocks.length) {
          setBlog({ ...blog, content: data });
          setEditorState("publish");
        } else {
          return toast.error("Blog can't be empty");
        }
      }).catch((err) => {
        console.log(err);
      });
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
  };

  const handleTitleChange = (e) => {
    let input = e.target;

    input.style.height = 'auto';
    input.style.height = input.scrollHeight + "px"; 

    setBlog({ ...blog, title: input.value });
  };

  const handleError = (e) => {
    let img = e.target;
    
    img.src = defaultBanner;
  };

  const handleSaveDraft = (e) => {
    if (e.target.classList.contains("disable")) {
      return;
    }

    if (!blog.title.length) {
      return toast.error("At least provide title for saving it in draft");
    }

    let loadingToast = toast.loading("Saving your draft");

    e.target.classList.add('disable');

    if (textEditor.isReady) {
      textEditor.save().then(content => {
        let blogObj = {
          title: blog.title, 
          banner: blog.banner, 
          des: blog.des, 
          content: content, 
          tags: blog.tags, 
          draft: true
        }

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", { ...blogObj, id: blog_id },{ 
          headers: {
            'Authorization': `Bearer ${access_token}`
          }
        }).then(() => {
          e.target.classList.remove('disable');
          toast.dismiss(loadingToast);
          toast.success("Post saved to draft");

          setTimeout(() => {
            navigate("/");
          }, 500);
        }).catch(({ response }) => {
          e.target.classList.remove('disable');
          toast.dismiss(loadingToast);
          return toast.error(response.data.error);
        });
      });
    }
  };

  return (
    <>
      <nav className="navbar" style={{ backgroundColor: '#1c1c1c' }}>
        <Link to="/" className="flex-none w-50">
          <img
            src={logo}
            style={{ width: '13vw', height: 'auto' }}
            alt="Logo"
          />
        </Link>

        <p className="max-md:hidden text-white line-clamp-1 w-full">
          {blog.title.length ? blog.title : "New Blog"}
        </p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2" onClick={handlePublishEvent}>Publish</button>

          <button className="btn-light py-2" onClick={handleSaveDraft}>Save Draft</button>
        </div>
      </nav>
      <Toaster />

      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">

            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img 
                  src={blog.banner}
                  className="z-20"
                  onError={handleError}
                />
                <input
                  id="uploadBanner"
                  type="file" 
                  accept=".png, .jpg, .jpeg"
                  hidden  
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <textarea
              defaultValue={blog.title}
              placeholder="blog title"
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight 
              placeholder:opacity-40"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            />

            <hr className="w-full opacity-10 my-5" />

            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
