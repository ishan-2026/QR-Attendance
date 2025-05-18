import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <img className="h-10 w-auto" src="BusinessCardLogo.jpg" alt="Logo" />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;