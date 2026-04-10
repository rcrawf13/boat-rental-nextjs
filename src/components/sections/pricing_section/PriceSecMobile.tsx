import DurationButtons from './DurationButtons';
import BookingButton from "@/components/shared/booking-button/BookingButton";
import PricingMobileBoatImage from "./PricingMobileBoatImage";



const PriceSecMobile = () => {

  return (
      <div className="mobile-content-container">
        <h3>Pontoon Cruise</h3>
        <div className="priceQuoteCont">
        <PricingMobileBoatImage />
        </div>
        <DurationButtons/>
        
        <div className="includedList">
          <h4>Whats Included</h4>
          <ul>
            <li>Bluetooth Speaker</li>
            <li>Life Jackets</li>
            <li>Cooler With Ice</li>
            <li>Free Cancellations <small>(24hrs)</small></li>
          </ul>
        </div>

        <BookingButton variant={'filled'} />

      </div>  )
}

export default PriceSecMobile