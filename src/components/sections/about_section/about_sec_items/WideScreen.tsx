import cardSectionInfo from './carouselItems';
import FadeDiv from '../../../fade_div/FadeDiv';
import './about.css'; 
import { staticImportSrc } from "@/lib/staticImportSrc";

const WideScreen = () => {


  return (
      <FadeDiv>
        <div className="wideScreenContainer">
        <div className="img-text-con">
          <div className="imgCon"></div>
          <div className="textElements">
            <h2 style={{textAlign:'center',width:'100%',fontSize:'1.3rem',fontWeight:'500'}}>About Us</h2>
            <p>
Every outing should feel like a getaway. That’s why we’re dedicated to providing a seamless rental experience and a comfortable space for you to unwind, celebrate, or explore.
            </p>
          </div>
        </div>

        <div className="perks-cont">
          {cardSectionInfo.map((itemObject,index)=>{
            return (
              <div key={index} className="card">
                <img
                  src={staticImportSrc(itemObject.image)}
                  alt={`${itemObject.title.replace(/\s+/g, " ").trim()} icon`}
                />
                <h3>
                  {itemObject.title}
                </h3>
                <p>{itemObject.paragraph}</p>

              </div>
            )
          })}
        </div>
      </div>
      </FadeDiv>
  )
}

export default WideScreen