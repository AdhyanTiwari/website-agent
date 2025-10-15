// ===== Global Variables =====
let currentUser = null;
let servicesData = [];
let pricingData = [];

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
    }

    // Initialize components based on current page
    const currentPage = getCurrentPage();
    
    // Common initialization
    initializeNavigation();
    initializeScrollAnimations();
    initializeParticles();
    
    // Page-specific initialization
    switch(currentPage) {
        case 'index':
            initializeHomePage();
            break;
        case 'services':
            initializeServicesPage();
            break;
        case 'pricing':
            initializePricingPage();
            break;
        case 'login':
            initializeLoginPage();
            break;
        case 'dashboard':
            initializeDashboard();
            break;
        case 'contact':
            initializeContactPage();
            break;
    }

    // Initialize dark mode toggle if exists
    initializeDarkMode();
}

function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop().replace('.html', '') || 'index';
    return page;
}

// ===== Navigation =====
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// ===== Scroll Animations =====
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => observer.observe(el));
}

// ===== Particles Background =====
function initializeParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            opacity: Math.random() * 0.5 + 0.2
        };
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(createParticle());
        }
    }

    function updateParticles() {
        particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        });
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${particle.opacity})`;
            ctx.fill();
        });

        // Draw connections
        particles.forEach((particle, i) => {
            particles.slice(i + 1).forEach(otherParticle => {
                const distance = Math.sqrt(
                    Math.pow(particle.x - otherParticle.x, 2) +
                    Math.pow(particle.y - otherParticle.y, 2)
                );

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - distance / 100)})`;
                    ctx.stroke();
                }
            });
        });
    }

    function animate() {
        updateParticles();
        drawParticles();
        animationId = requestAnimationFrame(animate);
    }

    // Initialize
    resizeCanvas();
    initParticles();
    animate();

    // Handle resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
}

// ===== Home Page =====
function initializeHomePage() {
    // Typewriter effect for hero text
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle && !heroTitle.dataset.animated) {
        heroTitle.dataset.animated = 'true';
        typeWriter(heroTitle, "Empowering Businesses with AI Services", 100);
    }

    // Animate stats counters
    animateCounters();

    // Smooth scroll for CTA buttons
    const ctaButtons = document.querySelectorAll('.btn[href^="#"]');
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(btn.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function typeWriter(element, text, speed) {
    element.textContent = '';
    let i = 0;
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = parseInt(counter.dataset.target);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    });
}

// ===== Services Page =====
function initializeServicesPage() {
    loadServicesData();
}

function loadServicesData() {
    // Mock services data - in a real app, this would come from an API
    servicesData = [
        {
            id: 0,
            title: "AI Products",
            description: "Explore lead genearation and marketing analytics products.",
            icon: "🤖",
            features: ["CAD", "MarketMuse", "ConversIQ"]
        },
        {
            id: 1,
            title: "AI Strategy Consulting",
            description: "Transform your business with intelligent AI strategies tailored to your goals.",
            icon: "🧠",
            features: ["Strategic Planning", "ROI Analysis", "Implementation Roadmap"]
        },
        {
            id: 2,
            title: "Custom AI Development",
            description: "Build powerful AI solutions from concept to deployment with our expert team.",
            icon: "⚡",
            features: ["Machine Learning", "NLP Processing", "Computer Vision"]
        },
        {
            id: 3,
            title: "AI Integration Services",
            description: "Seamlessly integrate AI capabilities into your existing systems and workflows.",
            icon: "🔗",
            features: ["API Integration", "System Optimization", "Data Pipeline"]
        },
        {
            id: 4,
            title: "AI Training & Support",
            description: "Empower your team with comprehensive AI training and ongoing support.",
            icon: "🎓",
            features: ["Team Training", "Documentation", "24/7 Support"]
        },
        {
            id: 5,
            title: "Data Analytics",
            description: "Unlock insights from your data with advanced AI-powered analytics.",
            icon: "📊",
            features: ["Predictive Analytics", "Data Visualization", "Business Intelligence"]
        }
    ];

    renderServices();
}

function renderServices() {
    const servicesGrid = document.querySelector('.services-grid');
    if (!servicesGrid) return;

    servicesGrid.innerHTML = '';

    servicesData.forEach(service => {
        const serviceCard = createServiceCard(service);
        servicesGrid.appendChild(serviceCard);
    });

    // Add stagger animation
    const cards = servicesGrid.querySelectorAll('.service-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.remove('fade-in');
    });
}

function createServiceCard(service) {
    const card = document.createElement('div');
    card.className = 'service-card fade-in';
    card.innerHTML = `
        <div class="service-icon">${service.icon}</div>
        <h3 class="service-title">${service.title}</h3>
        <p class="service-description">${service.description}</p>
        <div class="service-features">
            ${service.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
        </div>
        <button class="btn btn-primary mt-4" onclick="showServiceDetails(${service.id})">
            Learn More
        </button>
    `;

    // Add hover effect
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
        card.style.boxShadow = '0 25px 50px rgba(99, 102, 241, 0.2)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
        card.style.boxShadow = 'none';
    });

    return card;
}

function showServiceDetails(serviceId) {
    const service = servicesData.find(s => s.id === serviceId);
    if (service) {
        showModal(`
            <h2>${service.title}</h2>
            <p>${service.description}</p>
            <h3>Features:</h3>
            <ul>
                ${service.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <button class="btn btn-primary" onclick="closeModal()">Close</button>
        `);
    }
}

// ===== Pricing Page =====
function initializePricingPage() {
    loadPricingData();
    initializePricingToggle();
}

function loadPricingData() {
    // Mock pricing data
    pricingData = [
        {
            id: 'starter',
            name: 'Starter',
            monthlyPrice: 99,
            yearlyPrice: 990,
            description: 'Perfect for small businesses getting started with AI',
            features: [
                'Up to 3 AI agents',
                'Basic analytics',
                'Email support',
                '5GB data storage',
                'Standard integrations'
            ],
            popular: false
        },
        {
            id: 'pro',
            name: 'Pro',
            monthlyPrice: 299,
            yearlyPrice: 2990,
            description: 'Ideal for growing businesses with advanced AI needs',
            features: [
                'Up to 10 AI agents',
                'Advanced analytics',
                'Priority support',
                '50GB data storage',
                'Advanced integrations',
                'Custom training',
                'API access'
            ],
            popular: true
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            monthlyPrice: 999,
            yearlyPrice: 9990,
            description: 'For large organizations with custom requirements',
            features: [
                'Unlimited AI agents',
                'Enterprise analytics',
                '24/7 phone support',
                'Unlimited storage',
                'Custom integrations',
                'White-label options',
                'Dedicated account manager',
                'Custom development',
                'SLA guarantee'
            ],
            popular: false
        }
    ];

    renderPricing();
}

function initializePricingToggle() {
    const monthlyBtn = document.getElementById('monthly-toggle');
    const yearlyBtn = document.getElementById('yearly-toggle');
    
    if (monthlyBtn && yearlyBtn) {
        monthlyBtn.addEventListener('click', () => {
            monthlyBtn.classList.add('active');
            yearlyBtn.classList.remove('active');
            renderPricing('monthly');
        });
        
        yearlyBtn.addEventListener('click', () => {
            yearlyBtn.classList.add('active');
            monthlyBtn.classList.remove('active');
            renderPricing('yearly');
        });
    }
}

function renderPricing(billing = 'monthly') {
    const pricingGrid = document.querySelector('.pricing-grid');
    if (!pricingGrid) return;

    pricingGrid.innerHTML = '';

    pricingData.forEach(plan => {
        const pricingCard = createPricingCard(plan, billing);
        pricingGrid.appendChild(pricingCard);
    });

    // Add stagger animation
    const cards = pricingGrid.querySelectorAll('.pricing-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.remove('fade-in');
    });
}

function createPricingCard(plan, billing) {
    const card = document.createElement('div');
    const price = billing === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
    const billingText = billing === 'monthly' ? '/month' : '/year';
    const savings = billing === 'yearly' ? `<div class="savings">Save ${Math.round((1 - plan.yearlyPrice / (plan.monthlyPrice * 12)) * 100)}%</div>` : '';

    card.className = `pricing-card ${plan.popular ? 'featured' : ''} fade-in`;
    card.innerHTML = `
        ${plan.popular ? '<div class="popular-badge">Most Popular</div>' : ''}
        ${savings}
        <h3 class="plan-name">${plan.name}</h3>
        <div class="plan-price">$${price}</div>
        <div class="plan-billing">${billingText}</div>
        <p class="plan-description">${plan.description}</p>
        <ul class="plan-features">
            ${plan.features.map(feature => `<li>${feature}</li>`).join('')}
        </ul>
        <button class="btn btn-primary" onclick="selectPlan('${plan.id}')">
            Subscribe Now
        </button>
    `;

    return card;
}

function selectPlan(planId) {
    if (!currentUser) {
        showMessage('Please log in to subscribe to a plan.', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    showMessage(`Thank you for choosing the ${planId} plan! Redirecting to payment...`, 'success');
    // In a real app, this would redirect to a payment page
}

// ===== Login Page =====
function initializeLoginPage() {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const toggleButtons = document.querySelectorAll('.form-toggle');

    // Form toggle functionality
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetForm = btn.dataset.target;
            toggleForm(targetForm);
        });
    });

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Signup form submission
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

function toggleForm(formType) {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const container = document.querySelector('.form-container');

    if (formType === 'signup') {
        loginForm.style.display = 'none';
        signupForm.style.display = 'block';
        container.classList.add('signup-active');
    } else {
        loginForm.style.display = 'block';
        signupForm.style.display = 'none';
        container.classList.remove('signup-active');
    }
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    // Mock authentication - in a real app, this would be an API call
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        currentUser = { email: user.email, name: user.name };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showMessage('Login successful! Redirecting to dashboard...', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    } else {
        showMessage('Invalid email or password. Please try again.', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;

    if (password !== confirmPassword) {
        showMessage('Passwords do not match.', 'error');
        return;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find(u => u.email === email)) {
        showMessage('An account with this email already exists.', 'error');
        return;
    }

    // Create new user
    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    showMessage('Account created successfully! Please log in.', 'success');
    
    // Switch to login form
    setTimeout(() => {
        toggleForm('login');
    }, 2000);
}

// ===== Dashboard =====
function initializeDashboard() {
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Display welcome message
    const welcomeElement = document.querySelector('.welcome-message');
    if (welcomeElement) {
        welcomeElement.textContent = `Welcome back, ${currentUser.name}!`;
    }

    // Initialize sidebar navigation
    initializeSidebarNavigation();

    // Load dashboard content
    loadDashboardContent();
}

function initializeSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            sidebarLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Load corresponding content
            const section = link.dataset.section;
            loadDashboardSection(section);
        });
    });
}

function loadDashboardSection(section) {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    switch(section) {
        case 'overview':
            mainContent.innerHTML = `
                <div class="welcome-banner">
                    <h2>Welcome to Your Dashboard</h2>
                    <p>Manage your AI agents and monitor performance from one centralized location.</p>
                </div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <h3>Active Agents</h3>
                        <div class="stat-number">3</div>
                    </div>
                    <div class="stat-card">
                        <h3>Tasks Completed</h3>
                        <div class="stat-number">1,247</div>
                    </div>
                    <div class="stat-card">
                        <h3>Performance Score</h3>
                        <div class="stat-number">98.5%</div>
                    </div>
                </div>
            `;
            break;
        case 'agents':
            mainContent.innerHTML = `
                <h2>My AI Agents</h2>
                <div class="agents-grid">
                    <div class="agent-card">
                        <h3>Customer Support Bot</h3>
                        <p>Status: <span class="status active">Active</span></p>
                        <p>Tasks handled: 523</p>
                    </div>
                    <div class="agent-card">
                        <h3>Data Analysis Agent</h3>
                        <p>Status: <span class="status active">Active</span></p>
                        <p>Reports generated: 89</p>
                    </div>
                    <div class="agent-card">
                        <h3>Content Creation AI</h3>
                        <p>Status: <span class="status inactive">Inactive</span></p>
                        <p>Articles written: 156</p>
                    </div>
                </div>
            `;
            break;
        case 'subscriptions':
            mainContent.innerHTML = `
                <h2>Subscriptions</h2>
                <div class="subscription-card">
                    <h3>Current Plan: Pro</h3>
                    <p>Billing: Monthly ($299/month)</p>
                    <p>Next billing date: ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    <button class="btn btn-primary">Manage Subscription</button>
                </div>
            `;
            break;
        case 'settings':
            mainContent.innerHTML = `
                <h2>Settings</h2>
                <div class="settings-section">
                    <h3>Profile Settings</h3>
                    <form class="settings-form">
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" value="${currentUser.name}" class="form-input">
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" value="${currentUser.email}" class="form-input">
                        </div>
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </form>
                </div>
                <div class="settings-section">
                    <h3>Account Actions</h3>
                    <button class="btn btn-secondary" onclick="logout()">Logout</button>
                </div>
            `;
            break;
    }
}

function loadDashboardContent() {
    // Load overview by default
    loadDashboardSection('overview');
}

function logout() {
    localStorage.removeItem('currentUser');
    currentUser = null;
    showMessage('Logged out successfully.', 'success');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// ===== Contact Page =====
function initializeContactPage() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmission);
    }
}

function handleContactSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Mock form submission - in a real app, this would be an API call
    showMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
    
    // Reset form
    e.target.reset();
}

// ===== Dark Mode Toggle =====
function initializeDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
        
        // Check for saved preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
        }
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// ===== Utility Functions =====
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert at the top of the page
    document.body.insertBefore(messageDiv, document.body.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 5000);
}

function showModal(content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content glass-card">
            ${content}
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Add modal styles if not already added
    if (!document.querySelector('#modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'modal-styles';
        styles.textContent = `
            .modal-overlay {
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
                backdrop-filter: blur(10px);
            }
            .modal-content {
                max-width: 500px;
                max-height: 80vh;
                overflow-y: auto;
                margin: 2rem;
            }
        `;
        document.head.appendChild(styles);
    }
}

function closeModal() {
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.remove();
    }
}

// ===== Smooth Scrolling =====
function smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ===== Performance Optimization =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add scroll performance optimization
let ticking = false;

function updateOnScroll() {
    // Update navbar state
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
    }
});

// ===== Error Handling =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// ===== Export functions for global access =====
window.AgentFlow = {
    showMessage,
    showModal,
    closeModal,
    selectPlan,
    showServiceDetails,
    logout,
    smoothScrollTo
};




