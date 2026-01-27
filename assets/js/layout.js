/**
 * Layout.js
 * Injects shared Header, Footer, and Navigation logic into pages.
 */

// 0. Determine Path Prefix based on depth (Case Insensitive)
let PATH_PREFIX = '';
const NAV_LINKS = [
    { label: 'Home', href: '/', path: '/' },
    { label: 'Work', href: '/work/', path: '/work/' },
    { label: 'Testimonials', href: '/testimonials/', path: '/testimonials/' },
    { label: 'About', href: '/about/', path: '/about/' },
    { label: 'Now', href: '/now/', path: '/now/' },
    { label: 'Contact', href: '/contact/', path: '/contact/' }
];

function injectLayout() {
    // 1. Inject Header
    const header = document.createElement('header');
    header.className = "fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5";
    header.innerHTML = `
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <a href="/" class="flex items-center gap-3 group">
                <div class="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform shadow-lg shadow-purple-500/20">
                    TR
                </div>
                <div class="flex flex-col">
                    <span class="font-bold text-white tracking-tight group-hover:text-purple-400 transition-colors">Taylor Ryan</span>
                    <span class="text-[10px] text-neutral-400 uppercase tracking-widest">Portfolio</span>
                </div>
            </a>

            <nav class="hidden md:flex items-center gap-1 p-1 bg-white/5 rounded-full border border-white/5 backdrop-blur-sm">
                ${NAV_LINKS.map(link => `
                    <a href="${link.path}" class="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive(link.path) ? 'bg-white text-black shadow-lg' : 'text-neutral-400 hover:text-white hover:bg-white/5'}">
                        ${link.label}
                    </a>
                `).join('')}
            </nav>

            <a href="/contact/" class="hidden md:flex items-center gap-2 px-5 py-2 bg-white text-black rounded-full font-bold text-sm hover:bg-purple-400 hover:text-white transition-all shadow-lg hover:shadow-purple-500/25">
                Let's Talk <i data-lucide="arrow-right" class="w-4 h-4"></i>
            </a>

            <!-- Mobile Menu Button -->
            <button class="md:hidden text-white p-2">
                <i data-lucide="menu" class="w-6 h-6"></i>
            </button>
        </div>
    `;
    document.body.prepend(header);

    // 2. Inject Footer
    const footer = document.createElement('footer');
    footer.className = "bg-black border-t border-white/5 py-20 mt-20 relative overflow-hidden";
    footer.innerHTML = `
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-neutral-900/40 via-black to-black"></div>
        <div class="max-w-7xl mx-auto px-6 relative z-10">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                <!-- Brand -->
                <div class="space-y-6">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white font-bold">TR</div>
                        <span class="font-bold text-white">Taylor Ryan</span>
                    </div>
                    <p class="text-neutral-500 text-sm leading-relaxed">
                        Multi-disciplinary GTM and growth expert with 17+ years of experience across various sectors including ai, blockchain, and Saas.
                    </p>
                </div>
                
                <!-- Work -->
                <div>
                    <h4 class="font-bold text-white mb-6">Work</h4>
                    <ul class="space-y-4 text-sm text-neutral-500">
                        <li><a href="/portfolio/quests/" class="hover:text-white transition-colors">Quests</a></li>
                        <li><a href="/work_speaker/" class="hover:text-blue-400 transition-colors">Keynotes</a></li>
                        <li><a href="/work_writing/" class="hover:text-green-400 transition-colors">Writing</a></li>
                        <li><a href="/work_projects/" class="hover:text-orange-400 transition-colors">Projects</a></li>
                    </ul>
                </div>

                <!-- Connect -->
                <div>
                    <h4 class="font-bold text-white mb-6">Connect</h4>
                    <ul class="space-y-4 text-sm text-neutral-500">
                        <li><a href="https://www.linkedin.com/in/taylorryan/" target="_blank" class="hover:text-blue-500 transition-colors">LinkedIn</a></li>
                        <li><a href="https://x.com/TaylorRyanTweet" target="_blank" class="hover:text-white transition-colors">Twitter / X</a></li>
                        <li><a href="https://www.youtube.com/c/TaylorRyanPLUS" target="_blank" class="hover:text-red-500 transition-colors">YouTube</a></li>
                        <li><a href="mailto:taylor@klintmarketing.com" class="hover:text-white transition-colors">Email</a></li>
                    </ul>
                </div>

                <!-- Availability -->
                <div>
                    <h4 class="font-bold text-white mb-6">Status</h4>
                    <div class="flex items-center gap-3 text-sm text-neutral-400 bg-neutral-900/50 p-4 rounded-xl border border-neutral-800">
                        <span class="relative flex h-3 w-3">
                          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        <span>Open for <span id="status-rotate" class="text-white font-bold transition-opacity duration-300">Keynotes</span></span>
                    </div>
                </div>
            </div>
            
            <div class="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                <p class="text-neutral-600 text-sm">© ${new Date().getFullYear()} Taylor Ryan. All rights reserved.</p>
                <div class="flex items-center gap-6 text-sm text-neutral-600">
                    <span>Copenhagen, Denmark 🇩🇰</span>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(footer);

    // 2.5 Start Text Rotation
    const rotateSpan = document.getElementById('status-rotate');
    if (rotateSpan) {
        const phrases = [
            "Keynotes",
            "New Opportunities",
            "Workshops",
            "Consulting",
            "C-Level Leadership Roles"
        ];
        let index = 0;
        setInterval(() => {
            rotateSpan.style.opacity = '0';
            setTimeout(() => {
                index = (index + 1) % phrases.length;
                rotateSpan.textContent = phrases[index];
                rotateSpan.style.opacity = '1';
            }, 300); // Wait for fade out
        }, 2000);
    }

    // 3. Inject Contact Modal
    const modal = document.createElement('div');
    modal.id = 'contact-modal';
    modal.className = "fixed inset-0 z-[60] hidden";
    modal.innerHTML = `
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="closeContactModal()"></div>
        <div class="absolute inset-0 flex items-center justify-center p-4">
            <div class="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg relative shadow-2xl animate-fade-in-up">
                
                <!-- Close Button -->
                <button onclick="closeContactModal()" class="absolute top-4 right-4 p-2 text-neutral-400 hover:text-white bg-neutral-800 rounded-full transition-colors">
                    <i data-lucide="x" class="w-5 h-5"></i>
                </button>

                <div class="p-8">
                    <h2 class="text-2xl font-bold text-white mb-2">Let's Connect</h2>
                    <p class="text-neutral-400 text-sm mb-6">Send me a message and I'll get back to you shortly.</p>
                    
                    <form onsubmit="handleContactSubmit(event)" class="space-y-4">
                        <div>
                            <label class="block text-xs uppercase text-neutral-500 font-bold mb-1">Name</label>
                            <input type="text" name="name" required class="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors" placeholder="Your Name">
                        </div>
                        
                        <div>
                            <label class="block text-xs uppercase text-neutral-500 font-bold mb-1">Email</label>
                            <input type="email" name="email" required class="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors" placeholder="your@email.com">
                        </div>

                        <div>
                            <label class="block text-xs uppercase text-neutral-500 font-bold mb-1">Subject</label>
                            <input type="text" name="subject" required class="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors" placeholder="Project Inquiry / Speaking">
                        </div>

                        <div>
                            <label class="block text-xs uppercase text-neutral-500 font-bold mb-1">Message</label>
                            <textarea name="message" required rows="4" class="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-colors" placeholder="How can I help you?"></textarea>
                        </div>

                        <button type="submit" class="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
                            Send Message <i data-lucide="send" class="w-4 h-4"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);

    // Initialize Icons
    if (window.lucide) lucide.createIcons();
}

// Global Modal Functions
window.openContactModal = function () {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
};

window.closeContactModal = function () {
    const modal = document.getElementById('contact-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
};

window.handleContactSubmit = function (e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Construct Mailto
    const mailtoLink = `mailto:taylor@klintmarketing.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Hi Taylor,\n\n${message}\n\nBest,\n${name}`)}`;

    // Open Mail Client
    window.location.href = mailtoLink;

    // Optional: Show feedback
    const btn = e.target.querySelector('button');
    const originalText = btn.innerHTML;
    btn.innerHTML = 'Client Opened <i data-lucide="check" class="w-4 h-4"></i>';
    btn.classList.add('bg-green-500', 'text-white');

    setTimeout(() => {
        closeContactModal();
        btn.innerHTML = originalText;
        btn.classList.remove('bg-green-500', 'text-white');
        e.target.reset();
    }, 2000);
};

function isActive(href) {
    // If inside a sub-directory managed by PATH_PREFIX, strict homepage matching should fail
    if (PATH_PREFIX !== '' && href === 'index.html') return false;

    // Normalizing current path: remove trailing slash for comparison
    let currentPath = window.location.pathname;
    // Normalize /foo/ to /foo
    if (currentPath.length > 1 && currentPath.endsWith('/')) {
        currentPath = currentPath.slice(0, -1);
    }

    let targetPath = href;

    // Handle index.html special case
    if (targetPath === 'index.html') return currentPath === '/';

    // Remove .html extension
    if (targetPath.endsWith('.html')) {
        targetPath = targetPath.replace('.html', '');
    }

    // Ensure it starts with / if it doesn't already
    if (!targetPath.startsWith('/')) {
        targetPath = '/' + targetPath;
    }

    // Normalize target /foo/ to /foo
    if (targetPath.length > 1 && targetPath.endsWith('/')) {
        targetPath = targetPath.slice(0, -1);
    }

    // Compare
    return currentPath === targetPath;
}

// Auto-run if DOM is ready, else wait
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectLayout);
} else {
    injectLayout();
}
