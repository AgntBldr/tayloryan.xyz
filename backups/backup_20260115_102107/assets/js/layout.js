/**
 * Layout.js
 * Injects shared Header, Footer, and Navigation logic into pages.
 */

const PATH_PREFIX = window.location.pathname.includes('/work/') ? '../' : '';

const NAV_LINKS = [
    { label: 'Home', href: 'index.html', path: '/' },
    { label: 'Work', href: 'work.html', path: '/work' },
    { label: 'About', href: 'about.html', path: '/about' },
    { label: 'Now', href: 'now.html', path: '/now' },
    { label: 'Contact', href: 'contact.html', path: '/contact' }
];

function injectLayout() {
    // 1. Inject Header
    const header = document.createElement('header');
    header.className = "fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5";
    header.innerHTML = `
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <a href="index.html" class="flex items-center gap-3 group">
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
                    <a href="${link.href}" class="px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${isActive(link.href) ? 'bg-white text-black shadow-lg' : 'text-neutral-400 hover:text-white hover:bg-white/5'}">
                        ${link.label}
                    </a>
                `).join('')}
            </nav>

            <a href="contact.html" class="hidden md:flex items-center gap-2 px-5 py-2 bg-white text-black rounded-full font-bold text-sm hover:bg-purple-400 hover:text-white transition-all shadow-lg hover:shadow-purple-500/25">
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
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black"></div>
        <div class="max-w-7xl mx-auto px-6 relative z-10">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                <div class="space-y-6">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-white font-bold">TR</div>
                        <span class="font-bold text-white">Taylor Ryan</span>
                    </div>
                    <p class="text-neutral-500 text-sm leading-relaxed">
                        Multi-disciplinary GTM and growth expert with 17+ years of experience across AI, blockchain, and SaaS.
                    </p>
                </div>
                
                <div>
                    <h4 class="font-bold text-white mb-6">Work</h4>
                    <ul class="space-y-4 text-sm text-neutral-500">
                        <li><a href="quest_portfolio.html" class="hover:text-purple-400 transition-colors">Quests</a></li>
                        <li><a href="work.html" class="hover:text-purple-400 transition-colors">Speaker</a></li>
                        <li><a href="work.html" class="hover:text-purple-400 transition-colors">Writing</a></li>
                        <li><a href="work.html" class="hover:text-purple-400 transition-colors">Projects</a></li>
                    </ul>
                </div>

                <div>
                    <h4 class="font-bold text-white mb-6">Connect</h4>
                    <ul class="space-y-4 text-sm text-neutral-500">
                        <li><a href="https://www.linkedin.com/in/taylorryan/" target="_blank" class="hover:text-purple-400 transition-colors">LinkedIn</a></li>
                        <li><a href="https://x.com/TaylorRyanTweet" target="_blank" class="hover:text-purple-400 transition-colors">Twitter / X</a></li>
                        <li><a href="https://www.youtube.com/c/TaylorRyanPLUS" target="_blank" class="hover:text-purple-400 transition-colors">YouTube</a></li>
                        <li><a href="mailto:taylor@klintmarketing.com" class="hover:text-purple-400 transition-colors">Email</a></li>
                    </ul>
                </div>

                <div>
                    <h4 class="font-bold text-white mb-6">Availability</h4>
                    <div class="flex items-center gap-3 text-sm text-neutral-400">
                        <span class="relative flex h-3 w-3">
                          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        Open for advisory
                    </div>
                </div>
            </div>
            
            <div class="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                <p class="text-neutral-600 text-sm">© ${new Date().getFullYear()} Taylor Ryan. All rights reserved.</p>
                <div class="flex items-center gap-6 text-sm text-neutral-600">
                    <span>Copenhagen based, Globally focused.</span>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(footer);

    // Initialize Icons
    if (window.lucide) lucide.createIcons();
}

function isActive(href) {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    return current === href;
}

// Auto-run if DOM is ready, else wait
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectLayout);
} else {
    injectLayout();
}
