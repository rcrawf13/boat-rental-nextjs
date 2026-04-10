"use client";

import { motion, useAnimate } from "motion/react";
import pontoonPic from "@/assets/PontoonBoatBlr.webp";
import { useEffect } from "react";
import ActivePriceContext from "@/context/ActivePriceContext";
import { useContext } from "react";
import { staticImportSrc } from "@/lib/staticImportSrc";
import "./pricing-mobile-boat-image.css";

/** Boat + floating price — mobile pricing section only. */
const PricingMobileBoatImage = () => {
  const [scope, animate] = useAnimate();
  const { currentPrice } = useContext(ActivePriceContext);
  useEffect(() => {
    animate(scope.current, { scale: [1, 1.2], opacity: [0, 1] }, { duration: 0.5 });
  }, [currentPrice]);

  return (
    <div className="imgPriceCon">
      <div className="imgCon">
        <div className="priceQuote">
          <p>
            <motion.span ref={scope}>{currentPrice}</motion.span>
          </p>
        </div>
        <img
          id="boatImg"
          src={staticImportSrc(pontoonPic)}
          alt="Pontoon boat ready for rental on Lake Norman"
        />
      </div>
    </div>
  );
};

export default PricingMobileBoatImage;
