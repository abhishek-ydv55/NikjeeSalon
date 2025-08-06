document.addEventListener('DOMContentLoaded', function() {

    // --- AOS INITIALIZATION ---
    // Initializes the "Animate on Scroll" library for fade-up effects.
    AOS.init({
        duration: 800,
        once: true, // Animation happens only once per element.
    });

    // --- SPLASH SCREEN ---
    // Hides the splash screen after a short delay to reveal the main site.
    const splashScreen = document.getElementById('splash-screen');
    if (splashScreen) {
        setTimeout(() => {
            splashScreen.classList.add('hidden');
        }, 2200); // Adjust this time (in milliseconds) as needed.
    }

    // --- STICKY NAVIGATION & HEADER TAGLINE ---
    // Adds a 'scrolled' class to the navigation when the user scrolls down.
    // This is used in CSS to change its appearance (e.g., background, padding).
    const stickyNav = document.querySelector('.sticky-nav');
    if (stickyNav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                stickyNav.classList.add('scrolled');
            } else {
                stickyNav.classList.remove('scrolled');
            }
        });
    }

    // --- MOBILE HAMBURGER MENU ---
    // Toggles the mobile navigation menu when the hamburger icon is clicked.
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.getElementById('nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            const isExpanded = navMenu.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
        });

        // Close the mobile menu when a navigation link is clicked.
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                }
            });
        });
    }

    // --- ABOUT US CAROUSEL ---
    // Manages the sliding functionality for the "About Us" section carousel.
    const aboutCarousels = document.querySelectorAll('.js-carousel');
    aboutCarousels.forEach(carousel => {
        const inner = carousel.querySelector('.carousel-inner');
        const slides = Array.from(inner.children);
        const nextBtn = carousel.querySelector('.next');
        const prevBtn = carousel.querySelector('.prev');
        const dotsContainer = carousel.querySelector('.carousel-dots');
        const dots = Array.from(dotsContainer.children);
        
        if (slides.length === 0) return; // Exit if no slides

        const slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;
        let autoPlayInterval;

        // Function to move to a specific slide
        const goToSlide = (index) => {
            // Clamp index within bounds
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;

            inner.style.transform = `translateX(-${slideWidth * index}px)`;
            
            // Update active class on slides
            slides.forEach(slide => slide.classList.remove('active'));
            slides[index].classList.add('active');

            // Update active class on dots
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            
            currentIndex = index;
        };

        // Set initial state
        goToSlide(0);

        // Event Listeners for next/prev buttons
        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
            resetAutoPlay();
        });
        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
            resetAutoPlay();
        });

        // Event Listeners for dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                goToSlide(index);
                resetAutoPlay();
            });
        });

        // Autoplay functionality
        const startAutoPlay = () => {
            autoPlayInterval = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, 5000); // Change slide every 5 seconds
        };

        const resetAutoPlay = () => {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        };

        startAutoPlay();
    });

    // --- 3D GALLERY LIGHTBOX ---
    // Handles opening the lightbox when a gallery item is clicked.
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        const galleryItems3D = document.querySelectorAll('.carousel-3d-item');
        const lightboxImage = lightbox.querySelector('.lightbox-image');
        const lightboxCaption = lightbox.querySelector('.lightbox-caption');
        const lightboxCaptionContainer = lightbox.querySelector('.lightbox-caption-container');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const nextBtn = lightbox.querySelector('.lightbox-next');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const bookBtn = lightbox.querySelector('.lightbox-book-btn');

        let currentIndex = 0;
        const galleryData = Array.from(galleryItems3D).map(item => ({
            src: item.dataset.lightboxSrc,
            caption: item.dataset.lightboxCaption
        }));

        const showImage = (index) => {
            lightboxImage.classList.add('loading');
            lightboxCaptionContainer.classList.add('loading');

            setTimeout(() => {
                const item = galleryData[index];
                lightboxImage.src = item.src;
                lightboxCaption.textContent = item.caption;
                setTimeout(() => {
                    lightboxImage.classList.remove('loading');
                    lightboxCaptionContainer.classList.remove('loading');
                }, 50);
            }, 300);
        };

        const openLightbox = (index) => {
            currentIndex = index;
            showImage(currentIndex);
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        };

        const showNextImage = () => {
            currentIndex = (currentIndex + 1) % galleryData.length;
            showImage(currentIndex);
        };

        const showPrevImage = () => {
            currentIndex = (currentIndex - 1 + galleryData.length) % galleryData.length;
            showImage(currentIndex);
        };

        galleryItems3D.forEach((item, index) => item.addEventListener('click', () => openLightbox(index)));
        closeBtn.addEventListener('click', closeLightbox);
        nextBtn.addEventListener('click', showNextImage);
        prevBtn.addEventListener('click', showPrevImage);
        lightbox.addEventListener('click', (e) => e.target === lightbox && closeLightbox());
        bookBtn.addEventListener('click', closeLightbox);
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('active')) {
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowRight') showNextImage();
                if (e.key === 'ArrowLeft') showPrevImage();
            }
        });
    }

    // --- CONTACT FORM TO WHATSAPP ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const ownerPhoneNumber = '919564631320';
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const message = document.getElementById('message').value;
            const fullMessage = `Hello, I'd like to book an appointment.\n\nName: ${name}\nPhone: ${phone}\n\nMessage: ${message}`;
            const encodedMessage = encodeURIComponent(fullMessage);
            const whatsappUrl = `https://wa.me/${ownerPhoneNumber}?text=${encodedMessage}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // --- BACK TO TOP BUTTON ---
    const backToTopBtn = document.getElementById('back-to-top-btn');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            backToTopBtn.classList.toggle('show', window.scrollY > 300);
        });
    }
});