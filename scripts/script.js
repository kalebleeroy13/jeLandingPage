// script.js

// Register service worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
        .then(registration => {
            console.log('ServiceWorker registration successful with scope:', registration.scope);
        })
        .catch(error => {
            console.log('ServiceWorker registration failed:', error);
        });
    });
}

function toggleMenu() {
    const nav = document.querySelector('.nav-container');
    nav.classList.toggle('open');
    // Update the aria-expanded attribute
    const isExpanded = nav.classList.contains('open');
    document.getElementById('menu-icon').setAttribute('aria-expanded', isExpanded);
}

function addDropdownListeners() {
    const dropdownButton = document.querySelector('.dropdown-button');
    const dropdownContent = document.querySelector('.custom-dropdown-menu');

    const handleDropdownToggle = () => {
        const isSmallViewport = window.matchMedia("(max-width: 768px)").matches;

        if (dropdownButton && dropdownContent) {
            if (isSmallViewport) {
                dropdownButton.addEventListener('click', function(event) {
                    event.preventDefault();
                    let expanded = dropdownButton.getAttribute('aria-expanded') === 'true' || false;
                    dropdownButton.setAttribute('aria-expanded', !expanded);
                    dropdownContent.classList.toggle('show');
                });
            } else {
                dropdownButton.removeEventListener('click', handleDropdownToggle);
                dropdownContent.classList.remove('show');
            }
        }
    };

    window.addEventListener('resize', handleDropdownToggle);
    handleDropdownToggle(); // Initial check on page load
}

function createLoadingOverlay() {
    if (!document.getElementById('loading-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.innerHTML = '<div id="rising-sun-container"><div id="rising-sun"></div></div>';
        document.body.prepend(overlay);
    }
}

// Create and insert the loading overlay as soon as the script runs
createLoadingOverlay();

document.addEventListener('DOMContentLoaded', function() {
    // Dynamically add lazy loading to all images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.setAttribute('loading', 'lazy');
    });

    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    const navbarToggle = document.querySelector('.navbar-toggle');

    function fetchAndSetInnerHTML(url, element) {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                element.innerHTML = data;
                if (url.includes('header.html')) {
                    addDropdownListeners();
                }
            }).catch(error => {
                console.error(`Error loading ${url}:`, error);
            });
    }

    function loadHeaderFooter() {
        if (headerPlaceholder) {
            fetchAndSetInnerHTML('header.html', headerPlaceholder);
        }

        if (footerPlaceholder) {
            fetchAndSetInnerHTML('footer.html', footerPlaceholder);
        }
    }

    if (navbarToggle) {
        navbarToggle.addEventListener('click', toggleMenu);
    }

    loadHeaderFooter();

    // Add fade-in effect to body on initial load
    document.body.classList.add('fade-in');

    // Add transition effect when clicking on links
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (event) => {
            // Ensure the link is not an anchor or a JavaScript action
            const href = link.getAttribute('href');
            if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                event.preventDefault();
                document.body.classList.remove('fade-in');
                document.body.classList.add('fade-out');
                setTimeout(() => {
                    window.location.href = href;
                }, 1000); // Match the duration of the fade-out animation (1s)
            }
        });
    });

    // Wait for the end of the sun animation before showing the page
    const risingSun = document.getElementById('rising-sun');
    if (risingSun) {
        risingSun.addEventListener('animationend', () => {
            document.body.classList.add('loaded');
            setTimeout(() => {
                const loadingOverlay = document.getElementById('loading-overlay');
                if (loadingOverlay) {
                    loadingOverlay.remove();
                }
            }, 1000); // Duration of the fade-in animation (1s)
        });
    } else {
        // If the rising sun element is not found, remove the loading overlay after a delay
        setTimeout(() => {
            document.body.classList.add('loaded');
            const loadingOverlay = document.getElementById('loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.remove();
            }
        }, 2000); // Adjust the delay as needed
    }

    // Conditional Rising Sun Animation
    if (window.location.pathname === "/index.html" || window.location.pathname === "/") {
        const sunContainer = document.createElement('div');
        sunContainer.id = "rising-sun-container";
        sunContainer.style.display = "flex"; // Show the container
        sunContainer.innerHTML = '<div id="rising-sun"></div>';
        document.body.appendChild(sunContainer);
    }

    // Form Validation
    function validateForm() {
        let isValid = true;

        // Get form fields
        const nameField = document.querySelector('input[name="name"]');
        const emailField = document.querySelector('input[name="email"]');
        const phoneField = document.querySelector('input[name="phone"]');
        const serviceField = document.querySelector('select[name="service"]');
        const messageField = document.querySelector('textarea[name="message"]');

        // Clear previous error messages
        document.querySelectorAll('.error-message').forEach(el => el.remove());

        // Validate name
        if (nameField.value.trim() === "") {
            showError(nameField, "Name is required");
            isValid = false;
        }

        // Validate email
        if (emailField.value.trim() === "") {
            showError(emailField, "Email is required");
            isValid = false;
        } else if (!validateEmail(emailField.value)) {
            showError(emailField, "Please enter a valid email");
            isValid = false;
        }

        // Validate phone
        if (phoneField.value.trim() === "") {
            showError(phoneField, "Phone number is required");
            isValid = false;
        } else if (!validatePhone(phoneField.value)) {
            showError(phoneField, "Please enter a valid phone number");
            isValid = false;
        }

        // Validate service
        if (serviceField.value === "") {
            showError(serviceField, "Please select a service");
            isValid = false;
        }

        // Validate message
        if (messageField.value.trim() === "") {
            showError(messageField, "Message is required");
            isValid = false;
        }

        return isValid;
    }

    // Function to show error messages
    function showError(field, message) {
        const error = document.createElement('div');
        error.className = 'error-message';
        error.style.color = 'red';
        error.textContent = message;
        field.parentElement.appendChild(error);
    }

    // Function to validate email format
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Function to validate phone number format
    function validatePhone(phone) {
        const re = /^\d{10}$/;
        return re.test(String(phone));
    }

    // Add event listener to the form submit button
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', function(event) {
            if (!validateForm()) {
                event.preventDefault();
            }
        });
    }
});
