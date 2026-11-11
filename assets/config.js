/* =====================================================================
   THE 8 METHOD · SITE CONFIG  (the only file you need to edit)
   ---------------------------------------------------------------------
   FORM_ENDPOINT  Paste the "form action" URL from your email service.
                  Leave it empty ("") to keep the form in DEMO MODE:
                  emails are validated, the thank-you state is shown,
                  and NOTHING is stored or sent anywhere.
                  The service is detected automatically from the URL:
                    Brevo       https://xxxxxxxx.sibforms.com/serve/XXXXXXXX...
                    MailerLite  https://assets.mailerlite.com/jsonp/123456/forms/123456789/subscribe
                    Formspree   https://formspree.io/f/abcdwxyz
   INSTAGRAM_URL / FACEBOOK_URL
                  Full profile links. While empty, the buttons show
                  "Coming soon" instead of a broken link.
   THANK_YOU_REDIRECT
                  false = show the thank-you message in the page (default)
                  true  = send people to thank-you.html after signing up
   ===================================================================== */
window.EIGHT_CONFIG = {
  FORM_ENDPOINT: "",
  INSTAGRAM_URL: "",
  FACEBOOK_URL: "",
  THANK_YOU_REDIRECT: false
};
