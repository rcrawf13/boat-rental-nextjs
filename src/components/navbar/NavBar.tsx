"use client";

import { useEffect } from "react";
import './navbar.css';

interface NavBarProps {
    navButtonOptions: string[];
    Link: React.ElementType;
}

const NavBar = ({navButtonOptions, Link}:NavBarProps) => {

        useEffect(() => {
        // Ensure we're at the top of the page
        window.scrollTo(0, 1);

    }, []);




    return (
        <>
            <nav className="navConatiner">
                {navButtonOptions.map((navOption:string) => {
                    return(
                        <Link 
                            smooth={true} 
                            activeClass="active" 
                            spy={true} 
                            to={navOption} 
                            key={navOption}
                            duration={100}
                            hashSpy={true}
                        >
                            {navOption}
                        </Link>
                    );   
                })}
            </nav>
        </>
    )
}

export default NavBar