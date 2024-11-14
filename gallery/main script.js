 function showLogin() {
            document.getElementById('login-form').style.display = 'block';
            document.getElementById('signup-form').style.display = 'none';
        }

        function showSignup() {
            document.getElementById('signup-form').style.display = 'block';
            document.getElementById('login-form').style.display = 'none';
        }

        function loginUser() {
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            const storedUsername = localStorage.getItem('username');
            const storedPassword = localStorage.getItem('password');

            if (username === storedUsername && password === storedPassword) {
                alert('Login successful!');
                showGallery();
            } else {
                alert('Invalid credentials');
            }
        }

        function signupUser() {
            const username = document.getElementById('signup-username').value;
            const password = document.getElementById('signup-password').value;

            localStorage.setItem('username', username);
            localStorage.setItem('password', password);

            alert('Signup successful! Please log in.');
            showLogin();
        }

        function showGallery() {
            document.getElementById('auth-page').style.display = 'none';
            document.getElementById('gallery-header').style.display = 'block';
            document.getElementById('gallery-main').style.display = 'block';
        }


        function LogOut() {
            alert('Logging out...');
            localStorage.removeItem('username');
            localStorage.removeItem('password');
            document.getElementById('auth-page').style.display = 'block';
            document.getElementById('gallery-header').style.display = 'none';
            document.getElementById('gallery-main').style.display = 'none';
        }

        const initialGallery = [              
            "html.jpg", "images.png", "html-dropdown.webp",
            "html-telephone-link.webp", "images.png", "html 2.jpg", "button-insert-html-code.png"
        ];

        let currentImageIndex = 0;
        let imagesInModal = [];
        
       
        window.onload = function() {    // On page load, load the initial gallery images
            loadGallery('home');        // Default to load both initial and submitted images on home
        };

        function Home() {
            document.getElementById('gallery').classList.add('home-view');  
            loadGallery('home');  

            closeModal();
            closeAboutus();
            closeTermsAndConditions();
            closePrivacyPolicy();
            closeContactUs();
        }

        function initialpage() {
            document.getElementById('gallery').classList.remove('home-view'); 
            loadGallery('initial');  

            closeModal();
            closeAboutus();
            closeTermsAndConditions();
            closePrivacyPolicy();
            closeContactUs();
        }

        function toggleSidebar() { 
            const sidebar = document.getElementById("sidebar");
            sidebar.classList.toggle("active"); 
        }

        function applyFilter() {
            const filters = {
                png: document.getElementById('pngFilter').checked,
                jpg: document.getElementById('jpgFilter').checked,
                uploaded: document.getElementById('uploadedFilter').checked,
                webp: document.getElementById('webpFilter').checked,
            };
            loadGallery('home', filters);  // Reload gallery with the applied filters
        }
        
        function loadGallery(view, filters = {}) {
            const gallery = document.getElementById("gallery");     // Get the gallery container element by its ID
            gallery.innerHTML = "";                                 // Clear any previous gallery images from the container

            // Combine the initial gallery images with the uploaded images if the view is 'home'
            const galleryImages = (view === 'home') ? initialGallery.concat(getUploadedImages()) : initialGallery;

            // Filter the images based on the selected filters (png, jpg, uploaded, webp)
            const filteredImages = galleryImages.filter(image => {
                const ext = image.split('.').pop().toLowerCase();        // Get the file extension of the image (jpg, png, webp)
                const isUploadedImage = image.startsWith("data:image/"); //Check if the image is an uploaded image (base64 format)

                // Apply the filters logic. Show images if they match the selected filter.
                return (
                    (filters.png && ext === 'png') ||
                    (filters.jpg && ext === 'jpg') ||
                    (filters.webp && ext === 'webp') ||
                    (filters.uploaded && isUploadedImage) ||
                    (!filters.png && !filters.jpg && !filters.uploaded && !filters.webp) // Show all if no filters are applied
                );
            });

            // If no images match the filters, show a message or handle it accordingly
            if (filteredImages.length === 0) {
                    gallery.innerHTML = "<p>No images match the selected filters.</p>";
            }

            // Populate the gallery with filtered images
            filteredImages.forEach(image => {                 // Iterate over each filtered image and add it to the gallery
                const img = document.createElement("img");    // Create a new img element for the image
                img.src = image;                              // Set the image source to the current image
                img.alt = image;                              // Set the alt text for the image (used for accessibility)
                img.onclick = function() {                    // Set the click event handler to open the image in a modal
                    openModal(image);
                };
                gallery.appendChild(img);                     // Append the image to the gallery
            });
        }


        function getUploadedImages() {
                return JSON.parse(localStorage.getItem('galleryImages') || '[]');  
        }


        function previewFile(event) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = function(e) {
                const newImage = e.target.result;
                let uploadedImages = getUploadedImages();
                localStorage.setItem('galleryImages', JSON.stringify(uploadedImages));
                loadGallery('home'); 
            };
            reader.readAsDataURL(file);
        }

        function submitImage() {
            let fileInput = document.getElementById("fileview");
            if (fileInput.files && fileInput.files[0]) {
                let reader = new FileReader(); 
                reader.onload = function(e) {         // e is event
                    let imageSrc = e.target.result;   // assigning a image from event target
                    let images = getUploadedImages();
                    images.push(imageSrc);
                    localStorage.setItem('galleryImages', JSON.stringify(images));
                    loadGallery('home');  // Reload gallery to show the new image
                };
                reader.readAsDataURL(fileInput.files[0]);
            }
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

        // Show the gallery after login
        function showGallery() {
            document.getElementById('auth-page').style.display = 'none';           // Hide the login/signup form
            document.getElementById('gallery-header').style.display = 'block';     // Show the gallery header
            document.getElementById('gallery-main').style.display = 'block';       // Show the gallery main content
            loadGallery('home');                           // Load the gallery with both initial and uploaded images
        }

        window.onload = function() {
            if (localStorage.getItem('username')) {
                showGallery();
            } else {
                showLogin();
            }
        }     
