const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white py-4 w-full">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center">
                {/* Company Name */}
                <span className="text-lg font-semibold">Sachin Gijavanekar And Company</span>

                {/* Copyright Info */}
                <span className="text-sm opacity-75">
                    © {new Date().getFullYear()} All rights reserved.
                </span>
            </div>
        </footer>
    );
};

export default Footer;