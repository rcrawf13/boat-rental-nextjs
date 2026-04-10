import splashImage from "@/assets/hero-text.svg";
import homeWallpaper from "@/assets/rpedq1k2eue5cnx2rxza786m.webp";
import { staticImportSrc } from "@/lib/staticImportSrc";
import BookingButton from "@/components/shared/booking-button/BookingButton";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade'

const HomeSec = () => {
  const [emblaRef] = useEmblaCarousel({loop:true},[Autoplay(),Fade()]);
  return (
    <>
      <div
        className="wallpaper"
        style={{
          backgroundImage: `url(${staticImportSrc(homeWallpaper)})`,
        }}
      />
      <div draggable="false" className="splashItems">
          <h1 className="visually-hidden">
            Nomad Adventure Rentals boat rentals at Lake Norman near Charlotte, North Carolina
          </h1>
          <img className="heroText" src={staticImportSrc(splashImage)} alt="Nomad Adventure Rentals logo text" />
            <div ref={emblaRef} className="textCarouselRoot">
              <div className="textCarouselContainer">
                <div id="p1">
                  <p>Affordable boat rentals for every adventure.</p>
                </div>
                <div id="p2">
                  <p>Your perfect pontoon getaway starts here.</p>
                </div>
                <div id="p3">
                  <p>Smooth cruising, zero stress.</p>
                </div>
              </div>
          </div>
          <BookingButton/>
        </div>
    </>
    
    

  )
}

export default HomeSec
