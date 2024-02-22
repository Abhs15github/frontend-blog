import { Link } from "react-router-dom";
import pageNotFoundImage from "../imgs/pageNotFound.jpg";
import logo from "../imgs/original blog logo.png";

const PageNotFound = () => {
    return (
        <section className="h-screen flex flex-col items-center justify-center gap-10 p-10 text-center bg-gradient-to-b from-gray-200 to-gray-400 bg-gray-100 text-white" style={{backgroundColor: "#1c1c1c"}}>
            <img src={pageNotFoundImage} alt="Page Not Found" className="select-none border-2 border-gray-300 w-72 h-72 object-cover rounded-full mx-auto animate-pulse" />
            <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
            <p className="text-lg">Sorry, the page you're looking for cannot be found.</p>
            <Link to="/" className="text-lg hover:underline">Return to <span className="font-bold text-green-500"> Homepage </span></Link>
            <div className="flex flex-col items-center mt-10">
                <img src={logo} alt="Blog Logo" className="w-65 h-14 cursor-pointer" onClick={() => window.location.href = "/"} />
                <p className="text-sm mt-2 cursor-pointer" onClick={() => window.location.href = "/"}>Explore our blog for captivating stories!</p>
            </div>
        </section>
    );  
}

export default PageNotFound;
