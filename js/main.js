/**
 * 4154 Tattoo Shop - Main JavaScript
 * Luxury interactive functionality
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // Set current year in footer
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // ================================
    // HERO CAROUSEL FUNCTIONALITY
    // ================================

    const carousel = document.querySelector('.hero-carousel');
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    
    let currentSlide = 0;
    let carouselInterval;

    function showSlide(index) {
        // Remove active class from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current slide and indicator
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        if (indicators[index]) {
            indicators[index].classList.add('active');
        }
        
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }

    function startCarousel() {
        carouselInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function stopCarousel() {
        if (carouselInterval) {
            clearInterval(carouselInterval);
        }
    }

    // Initialize carousel if elements exist
    if (carousel && slides.length > 0) {
        // Set up event listeners for navigation buttons
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                stopCarousel();
                startCarousel(); // Restart auto-play
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                stopCarousel();
                startCarousel(); // Restart auto-play
            });
        }

        // Set up event listeners for indicators
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                showSlide(index);
                stopCarousel();
                startCarousel(); // Restart auto-play
            });
        });

        // Pause carousel on hover
        carousel.addEventListener('mouseenter', stopCarousel);
        carousel.addEventListener('mouseleave', startCarousel);

        // Start auto-play
        startCarousel();

        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;

        carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });

        function handleSwipe() {
            const swipeThreshold = 50;
            const swipeDistance = touchEndX - touchStartX;
            
            if (Math.abs(swipeDistance) > swipeThreshold) {
                if (swipeDistance > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
                stopCarousel();
                startCarousel();
            }
        }

        console.log('✨ Hero Carousel initialized with', slides.length, 'slides');
    }

    // ================================
    // NAVIGATION FUNCTIONALITY
    // ================================

    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }

    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    });

    // Header scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (header) {
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        lastScrollTop = scrollTop;
    });

    // ================================
    // SMOOTH SCROLLING
    // ================================

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 120; // Account for fixed header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Smooth scroll for hero buttons
    const heroButtons = document.querySelectorAll('.hero-buttons a[href^="#"]');
    heroButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 120;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Scroll indicator in hero
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const gallerySection = document.querySelector('#gallery');
            if (gallerySection) {
                const offsetTop = gallerySection.offsetTop - 120;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    }

    // ================================
    // BACK TO TOP BUTTON
    // ================================

    const backToTopBtn = document.getElementById('back-to-top');
    
    function updateBackToTopVisibility() {
        if (backToTopBtn) {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
    }

    window.addEventListener('scroll', updateBackToTopVisibility);

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ================================
    // GALLERY FUNCTIONALITY
    // ================================

    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalClose = document.querySelector('.modal-close');

    // Open modal when clicking gallery items
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const overlay = this.querySelector('.gallery-overlay');
            
            if (img && modal && modalImage) {
                const title = overlay?.querySelector('h3')?.textContent || 'Luxury Tattoo Art';
                const description = overlay?.querySelector('p')?.textContent || 'Masterful craftsmanship and artistic excellence.';
                
                modalImage.src = img.src;
                modalImage.alt = img.alt;
                
                if (modalTitle) modalTitle.textContent = title;
                if (modalDescription) modalDescription.textContent = description;
                
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Close modal
    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // ================================
    // FORM FUNCTIONALITY
    // ================================

    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                message: formData.get('message')
            };
            
            // Simulate form submission
            const submitBtn = this.querySelector('.btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.style.pointerEvents = 'none';
            
            setTimeout(() => {
                // Show success message
                showSuccessMessage();
                
                // Reset form
                this.reset();
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.style.pointerEvents = 'auto';
                
                // Reset form labels
                const formGroups = this.querySelectorAll('.form-group');
                formGroups.forEach(group => {
                    const input = group.querySelector('input, textarea');
                    const label = group.querySelector('label');
                    if (input && label) {
                        if (!input.value.trim()) {
                            label.style.top = '20px';
                            label.style.fontSize = '1rem';
                            label.style.color = 'var(--silver)';
                            label.style.background = 'transparent';
                        }
                    }
                });
                
            }, 2000);
        });
    }

    // Success message function
    function showSuccessMessage() {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, var(--primary-gold), var(--rich-gold));
            color: var(--deep-black);
            padding: 30px 40px;
            border-radius: 15px;
            font-family: var(--font-primary);
            font-size: 1.1rem;
            font-weight: 600;
            z-index: 3000;
            box-shadow: var(--deep-shadow);
            text-align: center;
            min-width: 300px;
        `;
        
        successDiv.innerHTML = `
            <i class="fas fa-check-circle" style="font-size: 2rem; margin-bottom: 15px; display: block;"></i>
            <strong>Message Sent Successfully!</strong><br>
            <span style="font-weight: 400; font-size: 0.95rem;">We'll contact you within 24 hours.</span>
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.style.opacity = '0';
            successDiv.style.transform = 'translate(-50%, -50%) scale(0.9)';
            successDiv.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                document.body.removeChild(successDiv);
            }, 300);
        }, 3000);
    }

    // ================================
    // TOUCH INTERACTIONS FOR ALL ELEMENTS
    // ================================

    // Apply touch effects to all existing interactive elements
    function initializeTouchEffects() {
        // Gallery items
        const galleryItems = document.querySelectorAll('.gallery-item');
        galleryItems.forEach(item => addTouchEffects(item));

        // Service cards
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => addTouchEffects(card));

        // Testimonial cards
        const testimonialCards = document.querySelectorAll('.testimonial-card');
        testimonialCards.forEach(card => addTouchEffects(card));

        // Filter buttons
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => addTouchEffects(btn));

        console.log('✨ Touch effects initialized for all interactive elements');
    }

    // Initialize touch effects after DOM is ready
    initializeTouchEffects();

    // Add touch effects to share buttons when they're added
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(btn => addTouchEffects(btn));

    // ================================
    // ANIMATIONS & EFFECTS
    // ================================

    // Parallax effect for hero background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        
        if (hero) {
            const rate = scrolled * -0.5;
            hero.style.backgroundPosition = `center ${rate}px`;
        }
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for scroll animations
    const animateElements = document.querySelectorAll('.gallery-item, .feature, .contact-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // ================================
    // LUXURY LOADING EFFECT
    // ================================

    // Add loading effect to images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        if (img.complete) {
            img.style.opacity = '1';
        } else {
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
        }
    });

    // ================================
    // MOUSE CURSOR EFFECTS
    // ================================

    // Custom cursor for luxury feel (desktop only)
    if (window.innerWidth > 768) {
        const cursor = document.createElement('div');
        cursor.style.cssText = `
            width: 20px;
            height: 20px;
            border: 2px solid var(--primary-gold);
            border-radius: 50%;
            position: fixed;
            pointer-events: none;
            z-index: 9999;
            transition: transform 0.1s ease;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(cursor);

        document.addEventListener('mousemove', function(e) {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });

        // Scale cursor on hover
        const hoverElements = document.querySelectorAll('a, button, .gallery-item, .view-btn');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(1.5)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
            });
        });
    }

    // ================================
    // INTERACTIVE GALLERY FUNCTIONALITY
    // ================================

    // Gallery data with authentic tattoo images from 4154 Tattoo Shop
    const galleryImages = [
        { src: 'images/tattoos/color-floral-design.jpeg', category: 'color', title: 'Color Floral Design' },
        { src: 'images/tattoos/detailed-portrait-work.jpeg', category: 'portraits', title: 'Detailed Portrait Work' },
        { src: 'images/tattoos/black-gray-artistry.jpeg', category: 'traditional', title: 'Black & Gray Artistry' },
        { src: 'images/tattoos/fine-line-geometric.jpeg', category: 'geometric', title: 'Fine Line Geometric' },
        { src: 'images/tattoos/memorial-tribute.jpeg', category: 'traditional', title: 'Memorial Tribute' },
        { src: 'images/tattoos/custom-design-work.jpeg', category: 'geometric', title: 'Custom Design Work' },
        { src: 'images/tattoos/realistic-portrait.jpeg', category: 'portraits', title: 'Realistic Portrait' },
        { src: 'images/tattoos/vibrant-color-masterpiece.jpeg', category: 'color', title: 'Vibrant Color Masterpiece' },
        { src: 'images/tattoos/traditional-style.jpeg', category: 'traditional', title: 'Traditional Style' }
    ];

    let currentFilter = 'all';
    let imagesPerLoad = 8;
    let currentlyLoaded = 0;

    const galleryGrid = document.getElementById('interactive-gallery-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const filterBtns = document.querySelectorAll('.filter-btn');

    if (galleryGrid && loadMoreBtn) {
        // Initialize gallery
        initializeInteractiveGallery();

        // Filter functionality
        filterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Update active filter button
                filterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Set current filter
                currentFilter = this.dataset.filter;
                currentlyLoaded = 0;
                
                // Clear gallery and reload
                galleryGrid.innerHTML = '';
                loadImages();
            });
        });

        // Load more functionality
        loadMoreBtn.addEventListener('click', loadImages);
    }

    function initializeInteractiveGallery() {
        loadImages();
        console.log('✨ Interactive Gallery initialized with', galleryImages.length, 'images');
    }

    function getFilteredImages() {
        if (currentFilter === 'all') {
            return galleryImages;
        }
        return galleryImages.filter(img => img.category === currentFilter);
    }

    function loadImages() {
        const filteredImages = getFilteredImages();
        const imagesToLoad = filteredImages.slice(currentlyLoaded, currentlyLoaded + imagesPerLoad);
        
        imagesToLoad.forEach((image, index) => {
            setTimeout(() => {
                createGalleryItem(image);
            }, index * 100); // Stagger the loading for animation effect
        });
        
        currentlyLoaded += imagesToLoad.length;
        
        // Update load more button
        if (currentlyLoaded >= filteredImages.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-flex';
        }
    }

    function createGalleryItem(imageData) {
        const item = document.createElement('div');
        item.className = 'interactive-item';
        item.innerHTML = `
            <img src="${imageData.src}" alt="${imageData.title}" loading="lazy">
            <div class="interactive-overlay">
                <div class="overlay-content">
                    <div class="overlay-icon">
                        <i class="fas fa-search-plus"></i>
                    </div>
                    <div class="overlay-text">${imageData.title}</div>
                </div>
            </div>
        `;
        
        // Add click event to open modal
        item.addEventListener('click', function() {
            openImageModal(imageData.src, imageData.title);
        });
        
        // Add touch event handlers for mobile
        addTouchEffects(item);
        
        galleryGrid.appendChild(item);
    }

    // Add touch effects to elements
    function addTouchEffects(element) {
        let touchStartTime = 0;
        let touchStartY = 0;
        let touchStartX = 0;
        let hasMoved = false;
        
        element.addEventListener('touchstart', function(e) {
            touchStartTime = Date.now();
            touchStartY = e.touches[0].clientY;
            touchStartX = e.touches[0].clientX;
            hasMoved = false;
            
            // Add effect with slight delay to avoid interfering with scroll
            setTimeout(() => {
                if (!hasMoved) {
                    this.classList.add('touch-active');
                }
            }, 50);
        }, { passive: true });
        
        element.addEventListener('touchmove', function(e) {
            const currentY = e.touches[0].clientY;
            const currentX = e.touches[0].clientX;
            const moveThreshold = 10;
            
            // Check if user is scrolling/swiping
            if (Math.abs(currentY - touchStartY) > moveThreshold || 
                Math.abs(currentX - touchStartX) > moveThreshold) {
                hasMoved = true;
                this.classList.remove('touch-active');
            }
        }, { passive: true });
        
        element.addEventListener('touchend', function(e) {
            const touchDuration = Date.now() - touchStartTime;
            const self = this;
            
            // Only keep effect if it was a tap, not a scroll
            if (!hasMoved && touchDuration < 500) {
                setTimeout(() => {
                    self.classList.remove('touch-active');
                }, 100);
            } else {
                self.classList.remove('touch-active');
            }
        }, { passive: true });
        
        element.addEventListener('touchcancel', function() {
            this.classList.remove('touch-active');
        }, { passive: true });
    }

    function openImageModal(src, title) {
        const modal = document.getElementById('image-modal');
        const modalImage = document.getElementById('modal-image');
        const modalTitle = document.getElementById('modal-title');
        const modalDescription = document.getElementById('modal-description');
        
        if (modal && modalImage) {
            modalImage.src = src;
            modalImage.alt = title;
            
            if (modalTitle) modalTitle.textContent = title;
            if (modalDescription) modalDescription.textContent = 'Luxury tattoo artistry showcasing exceptional skill and creativity.';
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    console.log('✨ 4154 Tattoo Shop - Luxury experience initialized');
});

// ================================
// WEBSITE SHARING FUNCTIONS
// ================================

function shareToFacebook() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out 4154 Tattoo Shop - Luxury tattoo artistry at its finest!');
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`, '_blank', 'width=600,height=400');
}

function shareToTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out 4154 Tattoo Shop - Luxury tattoo artistry at its finest! 🎨✨');
    const hashtags = encodeURIComponent('TattooArt,LuxuryTattoo,4154TattooShop');
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}&hashtags=${hashtags}`, '_blank', 'width=600,height=400');
}

function shareToInstagram() {
    // Instagram doesn't support direct URL sharing via web, so we copy the link and show instructions
    copyWebsiteLink();
    alert('Link copied! Open Instagram and paste it in your story or bio. You can also take a screenshot of this website to share!');
}

function shareToWhatsApp() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out 4154 Tattoo Shop - Luxury tattoo artistry at its finest! ');
    window.open(`https://wa.me/?text=${text}${url}`, '_blank');
}

function copyWebsiteLink(button) {
    const url = window.location.href;
    
    if (navigator.clipboard && window.isSecureContext) {
        // Use modern clipboard API
        navigator.clipboard.writeText(url).then(() => {
            showCopySuccess(button);
        }).catch(() => {
            fallbackCopyText(url, button);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyText(url, button);
    }
}

function fallbackCopyText(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopySuccess(button);
    } catch (err) {
        console.error('Failed to copy text: ', err);
        alert('Please copy this link manually: ' + text);
    }
    
    document.body.removeChild(textArea);
}

function showCopySuccess(button) {
    if (button) {
        button.classList.add('copied');
        const originalIcon = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i>';
        
        setTimeout(() => {
            button.classList.remove('copied');
            button.innerHTML = originalIcon;
        }, 2000);
    }
    
    // Show a brief success message
    const message = document.createElement('div');
    message.textContent = 'Link copied to clipboard!';
    message.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #d4af37, #b8860b);
        color: #000;
        padding: 15px 20px;
        border-radius: 8px;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}