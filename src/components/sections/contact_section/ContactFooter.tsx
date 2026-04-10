/**
 * Footer for the contact section — matches site greens (#2F6F66, #55948A, #3A745C).
 * Replace placeholder email/phone with your real details.
 */
const ContactFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="contactSiteFooter" aria-label="Site footer">
      <div className="contactSiteFooter__inner">
        <div className="contactSiteFooter__brand">
          <h4 className="contactSiteFooter__title">Nomad Adventure Rentals</h4>
          <p className="contactSiteFooter__tagline">
            Pontoon cruises on Lake Norman — relax, celebrate, explore.
          </p>
        </div>

        <div className="contactSiteFooter__columns">
          <div className="contactSiteFooter__col">
            <h5 className="contactSiteFooter__heading">Visit</h5>
            <p>Lake Norman, North Carolina</p>
            <p className="contactSiteFooter__muted">
              Operating hours follow the booking calendar.
            </p>
          </div>
          <div className="contactSiteFooter__col">
            <h5 className="contactSiteFooter__heading">Contact</h5>
            <p>
              <a href="mailto:hello@nomadadventurerentals.com">
                hello@nomadadventurerentals.com
              </a>
            </p>
            <p>
              <a href="tel:+17045550199">(704) 555-0199</a>
            </p>
          </div>
          <div className="contactSiteFooter__col">
            <h5 className="contactSiteFooter__heading">Quick links</h5>
            <ul className="contactSiteFooter__links">
              <li>
                <a href="/booking">Book a cruise</a>
              </li>
              <li>
                <a href="/#pricing">Pricing</a>
              </li>
              <li>
                <a href="/#about">About us</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="contactSiteFooter__bar">
        <p className="contactSiteFooter__copyright">
          © {year} Nomad Adventure Rentals. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default ContactFooter;
