function toggleMenu() {
    const nav = document.querySelector('nav ul');
    nav.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', function() {
    function addDropdownListeners() {
        var dropdown = document.querySelector('.dropdown');
        var dropdownContent = document.querySelector('.custom-dropdown-menu');

        if (dropdown && dropdownContent) {
            dropdown.addEventListener('mouseover', function() {
                dropdownContent.style.display = 'flex';
            });

            dropdown.addEventListener('mouseout', function(event) {
                if (!dropdown.contains(event.relatedTarget)) {
                    dropdownContent.style.display = 'none';
                }
            });

            dropdownContent.addEventListener('mouseover', function() {
                dropdownContent.style.display = 'flex';
            });

            dropdownContent.addEventListener('mouseout', function(event) {
                if (!dropdown.contains(event.relatedTarget)) {
                    dropdownContent.style.display = 'none';
                }
            });
        }
    }

    function animateLogo() {
        const logo = document.getElementById('logo');
        const headerLogo = document.getElementById('header-logo');

        if (logo && headerLogo) {
            setTimeout(() => {
                logo.style.display = 'none'; // Hide original logo
                document.body.classList.add('logo-faded');
                headerLogo.style.display = 'inline-block'; // Show header logo
                headerLogo.style.opacity = 1;
            }, 2000); // 2 seconds total for animations
        }
    }

    function loadHeaderFooter() {
        const headerPlaceholder = document.getElementById('header-placeholder');
        const footerPlaceholder = document.getElementById('footer-placeholder');

        if (headerPlaceholder) {
            fetch('header.html')
                .then(response => response.text())
                .then(data => {
                    headerPlaceholder.innerHTML = data;
                    addDropdownListeners();
                    if (window.location.pathname.endsWith('index.html')) {
                        animateLogo(); // Animate the logo on the index page
                    }
                }).catch(error => {
                    console.error('Error loading header:', error);
                });
        }

        if (footerPlaceholder) {
            fetch('footer.html')
                .then(response => response.text())
                .then(data => {
                    footerPlaceholder.innerHTML = data;
                }).catch(error => {
                    console.error('Error loading footer:', error);
                });
        }
    }

    // Event listener for the hamburger menu
    const navbarToggle = document.querySelector('.navbar-toggle');
    if (navbarToggle) {
        navbarToggle.addEventListener('click', toggleMenu);
    }

    loadHeaderFooter();
});
