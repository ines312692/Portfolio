// Enhanced Portfolio JavaScript with Animations
(function() {
    'use strict';

    // DOM Elements
    const doc = document.documentElement;
    const navbar = document.getElementById('navbar');
    const themeToggle = document.getElementById('themeToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuDropdown = document.getElementById('mobileMenuDropdown');
    const backToTop = document.getElementById('backToTop');
    const yearElement = document.getElementById('year');

    // Animation Observer
    let animationObserver;

    // Initialize everything when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initTheme();
        initNavigation();
        initAnimations();
        initScrollEffects();
        initMobileMenu();
        initBackToTop();
        initTypingEffect();
        initParticles();
        setCurrentYear();
        addInteractiveEffects();
    });

    // Theme Management
    function initTheme() {
        const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
        const savedTheme = localStorage.getItem('theme');
        const initialTheme = savedTheme || (prefersLight ? 'light' : 'dark');

        setTheme(initialTheme);

        if (themeToggle) {
            themeToggle.addEventListener('click', toggleTheme);
        }
    }

    function setTheme(theme) {
        doc.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);

        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (theme === 'light') {
                icon.className = 'fa-regular fa-moon';
            } else {
                icon.className = 'fa-solid fa-sun';
            }
        }
    }

    function toggleTheme() {
        const currentTheme = doc.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);

        // Add theme transition effect
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    // Navigation Effects
    function initNavigation() {
        let lastScrollTop = 0;
        const scrollThreshold = 100;

        function handleNavbarScroll() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Add/remove scrolled class
            if (scrollTop > 10) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide/show navbar on scroll
            if (scrollTop > scrollThreshold) {
                if (scrollTop > lastScrollTop && !mobileMenuDropdown.classList.contains('active')) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
            } else {
                navbar.style.transform = 'translateY(0)';
            }

            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        }

        window.addEventListener('scroll', throttle(handleNavbarScroll, 16));

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);

                if (targetElement) {
                    const navHeight = navbar.offsetHeight;
                    const targetPosition = targetElement.offsetTop - navHeight - 20;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    if (mobileMenuDropdown.classList.contains('active')) {
                        toggleMobileMenu();
                    }

                    // Add active state animation
                    link.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        link.style.transform = '';
                    }, 150);
                }
            });
        });
    }

    // Mobile Menu
    function initMobileMenu() {
        if (mobileMenu) {
            mobileMenu.addEventListener('click', toggleMobileMenu);
        }

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuDropdown.contains(e.target)) {
                if (mobileMenuDropdown.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    }

    function toggleMobileMenu() {
        mobileMenuDropdown.classList.toggle('active');
        const icon = mobileMenu.querySelector('i');

        if (mobileMenuDropdown.classList.contains('active')) {
            icon.className = 'fas fa-times';
            mobileMenu.style.transform = 'rotate(180deg)';
        } else {
            icon.className = 'fas fa-bars';
            mobileMenu.style.transform = 'rotate(0deg)';
        }
    }

    // Animation System
    function initAnimations() {
        // Create intersection observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        animationObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const delay = parseInt(element.dataset.delay) || 0;

                    setTimeout(() => {
                        element.classList.add('animate');

                        // Add special effects for certain elements
                        if (element.classList.contains('skill-category')) {
                            animateSkillIcons(element);
                        }
                        if (element.classList.contains('certification-card')) {
                            animateCertificationCard(element);
                        }
                    }, delay);

                    animationObserver.unobserve(element);
                }
            });
        }, observerOptions);

        // Observe all animated elements
        document.querySelectorAll('[data-animation]').forEach(element => {
            animationObserver.observe(element);
        });

        // Special animation for education timeline
        animateEducationTimeline();
    }

    function animateSkillIcons(category) {
        const icons = category.querySelectorAll('.skill-icon, .tech-icon');
        icons.forEach((icon, index) => {
            setTimeout(() => {
                icon.style.transform = 'scale(1.1)';
                icon.style.background = 'rgba(255, 105, 180, 0.2)';
                setTimeout(() => {
                    icon.style.transform = '';
                    icon.style.background = '';
                }, 200);
            }, index * 100);
        });
    }

    function animateCertificationCard(card) {
        const badge = card.querySelector('.cert-badge');
        if (badge) {
            badge.style.animation = 'bounce 0.6s ease';
            setTimeout(() => {
                badge.style.animation = '';
            }, 600);
        }
    }

    function animateEducationTimeline() {
        const timelineObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const item = entry.target;
                    const isOdd = Array.from(item.parentNode.children).indexOf(item) % 2 === 1;

                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = isOdd ? 'translateX(0)' : 'translateX(0)';
                    }, 200);
                }
            });
        }, { threshold: 0.2 });

        document.querySelectorAll('.education-item').forEach(item => {
            timelineObserver.observe(item);
        });
    }

    // Scroll Effects
    function initScrollEffects() {
        window.addEventListener('scroll', throttle(handleScrollEffects, 16));
    }

    function handleScrollEffects() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        // Parallax effect for hero background
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }

        // Update progress indicators
        updateScrollProgress();
    }

    function updateScrollProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;

        // You can add a progress bar here if desired
        document.documentElement.style.setProperty('--scroll-progress', `${scrolled}%`);
    }

    // Back to Top Button
    function initBackToTop() {
        if (!backToTop) return;

        window.addEventListener('scroll', throttle(() => {
            if (window.pageYOffset > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, 100));

        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Add click animation
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    }

    // Typing Effect for Hero Title
    function initTypingEffect() {
        const heroTitle = document.querySelector('.hero-title');
        if (!heroTitle) return;

        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.opacity = '1';

        let index = 0;
        function typeWriter() {
            if (index < text.length) {
                heroTitle.textContent += text.charAt(index);
                index++;
                setTimeout(typeWriter, 50);
            } else {
                // Add blinking cursor effect
                const cursor = document.createElement('span');
                cursor.textContent = '|';
                cursor.style.animation = 'blink 1s infinite';
                cursor.style.color = 'var(--primary-pink)';
                heroTitle.appendChild(cursor);

                setTimeout(() => {
                    if (cursor.parentNode) {
                        cursor.parentNode.removeChild(cursor);
                    }
                }, 3000);
            }
        }

        // Start typing effect after hero animation
        setTimeout(typeWriter, 1000);
    }

    // Particle System
    function initParticles() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const particleContainer = document.createElement('div');
        particleContainer.className = 'particles';
        particleContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        hero.appendChild(particleContainer);

        function createParticle() {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: 3px;
                height: 3px;
                background: var(--primary-pink);
                border-radius: 50%;
                opacity: 0.6;
                animation: float-particle ${5 + Math.random() * 10}s linear infinite;
                left: ${Math.random() * 100}%;
                top: 100%;
            `;

            particleContainer.appendChild(particle);

            setTimeout(() => {
                if (particle.parentNode) {
                    particle.parentNode.removeChild(particle);
                }
            }, 15000);
        }

        // Create particles periodically
        setInterval(createParticle, 2000);
    }

    // Interactive Effects
    function addInteractiveEffects() {
        // Add hover effects to skill icons
        document.querySelectorAll('.skill-icon, .tech-icon').forEach(icon => {
            icon.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.05) rotate(2deg)';
                this.style.boxShadow = '0 10px 25px rgba(255, 105, 180, 0.3)';
            });

            icon.addEventListener('mouseleave', function() {
                this.style.transform = '';
                this.style.boxShadow = '';
            });
        });

        // Add click effects to buttons
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.5);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;

                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);

                setTimeout(() => {
                    if (ripple.parentNode) {
                        ripple.parentNode.removeChild(ripple);
                    }
                }, 600);
            });
        });

        // Add magnetic effect to contact cards
        document.querySelectorAll('.contact-card').forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const deltaX = (e.clientX - centerX) * 0.1;
                const deltaY = (e.clientY - centerY) * 0.1;

                this.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.02)`;
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });

        // Add tilt effect to project cards
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const rotateX = (e.clientY - centerY) / 10;
                const rotateY = (centerX - e.clientX) / 10;

                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }

    // Utility Functions
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    function setCurrentYear() {
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    // Add CSS animations dynamically
    function addDynamicStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
            
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
            
            @keyframes float-particle {
                0% {
                    transform: translateY(0) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 0.6;
                }
                90% {
                    opacity: 0.6;
                }
                100% {
                    transform: translateY(-100vh) rotate(360deg);
                    opacity: 0;
                }
            }
            
            @keyframes pulse-glow {
                0%, 100% {
                    box-shadow: 0 0 20px rgba(255, 105, 180, 0.3);
                }
                50% {
                    box-shadow: 0 0 40px rgba(255, 105, 180, 0.6);
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Enhanced scroll animations
    function initAdvancedScrollEffects() {
        const sections = document.querySelectorAll('.section');
        let currentSection = 0;

        window.addEventListener('scroll', throttle(() => {
            const scrollTop = window.pageYOffset;
            const windowHeight = window.innerHeight;

            sections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionCenter = sectionTop + sectionHeight / 2;

                if (scrollTop + windowHeight / 2 >= sectionCenter &&
                    scrollTop + windowHeight / 2 < sectionCenter + sectionHeight) {
                    if (currentSection !== index) {
                        currentSection = index;
                        updateActiveNavLink(index);
                    }
                }
            });
        }, 100));
    }

    function updateActiveNavLink(sectionIndex) {
        const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav-links a');
        navLinks.forEach((link, index) => {
            if (index === sectionIndex) {
                link.style.color = 'var(--primary-pink)';
                link.style.transform = 'scale(1.05)';
            } else {
                link.style.color = '';
                link.style.transform = '';
            }
        });
    }

    // Loading screen
    function initLoadingScreen() {
        const loadingScreen = document.createElement('div');
        loadingScreen.id = 'loadingScreen';
        loadingScreen.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--dark-bg);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
            transition: opacity 0.5s ease;
        `;

        const loader = document.createElement('div');
        loader.style.cssText = `
            width: 60px;
            height: 60px;
            border: 3px solid rgba(255, 105, 180, 0.3);
            border-top: 3px solid var(--primary-pink);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        `;

        const loadingText = document.createElement('div');
        loadingText.textContent = 'Loading...';
        loadingText.style.cssText = `
            position: absolute;
            top: 60%;
            color: var(--primary-pink);
            font-weight: 600;
            letter-spacing: 2px;
        `;

        const spinStyle = document.createElement('style');
        spinStyle.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(spinStyle);

        loadingScreen.appendChild(loader);
        loadingScreen.appendChild(loadingText);
        document.body.appendChild(loadingScreen);

        // Remove loading screen when everything is loaded
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.style.opacity = '0';
                setTimeout(() => {
                    if (loadingScreen.parentNode) {
                        loadingScreen.parentNode.removeChild(loadingScreen);
                    }
                }, 500);
            }, 1000);
        });
    }

    // Interactive skill proficiency
    function initSkillProficiency() {
        document.querySelectorAll('.skill-icon').forEach(icon => {
            const skill = icon.dataset.skill;
            if (!skill) return;

            const proficiencyBar = document.createElement('div');
            proficiencyBar.style.cssText = `
                position: absolute;
                bottom: -3px;
                left: 0;
                height: 3px;
                background: var(--gradient-pink);
                border-radius: 2px;
                width: 0;
                transition: width 0.5s ease;
            `;

            icon.style.position = 'relative';
            icon.appendChild(proficiencyBar);

            let width = 0;
            switch(skill.toLowerCase()) {
                case 'advanced': width = 90; break;
                case 'intermediate': width = 70; break;
                case 'basic': width = 40; break;
                default: width = 50;
            }

            // Animate proficiency bar on hover
            icon.addEventListener('mouseenter', () => {
                proficiencyBar.style.width = width + '%';
            });

            icon.addEventListener('mouseleave', () => {
                proficiencyBar.style.width = '0';
            });
        });
    }

    // Enhanced project interactions
    function initProjectInteractions() {
        document.querySelectorAll('.project-card').forEach(card => {
            const techIcons = card.querySelectorAll('.tech-icon');

            // Add stagger animation to tech icons
            card.addEventListener('mouseenter', () => {
                techIcons.forEach((icon, index) => {
                    setTimeout(() => {
                        icon.style.transform = 'translateY(-3px) scale(1.1)';
                        icon.style.borderColor = 'var(--primary-pink)';
                    }, index * 50);
                });
            });

            card.addEventListener('mouseleave', () => {
                techIcons.forEach(icon => {
                    icon.style.transform = '';
                    icon.style.borderColor = '';
                });
            });

            // Add click to expand functionality
            const expandBtn = document.createElement('button');
            expandBtn.innerHTML = '<i class="fas fa-expand-alt"></i>';
            expandBtn.style.cssText = `
                position: absolute;
                top: 1rem;
                right: 1rem;
                background: rgba(255, 105, 180, 0.1);
                border: 1px solid rgba(255, 105, 180, 0.3);
                border-radius: 8px;
                color: var(--primary-pink);
                padding: 0.5rem;
                cursor: pointer;
                opacity: 0;
                transition: all 0.3s ease;
            `;

            card.style.position = 'relative';
            card.appendChild(expandBtn);

            card.addEventListener('mouseenter', () => {
                expandBtn.style.opacity = '1';
            });

            card.addEventListener('mouseleave', () => {
                expandBtn.style.opacity = '0';
            });

            expandBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openProjectModal(card);
            });
        });
    }

    function openProjectModal(projectCard) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;

        const modalContent = document.createElement('div');
        modalContent.innerHTML = projectCard.innerHTML;
        modalContent.style.cssText = `
            background: var(--gradient-dark);
            border-radius: 20px;
            padding: 3rem;
            max-width: 800px;
            max-height: 80vh;
            overflow-y: auto;
            border: 1px solid rgba(255, 105, 180, 0.3);
            animation: slideInUp 0.3s ease;
            position: relative;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.style.cssText = `
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            color: var(--primary-pink);
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 50%;
            transition: all 0.3s ease;
        `;

        closeBtn.addEventListener('click', () => {
            modal.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        });

        modalContent.appendChild(closeBtn);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeBtn.click();
            }
        });

        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                closeBtn.click();
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    // Add fade animations for modals
    function addModalAnimations() {
        const modalStyle = document.createElement('style');
        modalStyle.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(50px) scale(0.9);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
        `;
        document.head.appendChild(modalStyle);
    }

    // Contact form interactions
    function initContactInteractions() {
        document.querySelectorAll('.contact-card').forEach(card => {
            const link = card.querySelector('a');
            if (link) {
                card.addEventListener('click', () => {
                    // Add click animation
                    card.style.transform = 'scale(0.98)';
                    setTimeout(() => {
                        card.style.transform = '';
                        // Trigger the link
                        if (link.href.startsWith('mailto:') || link.href.startsWith('tel:')) {
                            window.location.href = link.href;
                        } else {
                            window.open(link.href, '_blank');
                        }
                    }, 150);
                });
            }
        });
    }

    // Certification verification
    function initCertificationEffects() {
        document.querySelectorAll('.certification-card').forEach(card => {
            const verification = card.querySelector('.cert-verification');
            if (verification) {
                card.addEventListener('mouseenter', () => {
                    verification.style.animation = 'pulse-glow 1s ease infinite';
                });

                card.addEventListener('mouseleave', () => {
                    verification.style.animation = '';
                });
            }
        });
    }

    // Initialize everything
    document.addEventListener('DOMContentLoaded', function() {
        initLoadingScreen();
        addDynamicStyles();
        addModalAnimations();
        initAdvancedScrollEffects();
        initSkillProficiency();
        initProjectInteractions();
        initContactInteractions();
        initCertificationEffects();
    });

    // Performance optimization
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateAnimations);
            ticking = true;
        }
    }

    function updateAnimations() {
        // Update any continuous animations here
        ticking = false;
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        switch(e.key) {
            case 'Home':
                e.preventDefault();
                document.querySelector('#home').scrollIntoView({ behavior: 'smooth' });
                break;
            case 'End':
                e.preventDefault();
                document.querySelector('#contact').scrollIntoView({ behavior: 'smooth' });
                break;
        }
    });

    // Add accessibility enhancements
    function initAccessibility() {
        // Add focus indicators
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('user-is-tabbing');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('user-is-tabbing');
        });

        // Add skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-pink);
            color: white;
            padding: 8px;
            z-index: 10000;
            text-decoration: none;
            border-radius: 4px;
            transition: top 0.3s;
        `;

        skipLink.addEventListener('focus', function() {
            this.style.top = '6px';
        });

        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main landmark
        const mainContent = document.querySelector('.hero');
        if (mainContent && !document.querySelector('main')) {
            const main = document.createElement('main');
            main.id = 'main';
            mainContent.parentNode.insertBefore(main, mainContent);
            main.appendChild(mainContent);

            // Move other sections into main
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => {
                main.appendChild(section);
            });
        }
    }

    // Analytics and tracking (placeholder)
    function initAnalytics() {
        // Track scroll depth
        let maxScroll = 0;
        window.addEventListener('scroll', throttle(() => {
            const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                // You can send this data to your analytics service
                console.log(`Max scroll depth: ${maxScroll}%`);
            }
        }, 1000));

        // Track time spent on sections
        const sectionTimes = {};
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const sectionId = entry.target.id;
                if (entry.isIntersecting) {
                    sectionTimes[sectionId] = Date.now();
                } else if (sectionTimes[sectionId]) {
                    const timeSpent = Date.now() - sectionTimes[sectionId];
                    console.log(`Time spent on ${sectionId}: ${Math.round(timeSpent / 1000)}s`);
                    delete sectionTimes[sectionId];
                }
            });
        }, { threshold: 0.5 });

        document.querySelectorAll('section[id]').forEach(section => {
            observer.observe(section);
        });
    }

    // Initialize accessibility and analytics
    document.addEventListener('DOMContentLoaded', function() {
        initAccessibility();
        initAnalytics();
    });

})();