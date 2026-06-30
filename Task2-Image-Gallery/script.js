// =====================================================
// IMAGE GALLERY WITH MODAL
// =====================================================

const galleryItems = document.querySelectorAll(".gallery-item");
const modal = document.querySelector(".modal");
const modalImage = document.querySelector(".modal-image");
const caption = document.querySelector(".caption");
const counter = document.querySelector(".counter");

const closeBtn = document.querySelector(".close-btn");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

const filterBtns = document.querySelectorAll(".filter-buttons button");
const searchInput = document.getElementById("search");

const downloadBtn = document.getElementById("downloadBtn");

const loader = document.querySelector(".loader");

let currentIndex = 0;
let visibleImages = [];

let currentFilter = "all";
let searchValue = "";

// =====================================================
// LOADER
// =====================================================

const container = document.querySelector(".container");

container.style.display = "none";

setTimeout(() => {

    loader.remove();
    container.style.display = "block";

}, 1000);

// ===================
// upload
// ====================
const uploadBtn = document.getElementById("uploadBtn");
const uploadInput = document.getElementById("uploadInput");
const gallery = document.querySelector(".gallery");

uploadBtn.addEventListener("click", () => {
    uploadInput.click();
});

uploadInput.addEventListener("change", (e) => {

    const files = [...e.target.files];

    files.forEach(file => {

        const reader = new FileReader();

        reader.onload = function (event) {

            const item = document.createElement("div");
            item.className = "gallery-item uploaded";

            item.dataset.favorite = "false";
            item.dataset.deleted = "false";

            item.innerHTML = `
<div class="card-icons">
    <i class="fa-regular fa-heart favorite-icon"></i>
    <i class="fa-solid fa-trash trash-icon"></i>
</div>

<img src="${event.target.result}" alt="${file.name}">

<div class="overlay">
    <h3>${file.name.split(".")[0]}</h3>
</div>
`;
            gallery.appendChild(item);

            attachGalleryEvents(item);
            updateVisibleImages();
            updateCount();
        };
        reader.readAsDataURL(file);

    });

});

// =====================================================
// SHOW IMAGE
// =====================================================

function showImage() {

    updateVisibleImages();

    if (visibleImages.length === 0) return;

    const item = visibleImages[currentIndex];

    const img = item.querySelector("img");

    const title = item.querySelector("h3").textContent;

    modal.style.display = "flex";

    modalImage.src = img.src;

    caption.textContent = title;

    counter.textContent =
        `${currentIndex + 1} / ${visibleImages.length}`;

    downloadBtn.href = img.src;

    downloadBtn.download = title;

}

// =====================================================
// OPEN MODAL
// =====================================================

function attachGalleryEvents(item) {

    item.addEventListener("click", function (e) {

        // Don't open modal if clicking on icons
        if (
            e.target.classList.contains("favorite-icon") ||
            e.target.classList.contains("trash-icon")
        ) {
            return;
        }

        updateVisibleImages();

        currentIndex = visibleImages.indexOf(item);

        showImage();

    });

}

document.querySelectorAll(".gallery-item").forEach(attachGalleryEvents);

// =====================================================
// NEXT
// =====================================================

function nextImage() {

    currentIndex++;

    if (currentIndex >= visibleImages.length) {

        currentIndex = 0;

    }

    showImage();

}

nextBtn.addEventListener("click", nextImage);

// =====================================================
// PREVIOUS
// =====================================================

function prevImage() {

    currentIndex--;

    if (currentIndex < 0) {

        currentIndex = visibleImages.length - 1;

    }

    showImage();

}

prevBtn.addEventListener("click", prevImage);

// =====================================================
// CLOSE
// =====================================================

closeBtn.addEventListener("click", () => {

    modal.style.display = "none";

});

modal.addEventListener("click", (e) => {

    if (e.target === modal) {

        modal.style.display = "none";
        modalImage.src = "";
    }

});

// =====================================================
// KEYBOARD
// =====================================================

document.addEventListener("keydown", (e) => {

    if (modal.style.display !== "flex") return;

    if (e.key === "ArrowRight") {

        nextImage();

    }

    if (e.key === "ArrowLeft") {

        prevImage();

    }

    if (e.key === "Escape") {

        modal.style.display = "none";

    }

});

// =====================================================
// APPLY FILTER + SEARCH
// =====================================================

function applyFilters() {

    document.querySelectorAll(".gallery-item").forEach(item => {
        const title = item.querySelector("h3").textContent.toLowerCase();

        const favorite = item.dataset.favorite === "true";
        const deleted = item.dataset.deleted === "true";

        let categoryMatch = false;

        if (currentFilter === "all") {

            categoryMatch = item.dataset.deleted === "false";

        }

        else if (currentFilter === "favorite") {

            categoryMatch =
                item.dataset.favorite === "true" &&
                item.dataset.deleted === "false";

        }

        else if (currentFilter === "trash") {

            categoryMatch =
                item.dataset.deleted === "true";

        }

        else {

            categoryMatch =
                item.classList.contains(currentFilter) &&
                item.dataset.deleted === "false";

        }

        const searchMatch =
            title.includes(searchValue);
        const iconBox = item.querySelector(".card-icons");

        if (deleted) {

            iconBox.innerHTML = `
        <i class="fa-solid fa-rotate-left restore-icon" title="Restore"></i>
        <i class="fa-solid fa-trash-can delete-icon" title="Delete Permanently"></i>
    `;

        }
        else {

            iconBox.innerHTML = `
        <i class="${favorite ? 'fa-solid active' : 'fa-regular'} fa-heart favorite-icon"></i>
        <i class="fa-solid fa-trash trash-icon"></i>
    `;

        }

        if (categoryMatch && searchMatch) {

            item.style.display = "block";

            item.classList.remove("hide");

            item.classList.add("show");

        }

        else {

            item.style.display = "none";

            item.classList.remove("show");

            item.classList.add("hide");

        }

    });

    updateVisibleImages();

}

// =====================================================
// FILTER BUTTONS
// =====================================================

filterBtns.forEach(button => {

    button.addEventListener("click", () => {

        document
            .querySelector(".filter-buttons .active")
            .classList.remove("active");

        button.classList.add("active");

        currentFilter = button.dataset.filter;
        applyFilters();
        updateCount();

    });

});

// =====================================================
// SEARCH
// =====================================================

searchInput.addEventListener("keyup", () => {

    searchValue =
        searchInput.value.toLowerCase();
    applyFilters();
    updateCount();

});

// =====================================================
// DOWNLOAD
// =====================================================

downloadBtn.addEventListener("click", () => {

});

// =====================================================
// full screen
// =====================================================

const fullscreenBtn =
    document.getElementById("fullscreenBtn");

fullscreenBtn.onclick = () => {

    if (!document.fullscreenElement) {

        modalImage.requestFullscreen();

    } else {

        document.exitFullscreen();

    }

}

// =====================================================
// FAVORITES
// =====================================================

document.addEventListener("click", function (e) {

    if (!e.target.classList.contains("favorite-icon")) return;

    e.preventDefault();
    e.stopPropagation();

    const card = e.target.closest(".gallery-item");

    if (card.dataset.favorite === "true") {

        card.dataset.favorite = "false";

        e.target.classList.remove("fa-solid", "active");
        e.target.classList.add("fa-regular");

    } else {

        card.dataset.favorite = "true";

        e.target.classList.remove("fa-regular");
        e.target.classList.add("fa-solid", "active");

    }
    applyFilters();
    updateCount();
});

// =====================================================
// DOUBLE CLICK LIKE
// =====================================================

modalImage.addEventListener("dblclick", () => {

    const heart = document.createElement("div");

    heart.innerHTML = "❤️";

    heart.style.position = "absolute";

    heart.style.fontSize = "90px";

    heart.style.left = "50%";

    heart.style.top = "50%";

    heart.style.transform = "translate(-50%,-50%)";

    heart.style.animation = "pop .8s";

    modal.appendChild(heart);

    setTimeout(() => {

        heart.remove();

    }, 700);

});

// =====================================================
// TOUCH SWIPE
// =====================================================

let touchStartX = 0;

let touchEndX = 0;

modal.addEventListener("touchstart", (e) => {

    touchStartX = e.changedTouches[0].screenX;

});

modal.addEventListener("touchend", (e) => {

    touchEndX = e.changedTouches[0].screenX;

    if (touchStartX - touchEndX > 60) {

        nextImage();

    }

    if (touchEndX - touchStartX > 60) {

        prevImage();

    }

});

// =====================================================
// SORT BUTTON (OPTIONAL)
// =====================================================

const sortBtn = document.getElementById("sortBtn");

if (sortBtn) {

    sortBtn.addEventListener("click", () => {

        const gallery = document.querySelector(".gallery");

        const items = [...gallery.children];

        items.sort(() => Math.random() - 0.5);

        items.forEach(item => gallery.appendChild(item));

    });

}

// =====================================================
// gallery feature
// ====================
document.querySelectorAll(".gallery-item").forEach(item => {
    item.dataset.favorite = "false";

    item.dataset.deleted = "false";

});

// ========================
// image count
// ========================
const imageCount =
    document.getElementById("imageCount");

function updateCount() {

    updateVisibleImages();

    imageCount.textContent =
        `Total Images : ${visibleImages.length}`;

}

// =======================================
// UPDATE VISIBLE IMAGES
// =======================================
function updateVisibleImages() {

    visibleImages = [...document.querySelectorAll(".gallery-item")].filter(item => { return item.style.display !== "none"; });

}

// =======================================
// TRASH
// =======================================

document.addEventListener("click", function (e) {

    if (!e.target.classList.contains("trash-icon")) return;

    e.preventDefault();
    e.stopPropagation();

    const card = e.target.closest(".gallery-item");

    card.dataset.deleted = "true";
    applyFilters();
    updateCount();

});

// restore
document.addEventListener("click", function (e) {

    if (!e.target.classList.contains("restore-icon")) return;

    e.preventDefault();
    e.stopPropagation();

    const card = e.target.closest(".gallery-item");

    card.dataset.deleted = "false";

    applyFilters();
    updateCount();

});

// permanent delete
document.addEventListener("click", function (e) {

    if (!e.target.classList.contains("delete-icon")) return;

    e.preventDefault();
    e.stopPropagation();

    const card = e.target.closest(".gallery-item");

    const confirmDelete = confirm(
        "This image will be permanently deleted.\n\nDo you want to continue?"
    );

    if (!confirmDelete) return;

    card.remove();

    applyFilters();
    updateCount();

});

// =======================================
// OPEN MODAL
// =======================================

document.addEventListener("click", function (e) {

    const card = e.target.closest(".gallery-item");

    if (!card) return;

    if (

        e.target.classList.contains("favorite-icon") ||
        e.target.classList.contains("trash-icon") ||
        e.target.classList.contains("restore-icon") ||
        e.target.classList.contains("delete-icon")

    ) return;

    updateVisibleImages();

    currentIndex = visibleImages.indexOf(card);

    showImage();

});

// =======================================
// START
// =======================================

applyFilters();