import { Link } from "react-router-dom";
import pageNotFoundImage from "../imgs/logo-for-blog-jbj.jpg";

const PageNotFound = () => {
    return (
        <section className="h-screen flex flex-col items-center justify-center p-10 text-center bg-gray-100 text-gray-800">
            <img src={pageNotFoundImage} alt="Page Not Found" className="w-64 h-64 object-cover rounded-full mx-auto animate-pulse" />
            <h1 className="text-4xl font-bold mt-8">Oops! Page Not Found</h1>
            <p className="text-lg mt-4">The page you're looking for seems to be missing.</p>
            <Link to="/" className="text-lg mt-8 hover:underline">
                Return to <span className="text-blue-800 font-bold">Homepage</span>
            </Link>
            <div className="flex flex-col items-center mt-10">
                <p className="text-sm">Explore our blog for captivating stories!</p>
            </div>
        </section>
    );  
}

export default PageNotFound;
