"use client";

import pontoonImg from '@/assets/PontoonBoatBlr.webp'
import ActivePriceContext from '@/context/ActivePriceContext';
import { useContext } from 'react';
import { staticImportSrc } from '@/lib/staticImportSrc';
import './ImgPriceComp.css';

const ImgPriceComp = () => {
    const {currentPrice} = useContext(ActivePriceContext);

    return (
    <div id="frame" className="imgPriceComp-root">
        <div className="imgPriceComp-inner imgAndPrice" style={{ fontFamily: '"Roboto Serif", serif', fontOpticalSizing: 'auto' }}>
            <div id="price" style={{position:'absolute',left:'2.25%',top:'4%', backgroundColor:'#FFFFFF',padding:'.5rem',borderRadius:'100px',width:'100px',display:'flex',justifyContent:'center',boxShadow:'var(--home-text-shadow)'}}>
                {currentPrice}
            </div>
        <img
        className="imgPriceComp-img"
        src={staticImportSrc(pontoonImg)}
        alt="Pontoon boat available for rental at Lake Norman"
        />
        </div>
    </div>
  )
}

export default ImgPriceComp