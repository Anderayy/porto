const toggle = document.getElementById("langToggle");
const themeToggle = document.getElementById("themeToggle");
const menuToggle = document.getElementById("menuToggle");
const siteNav = document.getElementById("siteNav");
const navBackdrop = document.getElementById("navBackdrop");
const nodes = document.querySelectorAll("[data-i18n-id]");
const navLinks = document.querySelectorAll(".nav a");
const certificateTriggers = document.querySelectorAll(".certificate-trigger");
const certificateModal = document.getElementById("certificateModal");
const certificateModalImage = document.getElementById("certificateModalImage");
const certificateModalPdf = document.getElementById("certificateModalPdf");
const certificateModalClose = document.getElementById("certificateModalClose");
const certificateModalBackdrop = document.querySelector("[data-close-modal]");
const contactForm = document.getElementById("contactForm");
const contactSubmit = document.getElementById("contactSubmit");
const contactStatus = document.getElementById("contactStatus");
const storedTheme = localStorage.getItem("theme");
let lang = "id";

const setLang = (next) => {
  lang = next;
  document.documentElement.lang = lang;
  nodes.forEach((node) => {
    const value = node.dataset[lang === "id" ? "i18nId" : "i18nEn"];
    if (value) {
      node.textContent = value;
    }
  });
  toggle.textContent = lang === "id" ? "EN" : "ID";
};

const setTheme = (theme) => {
  document.documentElement.dataset.theme = theme;
  localStorage.setItem("theme", theme);
  themeToggle.textContent = theme === "dark" ? "Light" : "Dark";
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
  );
};

const closeMenu = () => {
  if (!siteNav || !menuToggle || !navBackdrop) {
    return;
  }

  siteNav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
  navBackdrop.hidden = true;
  document.body.style.overflow = "";
};

const openMenu = () => {
  if (!siteNav || !menuToggle || !navBackdrop) {
    return;
  }

  siteNav.classList.add("is-open");
  document.body.classList.add("menu-open");
  menuToggle.setAttribute("aria-expanded", "true");
  navBackdrop.hidden = false;
  document.body.style.overflow = "hidden";
};

if (toggle) {
  toggle.addEventListener("click", () => {
    setLang(lang === "id" ? "en" : "id");
  });
}

if (themeToggle) {
  const initialTheme = storedTheme || "light";
  setTheme(initialTheme);
  themeToggle.addEventListener("click", () => {
    const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
  });
}

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav && siteNav.classList.contains("is-open");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });
}

if (navBackdrop) {
  navBackdrop.addEventListener("click", closeMenu);
}

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

if (window.emailjs) {
  window.emailjs.init({
    publicKey: "Q4ePIbwpGu-Pgo4ow",
  });
}

if (contactForm && contactSubmit && contactStatus && window.emailjs) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    contactSubmit.disabled = true;
    contactStatus.textContent = "Mengirim pesan...";

    try {
      await window.emailjs.sendForm("service_tpdqo5p", "template_8ounrds", contactForm);
      contactForm.reset();
      contactStatus.textContent = "Pesan berhasil dikirim";
    } catch (error) {
      console.error(error);
      contactStatus.textContent = "Pesan gagal dikirim. Coba lagi sebentar.";
    } finally {
      contactSubmit.disabled = false;
    }
  });
}

const openCertificateModal = ({ type, image, pdf, alt }) => {
  if (!certificateModal || !certificateModalImage || !certificateModalPdf) {
    return;
  }

  if (type === "pdf" && pdf) {
    certificateModalPdf.src = pdf;
    certificateModalPdf.hidden = false;
    certificateModalImage.hidden = true;
    certificateModalImage.src = "";
    certificateModalImage.alt = "";
  } else {
    certificateModalImage.src = image;
    certificateModalImage.alt = alt;
    certificateModalImage.hidden = false;
    certificateModalPdf.hidden = true;
    certificateModalPdf.src = "";
  }

  certificateModal.hidden = false;
  document.body.style.overflow = "hidden";
};

const closeCertificateModal = () => {
  if (!certificateModal || !certificateModalImage || !certificateModalPdf) {
    return;
  }

  certificateModal.hidden = true;
  certificateModalImage.src = "";
  certificateModalImage.alt = "";
  certificateModalImage.hidden = true;
  certificateModalPdf.src = "";
  certificateModalPdf.hidden = true;
  document.body.style.overflow = "";
};

certificateTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    openCertificateModal({
      type: trigger.dataset.type,
      image: trigger.dataset.image,
      pdf: trigger.dataset.pdf,
      alt: trigger.dataset.alt,
    });
  });
});

if (certificateModalClose) {
  certificateModalClose.addEventListener("click", closeCertificateModal);
}

if (certificateModalBackdrop) {
  certificateModalBackdrop.addEventListener("click", closeCertificateModal);
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && siteNav && siteNav.classList.contains("is-open")) {
    closeMenu();
  }

  if (event.key === "Escape" && certificateModal && !certificateModal.hidden) {
    closeCertificateModal();
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
