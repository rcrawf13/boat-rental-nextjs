import ContactWideScreen from "./ContactWideScreen";
import ContactFooter from "./ContactFooter";
import FadeDiv from "@/components/fade_div/FadeDiv";
import "./contact.css";

const ContactSec = () => {
  return (
    <>
      <FadeDiv>
        <ContactWideScreen />
      </FadeDiv>
      <ContactFooter />
    </>
  );
};

export default ContactSec