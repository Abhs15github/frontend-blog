import React, { useContext, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../imgs/original blog logo.png";
import { UserContext } from "../App";
import UserNavigationPanel from "./user-navigation.component";

const Navbar = () => {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const [ userNavPanel, setUserNavPanel ] = useState(false);

  let navigate = useNavigate();

  const { userAuth, userAuth: { access_token, profile_img } } = useContext(UserContext);

  const handleUserNavPanel = () => {
    setUserNavPanel(currentVal => !currentVal);
  }

  const handleSearch =(e) => {
    let query = e.target.value;
 

    if(e.keyCode == 13 && query.length){
      navigate(`/search/${query}`);
    }
  }

  

  const handleBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false);
    }, 200);
    
  }

  const toggleSearchBox = () => {
    setSearchBoxVisibility((prevVisibility) => !prevVisibility);
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

      <div
        className={`absolute bg-#cccccc w-full left-0 top-full mt-0.5 border-b   border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto ${
          searchBoxVisibility ? "block" : "hidden"
        }`}
      >
        <input
          type="text"
          placeholder="Search"
          className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder-text-dark-grey md:pl-12"
          onKeyDown={handleSearch}
        />

        
        <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
      </div>

      <div className="flex items-center gap-3 md:gap-6 ml-auto">
        <button
          className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
          onClick={toggleSearchBox}
        >
          <i className="fi fi-rr-search text-xl"></i>
        </button>


    <Link to="editor" className="hidden md:flex gap-2 link">
        <i className="fi-rr-file-edit"></i>
        <p style={{ color: '#FFFFFF' }}>Create a Post</p>

         </Link>

         {access_token ? (
  // User is logged in
  <>
    <Link to="/dashboard/notification">
      <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-white/20"> 
        <i className="fi fi-rr-bell"></i>
      </button>
    </Link>

    <div className="relative" onClick={handleUserNavPanel} onBlur={handleBlur}>
      <button className="w-12 h-12 mt-1">
        <img src={profile_img} className="w-full h-full object-cover rounded-full" alt="User Profile" />
      </button>
      {
        userNavPanel ? <UserNavigationPanel /> : "" 
      }
    </div>
  </>
) : (
  // User is not logged in
  <>
    <Link className="btn-dark py-2" to="/signin">
      Sign In
    </Link>
    <Link className="btn-light py-2 hidden md:block" to="/signup">
      Sign up
    </Link>
  </>
)}

    

         
      </div>
    </nav>


<Outlet />

</>
  );
};




export default Navbar;
