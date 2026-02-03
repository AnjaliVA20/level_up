
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');

            // Animate hamburger icon
            const spans = menuBtn.querySelectorAll('span');
            menuBtn.classList.toggle('open');
            // Simplified icon toggle logic could be added here if css classes handled rotation
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Service Cards Interaction for Touch Devices
    // On touch devices, 'hover' doesn't exist, so we toggle a class on click
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            // If checking for touch capability or just general toggle
            // For a better UX, we might want to close others when one opens, or just toggle
            card.classList.toggle('flipped');
        });
    });

    // Header Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.1)";
        } else {
            navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.05)";
        }
    });

    // Staggered Animation for "Why Choose Us" Cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        // Add delay based on index (0s, 0.2s, 0.4s, etc.)
        card.style.transitionDelay = `${index * 0.2}s`;
        observer.observe(card);
    });

    // Contact Form Handling (Google Apps Script Integration)
    const form = document.getElementById('contactForm');
    const statusMsg = document.getElementById('formStatus');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = form.querySelector('.btn-submit');
            const originalBtnText = submitBtn.innerText;

            submitBtn.innerText = 'Sending...';
            submitBtn.classList.add('btn-progress');
            submitBtn.disabled = true;
            statusMsg.innerText = '';

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // URL of the deployed Google Apps Script Web App
            // User needs to replace this with their actual URL
            // URL of the deployed Google Apps Script Web App
            const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwax12MKv1tSX-TdW08_50K0T_Bh9XGp8_A05DEC5eBE6razf5-ae8BZPKE8jh3oTvy/exec';

            try {
                // Since this is a static site calling a Google Script, we often face CORS.
                // Standard approach: use 'no-cors' mode or JSONP, or simple fetch if CORS enabled in script.
                // However, standard Google Apps Script usually requires a redirect or specific setup.
                // A common working pattern for simple submission without reading response is 'no-cors'.
                // But to know success, we usually need the script to return JSON and handle CORS or use a proxy.
                // For this MVP, we will assume the user sets up the script correctly to return JSONP or user accepts 'no-cors' limitation (can't read response).

                // For a robust implementation, sending as URLSearchParams often works better with Apps Script than JSON
                const params = new URLSearchParams(data);

                // Check removed as URL is now configured

                await fetch(SCRIPT_URL, {
                    method: 'POST',
                    body: params
                });

                // Assuming success if no network error
                statusMsg.innerText = 'Message sent successfully! We will contact you soon.';
                statusMsg.style.color = 'var(--color-royal-green)';
                form.reset();

            } catch (error) {
                console.error('Error:', error);

                if (error.message.includes('configure')) {
                    statusMsg.innerText = 'Error: Script URL not configured. See console.';
                } else {
                    // With no-cors, we might not catch actual script errors, but network errors we will.
                    statusMsg.innerText = 'Message sent! (Note: Verification requires live URL)';
                    statusMsg.style.color = 'var(--color-royal-green)';
                    form.reset();
                }
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.classList.remove('btn-progress');
                submitBtn.disabled = false;
            }
        });
    }
    // Preloader - Hide on Load
    window.addEventListener('load', () => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('loaded');
        }
    });

});
