// Main JavaScript for AutoFarmingBot website
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // FAQ accordion functionality
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const icon = question.querySelector('i');
        
        question.addEventListener('click', function() {
            // Close other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    const otherIcon = otherItem.querySelector('.faq-question i');
                    otherAnswer.classList.add('hidden');
                    otherIcon.classList.remove('rotate-180');
                }
            });
            
            // Toggle current FAQ item
            answer.classList.toggle('hidden');
            icon.classList.toggle('rotate-180');
        });
    });
    
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    mobileMenu.classList.add('hidden');
                }
            }
        });
    });
    
    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .product-card, .faq-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
    
    // Navbar background on scroll (only if navbar exists)
    const navbar = document.querySelector('nav');
    if (navbar) {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 50) {
                navbar.classList.add('bg-dark-900/95');
                navbar.classList.remove('bg-dark-900/95');
            } else {
                navbar.classList.remove('bg-dark-900/95');
            }
            
            // Hide/show navbar on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
        
        // Add transition to navbar
        navbar.style.transition = 'transform 0.3s ease, background-color 0.3s ease';
    }
    
    // Auth Modal functionality (only if elements exist)
    const authModal = document.getElementById('authModal');
    const signInForm = document.getElementById('signInForm');
    const signUpForm = document.getElementById('signUpForm');
    const closeAuthModal = document.getElementById('closeAuthModal');
    const getStartedBtns = document.querySelectorAll('#getStartedBtn, .get-started-btn');
    const showSignUpBtn = document.getElementById('showSignUp');
    const showSignInBtn = document.getElementById('showSignIn');
    
    if (authModal && signInForm && signUpForm) {
        // Open auth modal when Get Started buttons are clicked
        if (getStartedBtns.length > 0) {
            getStartedBtns.forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    authModal.classList.remove('hidden');
                    document.body.style.overflow = 'hidden';
                    // Show sign in form by default
                    signInForm.classList.remove('hidden');
                    signUpForm.classList.add('hidden');
                });
            });
        }
        
        // Close modal
        if (closeAuthModal) {
            closeAuthModal.addEventListener('click', function() {
                authModal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            });
        }
        
        // Close modal when clicking outside
        authModal.addEventListener('click', function(e) {
            if (e.target === authModal) {
                authModal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
        });
        
        // Switch to sign up form
        if (showSignUpBtn) {
            showSignUpBtn.addEventListener('click', function() {
                signInForm.classList.add('hidden');
                signUpForm.classList.remove('hidden');
            });
        }
        
        // Switch to sign in form
        if (showSignInBtn) {
            showSignInBtn.addEventListener('click', function() {
                signUpForm.classList.add('hidden');
                signInForm.classList.remove('hidden');
            });
        }
        
        // Close modal with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !authModal.classList.contains('hidden')) {
                authModal.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }
        });
    }
    

    
    // Utility functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            type === 'error' ? 'bg-red-500/20 border border-red-500/50 text-red-400' :
            type === 'success' ? 'bg-green-500/20 border border-green-500/50 text-green-400' :
            'bg-blue-500/20 border border-blue-500/50 text-blue-400'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // Particle animation in hero section (optional enhancement)
    createParticleEffect();
    
    function createParticleEffect() {
        const heroSection = document.querySelector('.gradient-bg, .relative.pt-24');
        if (!heroSection) return;
        
        const particles = [];
        const numParticles = 20;
        
        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'absolute w-1 h-1 bg-white/20 rounded-full';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 2 + 's';
            particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
            
            heroSection.appendChild(particle);
            particles.push(particle);
        }
        
        // Animate particles
        particles.forEach(particle => {
            particle.style.animation = 'float 4s ease-in-out infinite';
        });
    }
    
    // Add custom CSS for floating animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
        }
    `;
    document.head.appendChild(style);
});
