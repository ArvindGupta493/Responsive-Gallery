
//------------------------login / sigup page / logout -------------------------------//


// Function to show the login form and hide the signup form
function showLogin() {
    // Find the login form element by its ID and make it visible by setting display to 'block'
    document.getElementById('login-form').style.display = 'block';  
    // Find the signup form element by its ID and hide it by setting display to 'none'
    document.getElementById('signup-form').style.display = 'none'; 
}

// Function to show the signup form and hide the login form
function showSignup() {
    document.getElementById('signup-form').style.display = 'block'; 
    document.getElementById('login-form').style.display = 'none';    
}

function loginUser() {
    // Get the value of the username input field from the login form
    const username = document.getElementById('login-username').value; // Get the value of  username input field from the login form
    const password = document.getElementById('login-password').value; // Get the value of  password input field from the login form

    const storedUsername = localStorage.getItem('username');   // Retrieve the stored username from localStorage
    const storedPassword = localStorage.getItem('password');   // Retrieve the stored password from localStorage

    // Check if the entered username and password match the stored credentials
    if (username === storedUsername && password === storedPassword) {
        alert('Login successful!');                            // If they match, show a login success alert
        showGallery();                                         // Call the function to show the gallery page after successful login
    } else {
        alert('Invalid credentials');              // If they don't match, show an alert with an error message
    }
}

// Function to handle user signup
function signupUser() {
    const username = document.getElementById('signup-username').value;    // Get the username value from the signup form
    const password = document.getElementById('signup-password').value;    // Get the password value from the signup form

    localStorage.setItem('username', username);                           // Store the username in localStorage
    localStorage.setItem('password', password);                           // Store the password in localStorage

    alert('Signup successful! Please log in.');                           // Show an alert confirming the signup process
    showLogin();                                                          // Switch to the login form after a successful signup
}

function showGallery() {                // Function to show the gallery page after successful login
    document.getElementById('auth-page').style.display = 'none';           // Hide the authentication page (login/signup form)
    document.getElementById('gallery-header').style.display = 'block';     // Show the gallery header section
    document.getElementById('gallery-main').style.display = 'block';       // Show the gallery main section with the images
}

function LogOut() {                    // Function to log out the user
    alert('Logging out...');           // Show a logout alert to the user

    localStorage.removeItem('username');                                  // Remove the stored username from localStorage
    localStorage.removeItem('password');                                  // Remove the stored  password from localStorage
 
    document.getElementById('auth-page').style.display = 'block';         // Show the login/signup page again after logout
  
    document.getElementById('gallery-header').style.display = 'none';     // Hide the gallery header sections
    document.getElementById('gallery-main').style.display = 'none';       // Hide the gallery main sections
}



// -------------------------------- gallery page --------------------------------------------//




const initialGallery = [           // Array of initial gallery images
    "html.jpg", "images.png", "html-dropdown.webp",
    "html-telephone-link.webp", "images.png", "html 2.jpg", "button-insert-html-code.png"
];
let currentImageIndex = 0;        // Variable to track the current image index when viewing images in a modal
let imagesInModal = [];           // Array to store all images in the modal (both initial and uploaded images)

window.onload = function() {      // Function to load the gallery when the page is loaded or when filters are applied
    loadGallery('home');          // Load the gallery on page load with initial images and any uploaded images
};


function Home() {                 // home button press hone pe sare other function band ho jate he 
    document.getElementById('gallery').classList.add('home-view');   // add the home view class in gallery element
    loadGallery('home');          //reload the page with home as an argument in loadgallery function

    closeModal();
    closeAboutus();
    closeTermsAndConditions();
    closePrivacyPolicy();
    closeContactUs();
}

function initialpage() {        // function inital button press hone pe sare other function band ho jate he
    document.getElementById('gallery').classList.remove('home-view');   // Removes the 'home-view' class from the gallery element
    
    loadGallery('initial');    // Calls the loadGallery function with initial as an argument to reload gallery in default state
    closeModal();
    closeAboutus();
    closeTermsAndConditions();
    closePrivacyPolicy();
    closeContactUs();
}


function toggleSidebar() { // Function toggleSidebar is designed to toggle the visibility or state of a sidebar element on a webpage 
    const sidebar = document.getElementById("sidebar"); //Get the DOM element with the id sidebar & store it in the variable sidebar
    sidebar.classList.toggle("active");  // Toggle the active class on the sidebar element (adds or removes the class)
}  



function applyFilter() {  // Create an object 'filters' to hold the current states of each filter checkbox
    const filters = {
        png: document.getElementById('pngFilter').checked,           // Get the checked state of the 'pngFilter' checkbox
        jpg: document.getElementById('jpgFilter').checked,           // Get the checked state of the 'jpgFilter' checkbox
        webp: document.getElementById('webpFilter').checked,         // Get the checked state of the 'webpFilter' checkbox
        uploaded: document.getElementById('uploadedFilter').checked, // Get the checked state of the 'uploadedFilter' checkbox
    };
    // Reload the gallery with the applied filters (passes 'home' as the view type and the 'filters' object)
    loadGallery('home', filters);  
}

       

function loadGallery(view, filters = {}) {                  // Function to load the gallery images based on selected view and filters
    const gallery = document.getElementById("gallery");     // Get the gallery container element by its ID
    gallery.innerHTML = "";                                 // Clear any previous gallery images from the container

    // Combine the initial gallery images with the uploaded images if the view is 'home'
    const galleryImages = (view === 'home') ? initialGallery.concat(getUploadedImages()) : initialGallery;

    // Filter the images based on the selected filters (png, jpg, uploaded, webp)
    const filteredImages = galleryImages.filter(image => {
        const ext = image.split('.').pop().toLowerCase();          // Get the file extension of the image (jpg, png, webp)
        const isUploadedImage = image.startsWith("data:image/");   // Check if the image is an uploaded image (base64 format)

        return (                                                   // Return true if the image matches any of the selected filters
            (filters.png && ext === 'png') ||
            (filters.jpg && ext === 'jpg') ||
            (filters.uploaded && isUploadedImage) ||
            (filters.webp && ext === 'webp') ||
            (!filters.png && !filters.jpg && !filters.uploaded && !filters.webp) // Show all if no filters are applied
        );
    });

  
    filteredImages.forEach(image => {                     // Iterate over each filtered image and add it to the gallery
        const img = document.createElement("img");        // Create a new img element for the image
        img.src = image;                                  // Set the image source to the current image
        img.alt = image;                                  // Set the alt text for the image (used for accessibility)
        img.onclick = function() {                        // Set the click event handler to open the image in a modal
            openModal(image);
        };
        gallery.appendChild(img);                         // Append the image to the gallery
    });
}


function getUploadedImages() {                            // get uploaded images or return empty if not existed in localStorage
    return JSON.parse(localStorage.getItem('galleryImages') || '[]');
}


function previewFile(event) {                             // Function to handle the preview of an image before uploading
    const file = event.target.files[0];                   // Get the selected file from the file input element
    const reader = new FileReader();                      // Create a new FileReader to read the selected file
    reader.onload = function(e) {                         // Set the onload event to process the file once it is read
        const newImage = e.target.result;                 // Get the data URL (base64 encoded image) from the reader
        let uploadedImages = getUploadedImages();         // Retrieve the current list of uploaded images
        localStorage.setItem('galleryImages', JSON.stringify(uploadedImages)); //Store updated list of uploadedImages in localStorage
        loadGallery('home');                              // Reload the gallery to show the newly uploaded image
    };
    reader.readAsDataURL(file);                           // Read the file as a data URL (base64 encoded string)
}


function submitImage() {                                  // Function to handle image submission (uploading an image to the gallery)
    let fileInput = document.getElementById("fileview");  // Get the file input element for selecting files
    if (fileInput.files && fileInput.files[0]) {          // Check if a file has been selected
        let reader = new FileReader();                    // Create a new FileReader to read the selected file
        reader.onload = function(e) {                     // Set the onload event to process the file once it is read
            let imageSrc = e.target.result;               // Get the data URL (base64 encoded image) from the reader
            let images = getUploadedImages();             // Retrieve the current list of uploaded images
            images.push(imageSrc);                        // Add the new uploaded image to the list
            localStorage.setItem('galleryImages', JSON.stringify(images)); // Store updated list of uploaded images in localStorage
            loadGallery('home');                          // Reload the gallery to show the new image
        };
        reader.readAsDataURL(fileInput.files[0]);       // Read the selected file as a data URL (base64 encoded string)
    }
}


function openModal(image) {                              // Function to open the modal for viewing an image
    const modal = document.getElementById("myModal");    // Get the modal element and the image element inside the modal
    const modalImage = document.getElementById("modalImage");
    modal.style.display = "flex";                        // Set the modal display to 'flex' to make it visible
    modalImage.src = image;                              // Set the modal image source to the selected image

    // Combine the initial gallery images with the uploaded images for navigation
    imagesInModal = initialGallery.concat(getUploadedImages());
    currentImageIndex = imagesInModal.indexOf(image);    // Set the current image index to the selected image's index
}


function closeModal() {
    document.getElementById("myModal").style.display = "none";      
}


function changeImage(direction) {      // Function to change the image (next/previous) when navigating in the modal
    currentImageIndex += direction;    // Adjust the current image index based on the direction (1 for next, -1 for previous)
    if (currentImageIndex < 0) {       // If the index goes out of bounds, wrap around to the beginning or end of the list
        currentImageIndex = imagesInModal.length - 1;
        
    } else if (currentImageIndex >= imagesInModal.length) {
        currentImageIndex = 0;         // if currentImageIndex is graeter then imagemodeal length then currentimage return to start
    }
    const modalImage = document.getElementById("modalImage");  // Get the modal image element & update its source to the new image
    modalImage.src = imagesInModal[currentImageIndex];
}


function DeleteImage() {                                       // Function to delete the current image from the gallery
    const currentImage = imagesInModal[currentImageIndex];     // Get the current image being viewed in the modal
 
    // If the current image is from the initial gallery (not uploaded), remove it from the initial gallery array
    if (initialGallery.includes(currentImage)) {               // Check if the current image exists in the initial gallery
        const index = initialGallery.indexOf(currentImage);    // Find the index of the current image in the initial gallery
        if (index !== -1) {                                    // If the image is found (index is not -1)
            initialGallery.splice(index, 1);                   // Remove the image from the initial gallery array at the found index
        }
    } else {                                                   // If the current image is not in the initial gallery 
        let uploadedImages = getUploadedImages();              // Retrieve the list of uploaded images using a function
        const index = uploadedImages.indexOf(currentImage);    // Find the index of the current image in the uploaded images list
        if (index !== -1) {                                    // If the image is found in the uploaded images list
            uploadedImages.splice(index, 1);                   // Remove the image from the uploaded images list
            localStorage.setItem('galleryImages', JSON.stringify(uploadedImages));// Update localStorage with new uploaded images 
        }
    }
    loadGallery('home');                                       // Reload the gallery on the 'home' page to reflect the changes 
    closeModal();                                              // Close the modal window after the image is deleted
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
function Contactus() {
    document.getElementById("Contactus").style.display = "block"; 
}

function closeContactUs() {
    document.getElementById("Contactus").style.display = "none";  
}


function showGallery() {                                                   // Show the gallery after login
    document.getElementById('auth-page').style.display = 'none';           // Hide the login/signup form
    document.getElementById('gallery-header').style.display = 'block';     // Show the gallery header
    document.getElementById('gallery-main').style.display = 'block';       // Show the gallery main content
    loadGallery('home');                                                   // Load the gallery with both initial and uploaded images
}


window.onload = function() {                      // Initialize the page on load by checking login state
    if (localStorage.getItem('username')) {
        showGallery();                            // If logged in, show the gallery
    } else {
        showLogin();                              // If not logged in, show the login form
    }
}
