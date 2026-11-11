(function () {
  "use strict";
  var C = window.EIGHT_CONFIG || {};
  var ENDPOINT = (C.FORM_ENDPOINT || "").trim();
  var root = document.documentElement;
  root.classList.remove("no-js");

  function provider(url) {
    if (!url) return "demo";
    if (/sibforms\.com|brevo\.com|sendinblue/i.test(url)) return "brevo";
    if (/mailerlite\.com/i.test(url)) return "mailerlite";
    if (/formspree\.io/i.test(url)) return "formspree";
    return "generic";
  }
  var PROVIDER = provider(ENDPOINT);
  var base = document.body.getAttribute("data-base") || "";

  /* ---------- social links (single config spot) ---------- */
  document.querySelectorAll("[data-social]").forEach(function (a) {
    var key = a.getAttribute("data-social");
    var url = (key === "instagram" ? C.INSTAGRAM_URL : C.FACEBOOK_URL) || "";
    if (url) {
      a.href = url; a.target = "_blank"; a.rel = "noopener";
      a.classList.remove("is-soon", "soon");
      var s = a.querySelector("[data-soon]"); if (s) s.textContent = s.getAttribute("data-live") || "";
    } else {
      a.removeAttribute("href"); a.setAttribute("aria-disabled", "true");
      a.classList.add(a.classList.contains("lbtn") ? "is-soon" : "soon");
    }
  });

  /* ---------- nav ---------- */
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () { nav.classList.toggle("solid", window.scrollY > 40); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- reveal on scroll ---------- */
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add("in"); }); }

  /* ---------- breathing guide ---------- */
  var bl = document.querySelector(".breath .lbl");
  if (bl && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var phases = [["Breathe in", 4000], ["Breathe out", 8000]], i = 0;
    (function tick() {
      bl.style.opacity = 0;
      setTimeout(function () { bl.textContent = phases[i][0]; bl.style.opacity = 1; }, 300);
      var d = phases[i][1]; i = (i + 1) % 2; setTimeout(tick, d);
    })();
  }

  /* ---------- waitlist forms ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  document.querySelectorAll("form.signup").forEach(function (form) {
    var box = form.closest("[data-signup-box]") || form.parentNode;
    var emailIn = form.querySelector("input[type=email]");
    var nameIn = form.querySelector("input[name=name]");
    var msg = form.querySelector(".form-msg");
    var hp = form.querySelector(".hp input");
    var demoFlag = box.querySelector(".demo-flag");
    if (demoFlag && PROVIDER !== "demo") demoFlag.remove();

    function say(text, err) { msg.textContent = text; msg.classList.toggle("err", !!err); }
    emailIn.addEventListener("input", function () { form.classList.remove("is-invalid"); emailIn.removeAttribute("aria-invalid"); say(""); });

    function success() {
      if (C.THANK_YOU_REDIRECT) { window.location.href = base + "thank-you.html"; return; }
      box.classList.add("done");
      var t = box.querySelector(".thanks"); if (t) { t.setAttribute("tabindex", "-1"); t.focus({ preventScroll: true }); }
    }

    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var email = emailIn.value.trim();
      var name = nameIn ? nameIn.value.trim() : "";
      if (!EMAIL_RE.test(email)) {
        form.classList.add("is-invalid"); emailIn.setAttribute("aria-invalid", "true");
        say(email ? "That email doesn't look quite right. Please check it." : "Please enter your email to join the waitlist.", true);
        emailIn.focus(); return;
      }
      if (hp && hp.value) { success(); return; } // bot trap: pretend success
      form.classList.add("loading"); say("Adding you to the list");

      var req;
      if (PROVIDER === "demo") {
        req = new Promise(function (r) { setTimeout(r, 900); });        // DEMO: nothing stored or sent
      } else if (PROVIDER === "formspree" || PROVIDER === "generic") {
        var fd = new FormData(); fd.append("email", email); if (name) fd.append("name", name); fd.append("source", "the-8-method-waitlist");
        req = fetch(ENDPOINT, { method: "POST", body: fd, headers: { Accept: "application/json" } })
          .then(function (r) { if (!r.ok) throw new Error("status " + r.status); });
      } else {
        var p = new URLSearchParams();
        if (PROVIDER === "brevo") {
          p.append("EMAIL", email); if (name) p.append("FIRSTNAME", name);
          p.append("email_address_check", ""); p.append("locale", "en");
        } else { // mailerlite
          p.append("fields[email]", email); if (name) p.append("fields[name]", name);
          p.append("ml-submit", "1"); p.append("anticsrf", "true");
        }
        // Embedded-form endpoints don't expose CORS responses; the request is delivered as a normal form post.
        req = fetch(ENDPOINT, { method: "POST", mode: "no-cors", body: p });
      }
      req.then(function () { form.classList.remove("loading"); say(""); success(); })
        .catch(function () { form.classList.remove("loading"); say("Something went wrong on our side. Please try again in a moment.", true); });
    });
  });

  /* year */
  document.querySelectorAll("[data-year]").forEach(function (e) { e.textContent = new Date().getFullYear(); });
})();
