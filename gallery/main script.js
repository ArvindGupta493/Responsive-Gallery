const initialGallery = [
    "html.jpg", "images.png", "images.png", "html-dropdown.webp",
    "html-telephone-link.webp", "html 2.jpg", "button-insert-html-code.png"
];

let currentImageIndex = 0;
let imagesInModal = [];

window.onload = function() {
    loadGallery('home'); // Default to load both initial and submitted images on home
};


function Home() {
    loadGallery('home'); // Load both initial and uploaded images
    closeModal();
    closeAboutus();
    closeTermsAndConditions();
    closePrivacyPolicy();
    closeContactUs();
}


function initialpage() {
    loadGallery('initial'); // Only load the initial images
    closeModal();
    closeAboutus();
    closeTermsAndConditions();
    closePrivacyPolicy();
    closeContactUs();
}


function loadGallery(view) {           // Function to load the gallery based on the type of button pressed
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = ""; // Clear existing gallery
    const galleryImages = (view === 'home') ? initialGallery.concat(getUploadedImages()) : initialGallery;     

    galleryImages.forEach(image => {
        const img = document.createElement("img");
        img.src = image;
        img.alt = image;
        img.onclick = function() {
            openModal(image);
        };
        gallery.appendChild(img);
    });    
}


function getUploadedImages() {
    return JSON.parse(localStorage.getItem('galleryImages') || '[]');
}

function openModal(image) {
    const modal = document.getElementById("myModal");
    const modalImage = document.getElementById("modalImage");
    modal.style.display = "flex";
    modalImage.src = image;

    imagesInModal = initialGallery.concat(getUploadedImages());
    currentImageIndex = imagesInModal.indexOf(image);
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
}

function changeImage(direction) {
    currentImageIndex += direction;
    if (currentImageIndex < 0) {
        currentImageIndex = imagesInModal.length - 1;
    } else if (currentImageIndex >= imagesInModal.length) {
        currentImageIndex = 0;
    }

    const modalImage = document.getElementById("modalImage");
    modalImage.src = imagesInModal[currentImageIndex];
}

function DeleteImage() {
    const currentImage = imagesInModal[currentImageIndex];
        
    if (initialGallery.includes(currentImage)) {
        const index = initialGallery.indexOf(currentImage);
        if (index !== -1) {
            initialGallery.splice(index, 1);
        }
    } else {
        let uploadedImages = getUploadedImages();
        const index = uploadedImages.indexOf(currentImage);
        if (index !== -1) {
            uploadedImages.splice(index, 1);
            localStorage.setItem('galleryImages', JSON.stringify(uploadedImages));
        }
    }
    loadGallery('home'); 
    closeModal();
}


function previewFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const newImage = e.target.result;
        let uploadedImages = getUploadedImages();
        uploadedImages.push(newImage);
        localStorage.setItem('galleryImages', JSON.stringify(uploadedImages));
        loadGallery('home'); // Refresh the gallery with the new image
    };
    reader.readAsDataURL(file);
}

function submitImage() {
    let fileInput = document.getElementById("fileview");
    if (fileInput.files && fileInput.files[0]) {
        let reader = new FileReader();
        reader.onload = function(e) {
            let imageSrc = e.target.result;
            let images = getUploadedImages();
            images.push(imageSrc);
            localStorage.setItem('galleryImages', JSON.stringify(images));
            loadGallery('home');
        };
        reader.readAsDataURL(fileInput.files[0]);
    }
}

function openAboutus() {
    document.getElementById("Aboutus").style.display = "block";
}

function closeAboutus() {
    document.getElementById("Aboutus").style.display = "none";
}

function openTermsAndConditions() {
    document.getElementById("T&Cmodal").style.display = "block";
}

function closeTermsAndConditions() {
    document.getElementById("T&Cmodal").style.display = "none";
}

function openPrivacyPolicy() {
    document.getElementById("privacymodal").style.display = "block";
}

function closePrivacyPolicy() {
    document.getElementById("privacymodal").style.display = "none";
}

function closeContactUs() {
    document.getElementById("Contactus").style.display = "none";
}

function Contactus() {
    document.getElementById("Contactus").style.display = "block";
}

function LogOut() {
    // yaha logout ka code likhna he 
    alert('Logging out...');
}