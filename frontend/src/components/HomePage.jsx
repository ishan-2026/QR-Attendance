import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";

const images = [
    "image1.jpeg",
    "image2.jpg",
    "image3.jpg",
    "image4.jpg",
    "image5.jpg"
];

const HomePage = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Change image every 3 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative flex flex-col min-h-screen">
            {/* Navbar - Kept Above Everything */}
            <div className="absolute top-0 left-0 w-full z-50">
                <Navbar />
            </div>

            {/* Background Image Section */}
            <div 
                className="flex-grow flex flex-col justify-center items-center text-white relative"
                style={{
                    backgroundImage: `url(${images[currentImageIndex]})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    transition: "background-image 1s ease-in-out"
                }}
            >
                {/* Overlay - Ensures Text Visibility */}
                <div className="bg-black bg-opacity-50 w-full h-full absolute top-0 left-0"></div>

                {/* Content */}
                <div className="relative z-10 text-center p-6">
                    <h1 className="text-4xl font-bold mb-4">Welcome to GateMIS V 4.0 web - Attendance System</h1>
                    <p className="text-lg">Effortlessly track attendance with accuracy and ease.</p>
                    <Link to={'/qr'} 
                        className="mt-20 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg">
                        Get Started
                    </Link>
                </div>
            </div>

            {/* Footer - Fixed at the Bottom */}
            <Footer />
        </div>
    );
};

export default HomePage;