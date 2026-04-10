import DurationButtons from './DurationButtons';
import BookingButton from "@/components/shared/booking-button/BookingButton";
import FadeDiv from '../../fade_div/FadeDiv';
import ImgPriceComp from "@/components/booking/components/ImgPriceComp";
import './pricesecwide.css';
type setCurrentPriceType = React.Dispatch<React.SetStateAction<string>>;

interface PriceSecWide {
  currentPrice:string;
  setCurrentPrice:setCurrentPriceType
  
}
const PriceSecWide = () => {



  return (
    <FadeDiv>
          <div className="priceWideScreenContainer">
        <div className="dynamicPricingSect">
        <h3>Pontoon Cruise</h3>
        <div className="priceImageCell priceImageCellInContent">
          <ImgPriceComp/>
        </div>
        <DurationButtons  />
        
        <div className="includedList">
          <h4>Whats Included</h4>
          <ul>
            <li>Bluetooth Speaker</li>
            <li>Life Jackets</li>
            <li>Cooler With Ice</li>
          </ul>
        </div>
        <BookingButton variant={'filled'} />
        </div>
        <div className="priceImageCell priceImageCellRight">
          <ImgPriceComp/>
        </div>
    </div>
    </FadeDiv>
  )
}

export default PriceSecWide