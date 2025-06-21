// Utility functions
const fetchJSON = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}`);
    return await response.json();
  } catch (error) {
    console.error("Error loading JSON:", error);
    return null;
  }
};

const createElement = (type, className = "", content = "") => {
  const el = document.createElement(type);
  if (className) el.className = className;
  if (content) el.textContent = content;
  return el;
};

// Step 1: About Me Section
const loadAboutMe = async () => {
  const data = await fetchJSON("./data/aboutMeData.json");
  if (!data) return;

  const aboutMe = document.getElementById("aboutMe");

  // Create paragraph
  const paragraph = document.createElement("p");
  paragraph.textContent = data.aboutMe || "About me text not available.";

  // Create headshot container
  const headshotDiv = createElement("div", "headshotContainer");
  const img = document.createElement("img");
  img.src = data.headshot || "./images/headshot.webp";
  img.alt = "Headshot";
  headshotDiv.appendChild(img);

  aboutMe.appendChild(paragraph);
  aboutMe.appendChild(headshotDiv);
};

// Step 2: Projects Section
let projects = [];
const placeholderCard = "./images/card_placeholder_bg.webp";
const placeholderSpotlight = "./images/spotlight_placeholder_bg.webp";

const loadProjects = async () => {
  projects = await fetchJSON("./data/projectsData.json");
  if (!projects || !projects.length) return;

  const list = document.getElementById("projectList");
  const spotlight = document.getElementById("projectSpotlight");

  projects.forEach((proj, index) => {
    const card = createElement("div", "projectCard");
    card.id = proj.project_id;
    card.style.backgroundImage = `url(${proj.card_image || placeholderCard})`;

    const title = createElement(
      "h4",
      "",
      proj.project_name || "Untitled Project"
    );
    const short = createElement(
      "p",
      "",
      proj.short_description || "No short description"
    );

    card.appendChild(title);
    card.appendChild(short);

    card.addEventListener("click", () => updateSpotlight(index));
    list.appendChild(card);
  });

  // Load first project into spotlight
  updateSpotlight(0);
};

const updateSpotlight = (index) => {
  const proj = projects[index];
  const spotlight = document.getElementById("projectSpotlight");

  spotlight.style.backgroundImage = `url(${
    proj.spotlight_image || placeholderSpotlight
  })`;

  const titles = document.getElementById("spotlightTitles");
  titles.innerHTML = "";

  const name = createElement("h3", "", proj.project_name || "Unnamed Project");
  const desc = createElement(
    "p",
    "",
    proj.long_description || "No description available."
  );
  const link = document.createElement("a");
  link.href = proj.url || "#";
  link.textContent = "Click here to see more...";
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  titles.appendChild(name);
  titles.appendChild(desc);
  titles.appendChild(link);
};

// Step 2b: Project Arrows
const setupProjectScroll = () => {
  const list = document.getElementById("projectList");
  const left = document.querySelector(".arrow-left");
  const right = document.querySelector(".arrow-right");

  const isDesktop = window.matchMedia("(min-width: 1024px)");

  const scroll = (dir) => {
    if (isDesktop.matches) {
      list.scrollBy({ top: dir * 200, behavior: "smooth" });
    } else {
      list.scrollBy({ left: dir * 200, behavior: "smooth" });
    }
  };

  left.addEventListener("click", () => scroll(-1));
  right.addEventListener("click", () => scroll(1));
};

// Step 3: Contact Form Validation
const setupFormValidation = () => {
  const form = document.getElementById("formSection");
  const emailInput = document.getElementById("contactEmail");
  const messageInput = document.getElementById("contactMessage");
  const emailError = document.getElementById("emailError");
  const messageError = document.getElementById("messageError");
  const charCount = document.getElementById("charactersLeft");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const illegalCharRegex = /[^a-zA-Z0-9@._-]/;

  messageInput.addEventListener("input", () => {
    const count = messageInput.value.length;
    charCount.textContent = `Characters: ${count}/300`;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;

    emailError.textContent = "";
    messageError.textContent = "";

    const email = emailInput.value.trim();
    const message = messageInput.value.trim();

    if (!email) {
      emailError.textContent = "Email cannot be empty.";
      valid = false;
    } else if (!emailRegex.test(email)) {
      emailError.textContent = "Please enter a valid email address.";
      valid = false;
    } else if (illegalCharRegex.test(email)) {
      emailError.textContent = "Email contains illegal characters.";
      valid = false;
    }

    if (!message) {
      messageError.textContent = "Message cannot be empty.";
      valid = false;
    } else if (illegalCharRegex.test(message)) {
      messageError.textContent = "Message contains illegal characters.";
      valid = false;
    } else if (message.length > 300) {
      messageError.textContent = "Message must be 300 characters or fewer.";
      valid = false;
    }

    if (valid) {
      alert("Form submitted successfully!");
      emailInput.value = "";
      messageInput.value = "";
      charCount.textContent = "Characters: 0/300";
    }
  });
};

// Initialize all scripts
document.addEventListener("DOMContentLoaded", () => {
  loadAboutMe();
  loadProjects().then(setupProjectScroll);
  setupFormValidation();
});
