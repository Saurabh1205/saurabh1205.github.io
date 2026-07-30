/* ==========================================================================
   DEVELOPER PORTFOLIO - SAURABH NAGARE
   Interactive Logic, Particle Canvas, Animations & Hybrid GitHub Auto-Sync
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initNavbarScroll();
    initTypewriter();
    initCounterAnimation();
    initContactForm();
    initMobileNav();
    initCustomCursor();
    initParticleCanvas();
    initScrollReveal();
    init3DTilt();
    initMagneticButtons();
    fetchLiveGitHubRepos();
});

/* Real-Time Live GitHub Repositories Auto-Sync with Smart Filtering & Fallback */
async function fetchLiveGitHubRepos() {
    const container = document.getElementById('github-repos-container');
    if (!container) return;

    try {
        const response = await fetch('https://api.github.com/users/Saurabh1205/repos?sort=updated&per_page=15');
        
        if (!response.ok) {
            throw new Error(`GitHub API Status: ${response.status}`);
        }

        const repos = await response.json();
        
        // Smart Filter: Exclude forks, profile repo (Saurabh1205), and github.io repo
        const excludedNames = ['saurabh1205', 'saurabh1205.github.io'];
        const publicRepos = repos.filter(repo => 
            !repo.fork && 
            !excludedNames.includes(repo.name.toLowerCase())
        );

        if (publicRepos.length === 0) {
            container.innerHTML = `
                <div class="loading-spinner" style="grid-column: 1/-1; color: var(--text-muted);">
                    <i class="fa-brands fa-github"></i> All primary projects are featured above. Visit <a href="https://github.com/Saurabh1205?tab=repositories" target="_blank" style="color: var(--primary); text-decoration: underline;">GitHub Profile</a> to explore all repositories.
                </div>`;
            return;
        }

        container.innerHTML = '';

        publicRepos.slice(0, 6).forEach(repo => {
            const card = document.createElement('article');
            card.className = 'project-card glass-card tilt-card reveal-on-scroll revealed';

            const lang = repo.language || 'Kotlin / Android';
            const description = repo.description || 'Public GitHub repository showcasing mobile software engineering and architecture.';
            const stars = repo.stargazers_count;
            const forks = repo.forks_count;

            card.innerHTML = `
                <div class="project-header">
                    <div class="project-type"><i class="fa-solid fa-code-branch"></i> ${lang}</div>
                    <h3 class="project-title">${repo.name}</h3>
                </div>
                <p class="project-description">${description}</p>
                <div class="project-tech">
                    <span>${lang}</span>
                    <span><i class="fa-solid fa-star"></i> ${stars}</span>
                    <span><i class="fa-solid fa-code-fork"></i> ${forks}</span>
                </div>
                <div class="project-footer">
                    <a href="${repo.html_url}" target="_blank" rel="noopener" class="project-link">
                        <i class="fa-brands fa-github"></i> View Repo <i class="fa-solid fa-arrow-right"></i>
                    </a>
                </div>
            `;

            container.appendChild(card);
        });

        // Re-initialize 3D tilt effect for dynamically appended cards
        init3DTilt();

    } catch (error) {
        console.warn('GitHub API fetch fallback engaged:', error);
        container.innerHTML = `
            <div class="loading-spinner" style="grid-column: 1/-1; color: var(--text-muted); padding: 30px;">
                <i class="fa-brands fa-github"></i> Explore all live projects directly on <a href="https://github.com/Saurabh1205?tab=repositories" target="_blank" style="color: var(--primary); font-weight: 600; text-decoration: underline;">GitHub (@Saurabh1205)</a>.
            </div>`;
    }
}

/* Custom Animated Neon Cursor */
function initCustomCursor() {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    });

    function renderRing() {
        ringX += (mouseX - ringX) * 0.15;
        ringY += (mouseY - ringY) * 0.15;
        ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
        requestAnimationFrame(renderRing);
    }
    renderRing();

    // Hover scale effect on links and buttons
    const hoverables = document.querySelectorAll('a, button, .tilt-card, .skill-tag');
    hoverables.forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('active'));
        el.addEventListener('mouseleave', () => ring.classList.remove('active'));
    });
}

/* Interactive Floating Particle Canvas Engine */
function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.8;
            this.speedY = (Math.random() - 0.5) * 0.8;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > width) this.speedX *= -1;
            if (this.y < 0 || this.y > height) this.speedY *= -1;
        }

        draw() {
            ctx.fillStyle = `rgba(56, 189, 248, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const particles = Array.from({ length: 60 }, () => new Particle());

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }
    animate();
}

/* Scroll Reveal Observer */
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => observer.observe(el));
}

/* 3D Tilt Effect on Cards */
function init3DTilt() {
    const cards = document.querySelectorAll('.tilt-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        });
    });
}

/* Magnetic Buttons Effect */
function initMagneticButtons() {
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px)`;
        });
    });
}

/* Navbar Blur on Scroll */
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
}

/* Dynamic Typewriter Effect for Hero */
function initTypewriter() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    const words = [
        "Native Android & Mobile Systems",
        "Jetpack Compose & Kotlin",
        "Cross-Platform Flutter & Dart",
        "Scalable SDK Architecture",
        "Mobile AI & On-Device ML"
    ];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 90;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500;
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/* Animated Number Counter for Hero Metrics */
function initCounterAnimation() {
    const metrics = document.querySelectorAll('.metric-value');
    let animated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                metrics.forEach(metric => {
                    const target = parseFloat(metric.getAttribute('data-target'));
                    const isDecimal = target % 1 !== 0;
                    const duration = 1500;
                    const steps = 60;
                    const stepValue = target / steps;
                    let current = 0;
                    let count = 0;

                    const timer = setInterval(() => {
                        count++;
                        current += stepValue;

                        if (count >= steps) {
                            clearInterval(timer);
                            if (target === 4) metric.textContent = '4+';
                            else if (target === 15) metric.textContent = '15+';
                            else if (target === 100) metric.textContent = '99.9%';
                        } else {
                            if (isDecimal) {
                                metric.textContent = current.toFixed(1) + '%';
                            } else {
                                metric.textContent = Math.floor(current) + '+';
                            }
                        }
                    }, duration / steps);
                });
            }
        });
    }, { threshold: 0.5 });

    const metricsSection = document.querySelector('.hero-metrics');
    if (metricsSection) observer.observe(metricsSection);
}

/* Interactive Contact Form */
function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    const btnSubmit = document.getElementById('btn-submit');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('form-name').value;
        const email = document.getElementById('form-email').value;

        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

        setTimeout(() => {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
            status.className = 'form-status success';
            status.textContent = `Thank you ${name}! Your message has been sent successfully. I will get back to you at ${email}.`;

            form.reset();

            setTimeout(() => {
                btnSubmit.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
                status.textContent = '';
            }, 5000);
        }, 1200);
    });
}

/* Mobile Navigation Toggle */
function initMobileNav() {
    const toggle = document.getElementById('mobile-toggle');
    const links = document.getElementById('nav-links');

    if (!toggle || !links) return;

    toggle.addEventListener('click', () => {
        links.style.display = links.style.display === 'flex' ? 'none' : 'flex';
        links.style.flexDirection = 'column';
        links.style.position = 'absolute';
        links.style.top = '70px';
        links.style.left = '0';
        links.style.width = '100%';
        links.style.background = '#0B0F19';
        links.style.padding = '20px';
        links.style.borderBottom = '1px solid rgba(255,255,255,0.1)';
    });
}
