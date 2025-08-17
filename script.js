// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Check if it's a cross-page navigation (contains .html)
            if (href.includes('.html')) {
                // Allow default navigation to different pages
                return;
            }
            
            // Handle same-page navigation with smooth scrolling
            e.preventDefault();
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
    
    // Book a call/demo button functionality removed
    // Now using proper HTML anchor tags with href attributes
    
    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        lastScrollY = currentScrollY;
        
        // Update footer background to match section
        updateFooterBackground();
    });
    
    // Footer background matching function
    function updateFooterBackground() {
        const footer = document.querySelector('.footer');
        if (!footer) return;
        
        const sections = document.querySelectorAll('section');
        const windowHeight = window.innerHeight;
        const scrollY = window.scrollY;
        
        // Find which section is at the bottom of the viewport (where footer appears)
        let activeSection = null;
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionTop = scrollY + rect.top;
            const sectionBottom = sectionTop + rect.height;
            const viewportBottom = scrollY + windowHeight;
            
            // Check if this section is at the bottom of the viewport
            if (viewportBottom >= sectionTop && viewportBottom <= sectionBottom + 100) {
                activeSection = section;
            }
        });
        
        // Set footer background based on active section
        if (activeSection) {
            const classList = activeSection.classList;
            
            // Check if it's a wash background section (hero, cta)
            if (classList.contains('hero') || classList.contains('cta')) {
                footer.style.background = '#f8fdfb';
                footer.style.color = '#1f2a37';
            } else {
                // Check if it's an even or odd section for alternating colors
                const sections = Array.from(document.querySelectorAll('section'));
                const sectionIndex = sections.indexOf(activeSection);
                
                if (sectionIndex % 2 === 0) {
                    // Even sections - wash background
                    footer.style.background = '#f8fdfb';
                    footer.style.color = '#1f2a37';
                } else {
                    // Odd sections - white background gets white footer
                    footer.style.background = '#ffffff';
                    footer.style.color = '#1f2a37';
                }
            }
        } else {
            // Default to wash footer (for hero)
            footer.style.background = '#f8fdfb';
            footer.style.color = '#1f2a37';
        }
    }
    
    // Initial call to set footer background
    updateFooterBackground();
    
    // Animate elements on scroll
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
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.problem-card, .feature-card, .stat-card, .partner-card');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Dashboard mockup interaction
    const dashboardMockup = document.querySelector('.dashboard-mockup');
    if (dashboardMockup) {
        dashboardMockup.addEventListener('mouseenter', function() {
            this.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1.02)';
        });
        
        dashboardMockup.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateY(-5deg) rotateX(5deg) scale(1)';
        });
    }
    
    // Counter animation for statistics
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }
    
    // Animate statistics when they come into view
    const statObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target.querySelector('.stat-number');
                if (statNumber && !statNumber.classList.contains('animated')) {
                    const text = statNumber.textContent;
                    const number = parseInt(text.replace(/[^\d]/g, ''));
                    
                    if (!isNaN(number) && number > 0) {
                        statNumber.classList.add('animated');
                        statNumber.textContent = '0';
                        setTimeout(() => {
                            animateCounter(statNumber, number);
                        }, 200);
                    }
                }
            }
        });
    }, { threshold: 0.5 });
    
    // Observe stat cards
    const statCards = document.querySelectorAll('.stat-card, .hero-stats .stat');
    statCards.forEach(card => {
        statObserver.observe(card);
    });
    
    // Add ripple effect to buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Add ripple effect styles
    const style = document.createElement('style');
    style.textContent = `
        .primary-button, .secondary-button, .cta-button {
            position: relative;
            overflow: hidden;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.primary-button, .secondary-button, .cta-button');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.hero-visual');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
    
    // Form submission handling (if forms are added later)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add your form submission logic here
            console.log('Form submitted');
        });
    });
    
    // Active navigation link highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
    // Lazy loading for images (if images are added)
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
    
    // Typewriter effect for hero title (optional enhancement)
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }
    
    // Initialize typewriter effect on hero title (uncomment if desired)
    // const heroTitle = document.querySelector('.hero-title');
    // if (heroTitle) {
    //     const originalText = heroTitle.textContent;
    //     setTimeout(() => {
    //         typeWriter(heroTitle, originalText, 50);
    //     }, 1000);
    // }
});

// Utility functions
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Resize handler with debounce
const handleResize = debounce(function() {
    // Handle resize logic here if needed
    console.log('Window resized');
}, 250);

window.addEventListener('resize', handleResize);

// Add custom cursor effects (optional enhancement)
document.addEventListener('mousemove', function(e) {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// Performance optimization: Intersection Observer for animations
const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, { 
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

// Dark mode toggle (if implementing dark mode)
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Load dark mode preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Error handling for missing elements
function safeQuerySelector(selector) {
    try {
        return document.querySelector(selector);
    } catch (error) {
        console.warn(`Element not found: ${selector}`);
        return null;
    }
}

// Initialize tooltips (if using tooltip library)
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            // Tooltip logic here
        });
    });
}

// Call initialization functions
initTooltips(); 