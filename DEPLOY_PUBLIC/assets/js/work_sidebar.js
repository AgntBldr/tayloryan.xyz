
function renderWorkSidebar(activePage) {
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

    const menuItems = [
        { id: 'projects', label: 'Projects', icon: 'folder-kanban', url: '/work_projects/' },
        { id: 'quests', label: 'Quests', icon: 'sword', url: '/portfolio/quests/', color: 'text-purple-400' },
        { id: 'vibecoding', label: 'Vibecoding', icon: 'code-2', url: '/work_vibecoding/', color: 'text-blue-400' },
        { id: 'courses', label: 'Courses', icon: 'graduation-cap', url: '/work_courses/', color: 'text-orange-400' }
    ];

    const sidebarHTML = `
        <aside class="fixed top-0 left-0 h-screen w-64 bg-black border-r border-white/10 flex flex-col z-50 hidden md:flex">
            <!-- Header -->
            <div class="p-6 border-b border-white/5">
                <div class="flex items-center gap-3 mb-1">
                    <div class="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                        <i data-lucide="briefcase" class="w-5 h-5"></i>
                    </div>
                    <div>
                        <h1 class="font-bold text-white text-lg leading-none">Work Hub</h1>
                        <span class="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Active Projects</span>
                    </div>
                </div>
            </div>

            <!-- Navigation -->
            <nav class="flex-1 p-4 space-y-2 overflow-y-auto">
                <div class="pt-4 pb-2 px-4 text-[10px] font-bold text-neutral-600 uppercase tracking-widest">Navigation</div>
                ${menuItems.map(item => {
        const isActive = activePage === item.id;
        return `
                        <a href="${item.url}" class="sidebar-link ${isActive ? 'active' : ''}">
                            <i data-lucide="${item.icon}" class="sidebar-icon ${item.color || ''}"></i>
                            ${item.label}
                        </a>
                    `;
    }).join('')}
            </nav>

            <!-- Back to Home -->
            <div class="p-4 border-t border-white/5 bg-neutral-900/50">
                <a href="/" class="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/5">
                    <i data-lucide="arrow-left" class="w-4 h-4"></i>
                    <span class="text-sm font-bold">Back to Home</span>
                </a>
            </div>
        </aside>

        <!-- Mobile Header (Visible only on mobile) -->
        <div class="md:hidden fixed top-0 left-0 w-full z-40 bg-black/90 backdrop-blur border-b border-white/10 p-4 flex justify-between items-center">
             <div class="flex items-center gap-3">
                <div class="p-1.5 bg-blue-500/20 rounded text-blue-400">
                    <i data-lucide="briefcase" class="w-4 h-4"></i>
                </div>
                <span class="font-bold text-white">Work Hub</span>
            </div>
             <button class="p-2 text-neutral-400" onclick="document.querySelector('aside').classList.toggle('hidden'); document.querySelector('aside').classList.toggle('md:flex')">
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
