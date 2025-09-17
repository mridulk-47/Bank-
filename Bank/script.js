// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            // Special handling for home section
            if (targetId === '#home') {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }
            
            const target = document.querySelector(targetId);
            if (target) {
                const navbar = document.querySelector('.navbar');
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20; // Extra 20px buffer
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background change on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    });

    // Services Read More functionality
    const readMoreBtns = document.querySelectorAll('.read-more-btn');
    readMoreBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const serviceCard = this.closest('.service-card');
            const serviceDetails = serviceCard.querySelector('.service-details');
            
            if (serviceDetails.classList.contains('expanded')) {
                serviceDetails.classList.remove('expanded');
                this.textContent = 'Read More';
                this.style.background = 'linear-gradient(45deg, #2c5aa0, #4a90e2)';
            } else {
                serviceDetails.classList.add('expanded');
                this.textContent = 'Read Less';
                this.style.background = 'linear-gradient(45deg, #ff6b6b, #ee5a24)';
            }
        });
    });

    // FAQ Toggle functionality
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        question.addEventListener('click', function() {
            // Close other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            answer.classList.toggle('active');
        });
    });

    // Testimonials functionality
    const testimonials = document.querySelectorAll('.testimonial');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentTestimonial = 0;
    let testimonialInterval;

    function showTestimonial(index) {
        testimonials.forEach(testimonial => {
            testimonial.classList.remove('active');
        });
        testimonials[index].classList.add('active');
    }

    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    }

    function prevTestimonial() {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonial);
    }

    function startTestimonialSlider() {
        testimonialInterval = setInterval(nextTestimonial, 10000); // Change every 10 seconds
    }

    function stopTestimonialSlider() {
        clearInterval(testimonialInterval);
    }

    // Initialize testimonials
    if (testimonials.length > 0) {
        showTestimonial(0);
        startTestimonialSlider();

        // Manual controls
        nextBtn.addEventListener('click', function() {
            stopTestimonialSlider();
            nextTestimonial();
            startTestimonialSlider();
        });

        prevBtn.addEventListener('click', function() {
            stopTestimonialSlider();
            prevTestimonial();
            startTestimonialSlider();
        });

        // Pause on hover
        const testimonialsContainer = document.querySelector('.testimonials-container');
        testimonialsContainer.addEventListener('mouseenter', stopTestimonialSlider);
        testimonialsContainer.addEventListener('mouseleave', startTestimonialSlider);
    }

    // Initialize EmailJS
    (function() {
        emailjs.init("HvUIOnPihl7j_J-e1");
    })();

    // Contact form handling with EmailJS
    const contactForm = document.getElementById('contactForm');
    const successModal = document.getElementById('successModal');
    const okBtn = document.getElementById('okBtn');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Prevent default form submission
            
            const submitBtn = document.getElementById('submitBtn');
            const originalContent = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            
            try {
                // Get form data
                const formData = new FormData(contactForm);
                const templateParams = {
                    from_name: formData.get('name'),
                    from_email: formData.get('email'),
                    from_phone: formData.get('phone') || 'Not provided',
                    subject: formData.get('subject'),
                    message: formData.get('message'),
                    reply_to: formData.get('email'),
                    to_email: 'yummybits2025@gmail.com'
                };
                
                console.log('Sending email with params:', templateParams);
                
                let emailjsResponse;
                let formspreeResponse;
                
                // Send email using EmailJS for immediate feedback
                try {
                    emailjsResponse = await emailjs.send(
                        'service_xbo6ycr',
                        'template_lhtgle6',
                        templateParams
                    );
                    console.log('EmailJS sent successfully:', emailjsResponse);
                } catch (emailjsError) {
                    console.log('EmailJS failed, trying sendForm method:', emailjsError);
                    try {
                        emailjsResponse = await emailjs.sendForm(
                            'service_xbo6ycr',
                            'template_lhtgle6',
                            contactForm
                        );
                        console.log('EmailJS sendForm successful:', emailjsResponse);
                    } catch (sendFormError) {
                        console.log('EmailJS sendForm also failed:', sendFormError);
                    }
                }
                
                // Also submit to Formspree to ensure yummybits2025@gmail.com receives the email
                try {
                    formspreeResponse = await fetch(contactForm.action, {
                        method: 'POST',
                        body: formData,
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                    console.log('Formspree submission result:', formspreeResponse);
                } catch (formspreeError) {
                    console.log('Formspree submission failed:', formspreeError);
                }
                
                // Show success if either EmailJS or Formspree worked
                if ((emailjsResponse && emailjsResponse.status === 200) || (formspreeResponse && formspreeResponse.ok)) {
                    // Show success modal
                    successModal.classList.add('show');
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Reset button
                    submitBtn.innerHTML = originalContent;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('loading');
                    submitBtn.classList.add('success');
                    
                    // Remove success class after animation
                    setTimeout(() => {
                        submitBtn.classList.remove('success');
                    }, 600);
                    
                    console.log('Email sent successfully:', response);
                } else {
                    throw new Error('Email sending failed');
                }
                
            } catch (error) {
                console.error('Email sending error:', error);
                
                // Show error state
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Error - Try Again';
                submitBtn.style.background = 'linear-gradient(45deg, #dc3545, #c82333)';
                
                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = originalContent;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('loading');
                    submitBtn.style.background = '';
                }, 3000);
            }
        });
    }
    
    // Handle OK button click in success modal
    if (okBtn) {
        okBtn.addEventListener('click', function() {
            successModal.classList.remove('show');
        });
    }
    
    // Close modal when clicking outside
    if (successModal) {
        successModal.addEventListener('click', function(e) {
            if (e.target === successModal) {
                successModal.classList.remove('show');
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && successModal && successModal.classList.contains('show')) {
            successModal.classList.remove('show');
        }
    });

    // Scroll animations
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
    const animateElements = document.querySelectorAll('.staff-card, .service-card, .step, .faq-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add hover effects to buttons
    const buttons = document.querySelectorAll('button, .cta-button');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(0)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-2px)';
        });
    });

    // Add 3D card effects
    const cards = document.querySelectorAll('.staff-card, .service-card, .step');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) rotateX(5deg) rotateY(5deg)';
            this.style.boxShadow = '0 20px 50px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        });
    });

    // Add glowing effects to important elements
    const glowElements = document.querySelectorAll('.cta-button, .submit-btn, .read-more-btn');
    glowElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 20px rgba(44, 90, 160, 0.5)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        // If image is already loaded
        if (img.complete) {
            img.style.opacity = '1';
        }
    });

    // Counter animation for stats
    const stats = document.querySelectorAll('.stat h3');
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const numericValue = parseInt(finalValue.replace(/\D/g, ''));
                const suffix = finalValue.replace(/\d/g, '');
                
                let currentValue = 0;
                const increment = numericValue / 50;
                
                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= numericValue) {
                        target.textContent = finalValue;
                        clearInterval(counter);
                    } else {
                        target.textContent = Math.floor(currentValue) + suffix;
                    }
                }, 50);
                
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Add ripple effect to buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    }

    // Add ripple CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 600ms linear;
            background-color: rgba(255, 255, 255, 0.6);
        }
        
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // Apply ripple effect to buttons
    const rippleButtons = document.querySelectorAll('button, .cta-button, .submit-btn, .read-more-btn');
    rippleButtons.forEach(button => {
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.addEventListener('click', createRipple);
    });

    // Add typing effect to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        let i = 0;
        
        function typeWriter() {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        setTimeout(typeWriter, 1000);
    }

    // Add floating animation to some elements
    const floatingElements = document.querySelectorAll('.step-number');
    floatingElements.forEach((element, index) => {
        element.style.animation = `float 3s ease-in-out infinite ${index * 0.5}s`;
    });

    // Add float animation CSS
    const floatStyle = document.createElement('style');
    floatStyle.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-10px);
            }
        }
    `;
    document.head.appendChild(floatStyle);

    // Add pulse animation to CTA button
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        setInterval(() => {
            ctaButton.style.animation = 'pulse 1s ease-in-out';
            setTimeout(() => {
                ctaButton.style.animation = '';
            }, 1000);
        }, 5000);
    }

    // Add pulse animation CSS
    const pulseStyle = document.createElement('style');
    pulseStyle.textContent = `
        @keyframes pulse {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
            100% {
                transform: scale(1);
            }
        }
    `;
    document.head.appendChild(pulseStyle);

    console.log('SecureBank website loaded successfully!');
});

// Function to scroll to contact section
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar.offsetHeight;
        const targetPosition = contactSection.offsetTop - navbarHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}