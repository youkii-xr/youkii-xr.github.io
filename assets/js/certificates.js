// Certificate Data Structure
const certificates = [
  {
    title: "Certified XR Developer",
    issuer: "Akylade",
    date: "August 2025",
    categories: ["XR"],
    image: "assets/images/certificates/XR_certificate.jpeg",
    verifyLink: "",
  },
  {
    title: "XRCC 2025 Participation",
    issuer: "Immersive Insiders",
    date: "Nov 2025",
    categories: ["XR", "participation"],
    image: "assets/images/certificates/XRCC.png",
    verifyLink: "",
  },
  {
    title: "SensAi Volunteer",
    issuer: "SensAI Hackademy",
    date: "Nov 2025",
    categories: ["XR", "Volunteering"],
    image: "assets/images/certificates/sensai-volunteer.png",
    verifyLink: "",
  },
  {
    title: "MCP's 1st Birthday",
    issuer: "Hugging Face",
    date: "Dec 2025",
    categories: ["AI", "participation"],
    image: "assets/images/certificates/HF_MCP.png",
    verifyLink: "",
  },
   {
    title: "Nasa Space App XR/Game Dev Mentor",
    issuer: "Nasa Space App",
    date: "Oct 2025",
    categories: ["XR", "participation"],
    image: "assets/images/certificates/nasa-space-app-2025.jpeg",
    verifyLink: "",
  },
    {
    title: "ACC Virtual Reality Diploma",
    issuer: "ACC & 412 labs",
    date: "July 2022",
    categories: ["XR"],
    image: "assets/images/certificates/ACC_VR_certificate-1.png",
    verifyLink: "",
  },
   {
    title: "Introduction to AutoCAD",
    issuer: "AutoDesk",
    date: "July 2021",
    categories: ["Design"],
    image: "assets/images/certificates/auto-desk.png",
    verifyLink: "",
  },
  {
    title: "Nuclear Energy contribution",
    issuer: "RosAtom",
    date: "July 2024",
    categories: ["participation"],
    image: "assets/images/certificates/nuclear-energy.png",
    verifyLink: "",
  },
];

// Define custom order for categories (null values will be sorted alphabetically)
const categoryOrder = [
  "All",
  "XR",
  "AI", 
  "Volunteering",
  "participation",
  "Design"
];

// Get unique categories from all certificates with custom ordering
function getAllCategories() {
  const allCategories = new Set();
  certificates.forEach(cert => {
    cert.categories.forEach(cat => allCategories.add(cat));
  });
  
  const categoriesArray = Array.from(allCategories);
  
  // Sort based on custom order
  const sorted = categoriesArray.sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);
    
    // If both are in the order array, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    // If only a is in the order array, it comes first
    if (indexA !== -1) return -1;
    // If only b is in the order array, it comes first
    if (indexB !== -1) return 1;
    // If neither is in the order array, sort alphabetically
    return a.localeCompare(b);
  });
  
  return ["All", ...sorted];
}

const categories = getAllCategories();

// DOM Elements
const tabsContainer = document.getElementById("categoryTabs");
const grid = document.getElementById("certificatesGrid");
const modal = document.getElementById("certModal");
const modalImg = document.getElementById("modalCertImage");
const modalTitle = document.getElementById("modalCertTitle");
const modalIssuer = document.getElementById("modalCertIssuer");
const modalDate = document.getElementById("modalCertDate");
const modalLink = document.getElementById("modalCertLink");
const closeBtn = document.getElementById("closeModal");

// Current active category
let activeCategory = "All";

// Populate category tabs
function populateTabs() {
  categories.forEach((category, index) => {
    const btn = document.createElement("button");
    btn.textContent = category;
    btn.classList.add("category-tab");
    if (index === 0) btn.classList.add("active");

    btn.addEventListener("click", () => {
      document.querySelector(".category-tab.active")?.classList.remove("active");
      btn.classList.add("active");
      activeCategory = category;
      renderCertificates();
    });

    tabsContainer.appendChild(btn);
  });
}

// Render certificates based on active category
function renderCertificates() {
  grid.innerHTML = "";

  const filteredCerts = activeCategory === "All" 
    ? certificates 
    : certificates.filter(cert => cert.categories.includes(activeCategory));

  if (filteredCerts.length === 0) {
    grid.innerHTML = `
      <div class="col-span-full empty-state">
        <p class="text-lg">No certificates found in this category.</p>
      </div>
    `;
    return;
  }

  filteredCerts.forEach(cert => {
    const card = document.createElement("div");
    card.classList.add("cert-card");
    
    // Create tags HTML
    const tagsHTML = cert.categories.map(cat => 
      `<span class="cert-badge">${cat}</span>`
    ).join('');
    
    // Check if certificate has verification link
    const hasVerification = cert.verifyLink && cert.verifyLink.trim() !== "";
    const verifiedBadge = hasVerification 
      ? '<span class="verified-badge">✓ Verified</span>' 
      : '';
    
    card.innerHTML = `
      <div class="cert-image-container">
        <img src="${cert.image}" alt="${cert.title}" class="cert-thumbnail" />
        <div class="cert-overlay">
          <div class="cert-overlay-content">
            <h3 class="cert-overlay-title">${cert.title}</h3>
            <p class="cert-overlay-issuer">${cert.issuer}</p>
            <p class="cert-overlay-date">${cert.date}</p>
            ${verifiedBadge}
            <div class="cert-overlay-tags">${tagsHTML}</div>
          </div>
        </div>
      </div>
    `;

    card.addEventListener("click", () => openModal(cert));
    grid.appendChild(card);
  });
}

// Open modal with certificate details
function openModal(cert) {
  modalImg.src = cert.image;
  modalTitle.textContent = cert.title;
  modalIssuer.textContent = `Issued by: ${cert.issuer}`;
  modalDate.textContent = `Date: ${cert.date}`;
  
  // Handle verification link visibility
  const hasVerification = cert.verifyLink && cert.verifyLink.trim() !== "";
  if (hasVerification) {
    modalLink.href = cert.verifyLink;
    modalLink.style.display = "inline-block";
    modalLink.textContent = "Verify Certificate";
  } else {
    modalLink.style.display = "none";
  }
  
  modal.classList.remove("hidden");
}

// Close modal
closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.add("hidden");
});

// Keyboard navigation
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    modal.classList.add("hidden");
  }
});

// Initialize
populateTabs();
renderCertificates();