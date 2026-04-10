"use client";

import NavBar from "@/components/navbar/NavBar";
import SectionBase from "@/components/SectionBase";
import { Link, Element } from "react-scroll";
const Root = () => {
    const navButtonOptions: string[] = ["Home","About Us", "Pricing","Contact"];

return (
        <>
            <NavBar Link={Link} navButtonOptions={navButtonOptions} />
            {navButtonOptions.map((navButtonOption)=>
            <SectionBase
            Element={Element}
            key={navButtonOption} 
            navButtonOption={navButtonOption} />)
            }
        </>
)

}

export default Root
