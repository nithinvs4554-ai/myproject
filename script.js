const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector(".primary-nav");
const enquiryForm = document.querySelector(".enquiry-form");
const formStatus = document.querySelector(".form-status");
const checkIn = document.querySelector('[name="checkin"]');
const checkOut = document.querySelector('[name="checkout"]');
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxCaption = document.querySelector(".lightbox-caption");

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const resortWhatsAppNumber = "919345542229";

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

if (checkIn) checkIn.min = formatLocalDate(new Date());

const requestedRoom = new URLSearchParams(window.location.search).get("room");
if (requestedRoom && enquiryForm?.elements.room) {
  enquiryForm.elements.room.value = requestedRoom;
}

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  primaryNav.classList.toggle("is-open", !isOpen);
});

primaryNav?.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    primaryNav.classList.remove("is-open");
  }
});

checkIn?.addEventListener("change", () => {
  if (!checkIn.value) return;
  const nextDay = new Date(`${checkIn.value}T00:00:00`);
  nextDay.setDate(nextDay.getDate() + 1);
  checkOut.min = formatLocalDate(nextDay);
  if (checkOut.value && checkOut.value <= checkIn.value) {
    checkOut.value = "";
  }
});

enquiryForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!enquiryForm.reportValidity()) return;

  if (!resortWhatsAppNumber) {
    formStatus.textContent = "Your enquiry has not been sent. Connect the resort's WhatsApp number in script.js and update the contact details in index.html before accepting bookings.";
    return;
  }

  const details = new FormData(enquiryForm);
  const message = [
    "Hello! I'd like to enquire about a stay at Misty Haven Resort.",
    `Name: ${details.get("name")}`,
    `Email: ${details.get("email")}`,
    `Phone: ${details.get("phone") || "Not provided"}`,
    `Check-in: ${details.get("checkin")}`,
    `Check-out: ${details.get("checkout")}`,
    `Guests: ${details.get("guests")}`,
    `Room: ${details.get("room") || "Open to suggestions"}`,
    `Message: ${details.get("message") || "None"}`,
  ].join("\n");

  window.open(`https://wa.me/${resortWhatsAppNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  formStatus.textContent = "Your enquiry is ready to send in WhatsApp. Please review the message and press send there.";
});

document.querySelectorAll(".gallery-item").forEach((item) => {
  item.addEventListener("click", () => {
    if (!lightbox || !lightboxImage || !lightboxCaption) return;
    lightboxImage.src = item.dataset.lightboxSrc;
    lightboxImage.alt = item.dataset.lightboxAlt;
    lightboxCaption.textContent = item.dataset.lightboxAlt;
    lightbox.showModal();
  });
});

document.querySelector(".lightbox-close")?.addEventListener("click", () => lightbox?.close());
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) lightbox.close();
});

document.querySelectorAll("[data-room-choice]").forEach((button) => {
  button.addEventListener("click", () => {
    if (enquiryForm?.elements.room) enquiryForm.elements.room.value = button.dataset.roomChoice;
  });
});

document.querySelector(".whatsapp-button")?.addEventListener("click", (event) => {
  if (resortWhatsAppNumber) return;
  event.preventDefault();
  if (formStatus && enquiryForm) {
    formStatus.textContent = "WhatsApp is not connected yet. Please contact the resort using the details above.";
    enquiryForm.scrollIntoView({ behavior: "smooth", block: "center" });
  }
});

lightbox?.addEventListener("close", () => {
  lightboxImage.removeAttribute("src");
});
