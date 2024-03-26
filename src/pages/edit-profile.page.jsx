import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../App";
import axios from "axios";
import { profileDataStructure } from "./profile.page";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import toast, { Toaster } from 'react-hot-toast'; // Assuming Toaster is imported from react-hot-toast

import InputBox from "../components/input.component";
import { uploadImage } from "../common/aws";
import { storeInSession } from "../common/session";

const EditProfile = () => { 
    let { userAuth, userAuth: { access_token }, setUserAuth } = useContext(UserContext);

    let bioLimit = 100;

    let profileImgEle = useRef();

    let editProfileForm = useRef();

    

    const [profile, setProfile] = useState(profileDataStructure);
    const [loading, setLoading] = useState(true);
    const [ charactersLeft, setCharactersLeft ] = useState(bioLimit);
    const [ updatedProfileImg, setUpdatedProfileImg ] = useState(null);

    let { personal_info: { fullname, username: profile_username, profile_img, email, bio }, social_links } = profile;

    useEffect(() => {
        if (access_token) {
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", { username: userAuth.username })
                .then(({ data }) => {
                    setProfile(data);
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                });
        }

    }, [access_token]);

    const handleCharacterChange = (e) => {
        setCharactersLeft(bioLimit - e.target.value.length)
    }

    const handleImagePreview = (e) => {
        let img = e.target.files[0];

        profileImgEle.current.src = URL.createObjectURL(img);
        setUpdatedProfileImg(img);
    }

    const handleImageUpload = (e) => {
        e.preventDefault();

        if(updatedProfileImg){

            let loadingToast = toast.loading("Uploading");
            e.target.setAttribute("disabled", true);

            uploadImage(updatedProfileImg)
            .then(url => {

                if(url){
                    axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile-img", { url }, {
                        headers: {
                            'Authorization': `Bearer ${access_token}`
                        }
                    })
                    .then(({ data }) => {
                        let newUserAuth = { ...userAuth, profile_img: data.profile_img }

                        storeInSession("user", JSON.stringify(newUserAuth));
                        setUserAuth(newUserAuth);

                        setUpdatedProfileImg(null);

                        toast.dismiss(loadingToast)
                        e.target.removeAttribute("disabled");
                        toast.success("Image Uploaded successfully");

                    })
                }
               
            })

            .catch(err => {
                toast.dismiss(loadingToast);
                e.target.removeAttribute("disabled");
                toast.error(response.data.error);
            })

        }
    }

    const handleSubmit = (e) =>{
        e.preventDefault();

        let form = new FormData(editProfileForm.current);

        let formData = { };

        for(let [key, value] of form.entries()){
            formData[key] = value;    
            }
            let { username, bio, youtube, articles } = formData;

            if(username.length < 2){
                return toast.error("Please enter accurate username")
            }
            if(bio.length > bioLimit){
                return toast.error(`Bio should not be more than ${bioLimit}`)
            }

            let loadingToast = toast.loading("Updating..");
            e.target.setAttribute("disabled", true);

            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/update-profile", { username, bio},
            {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            .then(({ data }) => {
                if(userAuth.username!= data.username){
                    let newUserAuth = { ...userAuth, username: data.username };

                    storeInSession("user", JSON.stringify(newUserAuth));
                    setUserAuth(newUserAuth)
                }

                toast.dismiss(loadingToast);
                e.target.removeAttribute("disabled");
                toast.success("Profile Updated")
            })
            .catch(({ response }) => {
                toast.dismiss(loadingToast);
                e.target.removeAttribute("disabled");
                toast.error(response.data.error)
            })

    }
 
 
    return (
        <AnimationWrapper>
            {loading ? <Loader /> :
                <form ref={editProfileForm}>
                    <Toaster /> {/* Assuming Toaster is used for notifications */}
                    <h1 className="max-md:hidden"> Edit profile</h1>
                    <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
                        <div className="max-lg:center mb-5">
                        <label htmlFor="uploadImg" id="profileImgLabel" className="relative block w-48 h-48 bg-grey rounded-full overflow-hidden">
                            <div className="w-full h-full absolute top-0 left-0 flex items-center justify-center text-white bg-black/30 opacity-0 hover:opacity-20 cursor-pointer"> Upload Image
                            </div>

                            <img ref={profileImgEle} src={profile_img} /> 
                        </label>
                        
                       
                        <input type="file" id="uploadImg" accept=".jpeg, .png, .jpg" hidden onChange={handleImagePreview} />
                        <button className="btn-light mt-5 max-lg:center lg:w-full px-10" onClick={handleImageUpload}> Upload</button>
                    </div>

                    <div className="w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                            <div>
                                <InputBox name="fullname" type="text" value={fullname} placeholder="Your name" disable={true} icon="fi-rr-user" />
                            </div>

                        <div>
                            <InputBox name="email" type="email" value={email} placeholder="Email Id" disable={true}
                            icon="fi-rr-envelope"/>
                        </div>
                        </div>

                        <InputBox type="text" name="username" value={profile_username} placeholder="Username" icon="fi-rr-at" />

                        <p className="text-dark-grey -mt-3">Who is writing!</p>

                        <textarea name="bio" maxlength={bioLimit} defaultValue={bio} className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pl-5" placeholder="Describe yourself in best 100 words" onChange={handleCharacterChange}></textarea>

                        <p className="mt-1 text-dark-grey"> { charactersLeft } Characters Left</p>

                        <button className="btn-dark w-auto px-10" type="submit" onClick={handleSubmit}> Update </button>

                        

                        </div>
                    </div>
                </form>
            }
        </AnimationWrapper>
    );
}

export default EditProfile;
