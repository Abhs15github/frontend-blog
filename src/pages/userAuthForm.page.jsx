import { useRef, useContext } from "react";
import AnimationWrapper from "../common/page-animation";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {
  const authForm = useRef();
  let { userAuth: { access_token }, setUserAuth } = useContext(UserContext)
  
  console.log(access_token);

  const userAuthThroughServer = (serverRoute, formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data); // Update userAuth context after successful authentication
      })
      .catch(({ response }) => {
        toast.error(response.data.error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const serverRoute = type === "sign-in" ? "/signin" : "/signup";

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    const form = new FormData(authForm.current);
    const formData = Object.fromEntries(form.entries());

    if (formData.fullname && formData.fullname.length < 3) {
      return toast.error("Please enter your complete name");
    }

    if (formData.email && !emailRegex.test(formData.email)) {
      return toast.error("Please enter a valid email address");
    }

    if (!passwordRegex.test(formData.password)) {
      return toast.error(
        "Please enter a valid password. It must contain at least one digit, one lowercase letter, one uppercase letter, and be at least 6 characters long."
      );
    }
  
    userAuthThroughServer(serverRoute, formData)

  }

  const handleGoogleAuth = (e) => {
    e.preventDefault();

    authWithGoogle().then(user => {
      
      let serverRoute = "/google-auth";

      let formData = {
        access_token: user.accessToken
      }

      userAuthThroughServer(serverRoute, formData)
    })
    .catch(err => {
      toast.error('Something went wrong');
      return console.log(err)
    })
  }



  return (
    access_token ? <Navigate to="/" />
:
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <Toaster position="top-center" />

        <form ref={authForm} className="w-[80%] max-w-[400px]">
          <h1 className="text-2xl font-gelasio capitalize text-center mb-24">
            {type === "sign-in"
              ? "Welcome Back to Our Blogging Community! "
              : "Join us today"}
          </h1>

          {type !== "sign-in" && (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Enter your full name"
              icon="fi-rr-user-add"
              
            />
          )}

          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope-download"
          />

          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-rr-lock"
          />

          <button
            className="btn-dark center mt-14"
            type="submit"
            onClick={handleSubmit}
          >
            {type.replace("-", " ")}
          </button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center" onClick={handleGoogleAuth}>
            <img src={googleIcon} className="w-5" alt="Google Icon" />
            Continue with Google
          </button>

          {type === "sign-in" ? (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Don't have an account?{" "}
              <Link to="/signup" className="underline text-black text-xl ml-1">
                Join us today
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-dark-grey text-xl text-center">
              Already a member?{" "}
              <Link to="/signin" className="underline text-black text-xl ml-1">
                Sign in here
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
