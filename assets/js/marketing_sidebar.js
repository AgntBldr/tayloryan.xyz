
function renderMarketingSidebar(activePage) {
    // Ensure styles for sidebar are present if not already
    if (!document.getElementById('sidebar-styles')) {
        const style = document.createElement('style');
        style.id = 'sidebar-styles';
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
        `;
        document.head.appendChild(style);
    }

    const totalResources = typeof MARKETING_FULL_DATA !== 'undefined' ? MARKETING_FULL_DATA.length : '...';

    const menuItems = [
        { id: 'overview', label: 'Marketing Hub', icon: 'home', url: '/portfolio/marketing/' },
        { id: 'content-creator', label: 'Content Creator', icon: 'users', url: '/portfolio/marketing/content_creator/', color: 'text-purple-400' },
        { id: 'email-outreach', label: 'Email Outreach', icon: 'mail', url: '/portfolio/marketing/email_outreach/', color: 'text-blue-400' },
        { id: 'affiliates', label: 'Affiliate Program', icon: 'share-2', url: '/portfolio/marketing/affiliates/', color: 'text-orange-400' },
        { id: 'case-studies', label: 'Case Studies', icon: 'file-text', url: '/portfolio/marketing/case_studies/', color: 'text-yellow-400' },
        { id: 'testimonials', label: 'Testimonials', icon: 'message-square', url: '/portfolio/marketing/testimonials/', color: 'text-pink-400' },
        { id: 'projects-hub', label: 'Projects Hub', icon: 'folder-kanban', url: '/work_projects/', color: 'text-white' }
    ];

    // Determine path prefix relative to current file
    // Assumes we are in portfolio/marketing/

    const sidebarHTML = `
        <aside class="fixed top-0 left-0 h-screen w-64 bg-black border-r border-white/10 flex flex-col z-50 hidden md:flex">
            <!-- Header -->
            <div class="p-6 border-b border-white/5">
                <div class="flex items-center gap-3 mb-1">
                    <div class="p-2 bg-green-500/20 rounded-lg text-green-400">
                        <i data-lucide="layout-grid" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h1 class="font-bold text-white text-lg leading-none">Marketing Hub</h1>
                        <span class="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Project Center</span>
                    </div>
                </div>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
                ${menuItems.map((item, index) => {
        const isActive = activePage === item.id;
        // Add separator before projects if it's the first project
        const separator = index === 1 ? '<div class="pt-4 pb-2 px-4 text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Active Projects</div>' : '';

        return `
                        ${separator}
                        <a href="${item.url}" class="sidebar-link ${isActive ? 'active' : ''}">
                            <i data-lucide="${item.icon}" class="sidebar-icon ${item.color || ''}"></i>
                            ${item.label}
                        </a>
                    `;
    }).join('')}
            </nav>

            <!-- System Status -->
            <div class="p-4 border-t border-white/5 bg-neutral-900/50">


                <div class="bg-neutral-900 border border-white/5 rounded-xl p-4">
                    <div class="flex items-center gap-2 mb-2">
                        <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span class="text-xs font-bold text-neutral-400">System Status</span>
                    </div>
                    <div class="text-lg font-mono font-bold text-white">
                        <span id="sidebar-resource-count">${totalResources}</span> <span class="text-sm text-neutral-500 font-sans font-normal">Resources</span>
                    </div>
                </div>
            </div>
        </aside>

        <!-- Mobile Header (Visible only on mobile) -->
        <div class="md:hidden fixed top-0 left-0 w-full z-40 bg-black/90 backdrop-blur border-b border-white/10 p-4 flex justify-between items-center">
             <div class="flex items-center gap-3">
                <div class="p-1.5 bg-green-500/20 rounded text-green-400">
                    <i data-lucide="layout-grid" class="w-4 h-4"></i>
                </div>
                <span class="font-bold text-white">Marketing Hub</span>
            </div>
             <button class="p-2 text-neutral-400">
                <i data-lucide="menu" class="w-6 h-6"></i>
             </button>
        </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = sidebarHTML;
    document.body.prepend(container);

    // Initialize icons if lucide is available
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}
