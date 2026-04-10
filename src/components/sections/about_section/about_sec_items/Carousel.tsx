import useEmblaCarousel from 'embla-carousel-react';
import cardSectionInfo from './carouselItems';
import { motion } from "motion/react";
import { staticImportSrc } from "@/lib/staticImportSrc";
const Carousel = () => {
  const [carouselRef] = useEmblaCarousel({duration:10});
  return (
    <>
      <div  ref={carouselRef} className="embla">
      <div  className="embla__container">
          {cardSectionInfo.map((itemObject)=>{
              return(
                <div key={`${itemObject.title}`} className="embla__slide">
                    <motion.img 
                    initial={{opacity:0,translateY:100}} 
                    whileInView={{translateY:0, opacity:1}} 
                    src={staticImportSrc(itemObject.image)} 
                    alt={`${itemObject.title.replace(/\s+/g, " ").trim()} icon`}
                    />

                    <h2>{itemObject.title.split('\n ').map((line,i)=>{
                      return(<span key={`title-line-${i}`} >{line}<br/></span>)
                    })}</h2>
                    <p>{itemObject.paragraph.split('\n').map((line,i)=>{
                      return(
                      <span key={`paragraph-line-${i}`}>
                        {line}
                        <br />
                      </span>)
                    })}</p>
                </div>
                  );
          })}
      </div>
      </div>
    </>

  )
}

export default Carousel