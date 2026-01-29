
function renderMarketingSidebar(activePage) {
    // Ensure styles for sidebar are present if not already
    if (!document.getElementById('marketing-sidebar-styles')) {
        const style = document.createElement('style');
        style.id = 'marketing-sidebar-styles';
        style.textContent = `
            .sidebar-link {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 16px;
                border-radius: 12px;
                color: #a3a3a3;
                transition: all 0.2s;
                font-weight: 500;
                text-decoration: none;
            }
            .sidebar-link:hover {
                background-color: rgba(255, 255, 255, 0.05);
                color: white;
            }
            .sidebar-link.active {
                background-color: rgba(255, 255, 255, 0.1);
                color: white;
                font-weight: 600;
            }
            .sidebar-icon {
                width: 20px;
                height: 20px;
            }
            #work-sidebar {
                transition: transform 0.3s ease-in-out;
            }
        `;
        document.head.appendChild(style);
    }

    const totalResources = typeof MARKETING_FULL_DATA !== 'undefined' ? MARKETING_FULL_DATA.length : '...';

    const menuItems = [
        { id: 'overview', label: 'Marketing Hub', icon: 'home', url: '/portfolio/marketing/index.html' },
        { id: 'content-creator', label: 'Content Creator', icon: 'users', url: '/portfolio/marketing/content_creator.html', color: 'text-purple-400' },
        { id: 'email-outreach', label: 'Email Outreach', icon: 'mail', url: '/portfolio/marketing/email_outreach.html', color: 'text-blue-400' },
        { id: 'social-media', label: 'Social Media', icon: 'share-2', url: '/portfolio/marketing/social_media/index.html', color: 'text-cyan-400' },
        { id: 'affiliates', label: 'Affiliate Program', icon: 'share-2', url: '/portfolio/marketing/affiliates.html', color: 'text-orange-400' },
        { id: 'case-studies', label: 'Case Studies', icon: 'file-text', url: '/portfolio/marketing/case_studies.html', color: 'text-yellow-400' },
        { id: 'testimonials', label: 'Testimonials', icon: 'message-square', url: '/portfolio/marketing/testimonials.html', color: 'text-pink-400' },
        { id: 'projects-hub', label: 'Projects Hub', icon: 'folder-kanban', url: '/work_projects/index.html', color: 'text-white' }
    ];

    const sidebarHTML = `
    <div id="work-sidebar" class="fixed top-0 left-0 h-full w-64 bg-black border-r border-neutral-800 z-[100] transform -translate-x-full md:translate-x-0 overflow-y-auto transition-transform duration-300">
        <div class="p-6">
            <div class="flex items-center gap-3 mb-8">
                <div class="p-2 bg-green-500/20 rounded-lg text-green-400">
                    <i data-lucide="layout-grid" class="w-5 h-5"></i>
                </div>
                <div>
                    <h1 class="font-bold text-white text-lg leading-none sidebar-label">Marketing Hub</h1>
                    <span class="text-[10px] font-bold text-neutral-500 uppercase tracking-widest sidebar-label">Project Center</span>
                </div>
            </div>

            <nav class="space-y-2 mb-8">
                ${menuItems.map((item, index) => {
        const isActive = activePage === item.id;
        const separator = index === 1 ? '<div class="pt-4 pb-2 px-4 text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Active Projects</div>' : '';
        const activeClass = isActive ? 'active' : '';

        return `
                        ${separator}
                        <a href="${item.url}" class="sidebar-link ${activeClass}">
                            <i data-lucide="${item.icon}" class="sidebar-icon ${item.color || ''}"></i>
                            <span class="sidebar-label">${item.label}</span>
                        </a>
                    `;
    }).join('')}
            </nav>

            <!-- System Status -->
            <div class="p-4 border-t border-white/5 bg-neutral-900/50 rounded-xl">
                <div class="flex items-center gap-2 mb-2">
                    <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span class="text-xs font-bold text-neutral-400">System Status</span>
                </div>
                <div class="text-lg font-mono font-bold text-white">
                    <span id="sidebar-resource-count">${totalResources}</span> <span class="text-sm text-neutral-500 font-sans font-normal">Resources</span>
                </div>
            </div>
            
            <!-- Mobile Close Button -->
            <button onclick="toggleSidebar()" class="md:hidden absolute top-4 right-4 text-neutral-400">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>

            <!-- Desktop Collapse Button -->
            <button onclick="toggleDesktopSidebar()" class="hidden md:flex items-center justify-center w-full p-4 text-neutral-500 hover:text-white transition-colors border-t border-neutral-800 mt-auto absolute bottom-0 left-0 bg-black">
                <i data-lucide="chevron-left" class="w-5 h-5 transition-transform" id="collapse-icon"></i>
                <span class="ml-3 font-medium text-sm sidebar-label">Collapse</span>
            </button>
        </div>
    </div>

    <!-- Mobile Toggle Button (Fixed) -->
    <button onclick="toggleSidebar()" class="md:hidden fixed bottom-6 right-6 z-[100] bg-neutral-900 border border-neutral-700 p-4 rounded-full shadow-2xl text-white">
        <i data-lucide="menu" class="w-6 h-6"></i>
    </button>
    `;

    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);

    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}
