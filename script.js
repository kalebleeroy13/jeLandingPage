document.addEventListener('DOMContentLoaded', function() {
    function addDropdownListeners() {
        var dropdown = document.querySelector('.dropdown');
        var dropdownContent = document.querySelector('.custom-dropdown-menu');
        console.log('Dropdown and content:', dropdown, dropdownContent);

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
        console.log('Elements for animation:', { logo, headerLogo });

        if (logo && headerLogo) {
            logo.style.opacity = 1;
            logo.style.width = '150px';
            logo.style.height = 'auto';
            
            console.log('Starting logo animation...');
            setTimeout(() => {
                logo.style.opacity = 0;
                document.body.classList.add('logo-faded');
                headerLogo.style.display = 'inline-block';
                headerLogo.style.opacity = 1;
                console.log('Header logo displayed');
            }, 2000); // 2 seconds total for animations
        } else {
            console.error('Logo or Header Logo element not found');
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
                    console.log('Header loaded, now animating logo');
                    if (window.location.pathname.endsWith('index.html')) {
                        animateLogo(); // Animate the logo on the index page
                    } else {
                        const headerLogo = document.getElementById('header-logo');
                        if (headerLogo) {
                            headerLogo.style.display = 'inline-block';
                            headerLogo.style.opacity = 1;
                            console.log('Header logo displayed on other pages');
                        }
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
                    console.log('Footer loaded');
                }).catch(error => {
                    console.error('Error loading footer:', error);
                });
        }
    }

    // Load header and footer on every page
    loadHeaderFooter();
});
