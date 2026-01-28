function renderWorkSidebar(activePage) {
    // Ensure styles for sidebar are present if not already
    // Use unique ID work-sidebar-styles
    if (!document.getElementById('work-sidebar-styles')) {
        const style = document.createElement('style');
        style.id = 'work-sidebar-styles';
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
            }
            /* Sidebar transitions */
            #work-sidebar { transition: transform 0.3s ease-in-out; }
        `;
        document.head.appendChild(style);
    }

    // Determine Menu Items based on context
    let menuItems = [];
    let isSpeakerPage = activePage === 'speaker' || activePage === 'testimonials' || activePage === 'speaker_topics' || activePage === 'contact';

    if (activePage === 'speaker' || window.location.pathname.includes('work_speaker') || window.location.pathname.includes('testimonials')) {
        // Special Speaker Menu
        isSpeakerPage = true;
    }

    if (isSpeakerPage) {
        renderSpeakerSidebar(activePage);
        return;
    }

    // Standard Work Menu
    menuItems = [
        { id: 'projects', label: 'Projects Hub', icon: 'briefcase', href: '/work_projects/', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        { id: 'vibecoding', label: 'Vibecoding', icon: 'code-2', href: '/work_vibecoding/', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
        { id: 'quests', label: 'Quests', icon: 'sword', href: '/portfolio/quests/', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        { id: 'speaker', label: 'Public Speaking', icon: 'mic-2', href: '/work_speaker/', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
        { id: 'podcasts', label: 'Podcasts', icon: 'headphones', href: '/work_podcasts/', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
        { id: 'writing', label: 'Writing', icon: 'pen-tool', href: '/work_writing/', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        { id: 'courses', label: 'Courses', icon: 'graduation-cap', href: '/work_courses/', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
        { id: 'tutorials', label: 'Tutorials', icon: 'video', href: '/work_tutorials/', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
        { id: 'marketing', label: 'Marketing Hub', icon: 'megaphone', href: '/portfolio/marketing/', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' }
    ];

    const sidebarHTML = `
    <div id="work-sidebar" class="fixed top-0 left-0 h-full w-64 bg-black border-r border-neutral-800 z-[100] transform -translate-x-full md:translate-x-0 overflow-y-auto transition-transform duration-300">
        <div class="p-6">
            <a href="/" class="block mb-8">
                <span class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">Taylor Ryan</span>
            </a>

            <nav class="space-y-2">
                ${menuItems.map(item => {
        // Fix active reasoning to catch sub-paths (e.g. /work_vibecoding/something)
        const isActive = (item.href === '/' && window.location.pathname === '/') ||
            (item.href !== '/' && window.location.pathname.startsWith(item.href));

        // Colors: Always apply text color for icon. Background/Border only on active.
        const activeClass = isActive
            ? `${item.bg} border ${item.border}`
            : 'hover:bg-neutral-900 border border-transparent';

        const labelClass = isActive ? 'text-white' : 'text-neutral-400 group-hover:text-white';

        return `
                    <a href="${item.href}" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${activeClass}">
                        <i data-lucide="${item.icon}" class="w-5 h-5 ${item.color} ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}"></i>
                        <span class="font-medium text-sm ${labelClass}">${item.label}</span>
                        ${isActive ? '<i data-lucide="chevron-right" class="w-4 h-4 ml-auto opacity-50 text-neutral-500"></i>' : ''}
                    </a>
                    `;
    }).join('')}
            </nav>
        </div>
        
        <!-- Mobile Close Button -->
        <button onclick="toggleSidebar()" class="md:hidden absolute top-4 right-4 text-neutral-400">
            <i data-lucide="x" class="w-6 h-6"></i>
        </button>
    </div>

    <!-- Mobile Toggle Button (Fixed) -->
    <button onclick="toggleSidebar()" class="md:hidden fixed bottom-6 right-6 z-[100] bg-neutral-900 border border-neutral-700 p-4 rounded-full shadow-2xl text-white">
        <i data-lucide="menu" class="w-6 h-6"></i>
    </button>
    `;

    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
    // Initialize icons
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderSpeakerSidebar(activePage) {
    const menuItems = [
        { id: 'speaker', label: 'Speaker Overview', icon: 'mic-2', href: '/work_speaker/', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        { id: 'testimonials', label: 'Testimonials', icon: 'message-square', href: '/testimonials/', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
        { id: 'speaker_topics', label: 'Speaker Topics', icon: 'list', href: '/work_speaker_topics/', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        { id: 'contact', label: 'Contact', icon: 'mail', href: '/contact/', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' }
    ];

    const sidebarHTML = `
    <div id="work-sidebar" class="fixed top-0 left-0 h-full w-64 bg-black border-r border-neutral-800 z-40 transform -translate-x-full md:translate-x-0 overflow-y-auto transition-transform duration-300">
        <div class="p-6">
            <a href="/" class="block mb-8">
                <span class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Speaker Hub</span>
            </a>

            <nav class="space-y-2">
                ${menuItems.map(item => {
        const isActive = activePage === item.id;
        const activeClass = isActive
            ? `${item.bg} ${item.color} border ${item.border}`
            : 'text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent';

        return `
                    <a href="${item.href}" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${activeClass}">
                        <i data-lucide="${item.icon}" class="w-5 h-5 ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}"></i>
                        <span class="font-medium text-sm">${item.label}</span>
                        ${isActive ? '<i data-lucide="chevron-right" class="w-4 h-4 ml-auto opacity-50"></i>' : ''}
                    </a>
                    `;
    }).join('')}
            </nav>

             <div class="mt-8 pt-8 border-t border-neutral-800">
                <span class="px-4 text-[10px] font-bold text-neutral-600 uppercase tracking-widest block mb-2">Portfolio</span>
                <nav class="space-y-1">
                    <a href="/work_projects/" class="flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-neutral-500 hover:text-white hover:bg-neutral-900 group">
                        <i data-lucide="layout-grid" class="w-4 h-4 text-blue-400 opacity-70 group-hover:opacity-100"></i>
                        <span class="font-medium text-sm">Projects Hub</span>
                    </a>
                    <a href="/work_vibecoding/" class="flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-neutral-500 hover:text-white hover:bg-neutral-900 group">
                        <i data-lucide="code-2" class="w-4 h-4 text-cyan-400 opacity-70 group-hover:opacity-100"></i>
                        <span class="font-medium text-sm">Vibecoding</span>
                    </a>
                    <a href="/portfolio/quests/" class="flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-neutral-500 hover:text-white hover:bg-neutral-900 group">
                        <i data-lucide="sword" class="w-4 h-4 text-purple-400 opacity-70 group-hover:opacity-100"></i>
                        <span class="font-medium text-sm">Quests</span>
                    </a>
                    <a href="/work_speaker/" class="flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-pink-400 bg-pink-500/10 border border-pink-500/20 group">
                        <i data-lucide="mic-2" class="w-4 h-4 text-pink-400 opacity-100"></i>
                        <span class="font-medium text-sm">Public Speaking</span>
                    </a>
                    <a href="/work_podcasts/" class="flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-neutral-500 hover:text-white hover:bg-neutral-900 group">
                        <i data-lucide="headphones" class="w-4 h-4 text-yellow-400 opacity-70 group-hover:opacity-100"></i>
                        <span class="font-medium text-sm">Podcasts</span>
                    </a>
                     <a href="/work_writing/" class="flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-neutral-500 hover:text-white hover:bg-neutral-900 group">
                        <i data-lucide="pen-tool" class="w-4 h-4 text-emerald-400 opacity-70 group-hover:opacity-100"></i>
                        <span class="font-medium text-sm">Writing</span>
                    </a>
                    <a href="/work_courses/" class="flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-neutral-500 hover:text-white hover:bg-neutral-900 group">
                        <i data-lucide="graduation-cap" class="w-4 h-4 text-orange-400 opacity-70 group-hover:opacity-100"></i>
                        <span class="font-medium text-sm">Courses</span>
                    </a>
                    <a href="/work_tutorials/" class="flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-neutral-500 hover:text-white hover:bg-neutral-900 group">
                        <i data-lucide="video" class="w-4 h-4 text-red-500 opacity-70 group-hover:opacity-100"></i>
                        <span class="font-medium text-sm">Tutorials</span>
                    </a>
                     <a href="/portfolio/marketing/" class="flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-neutral-500 hover:text-white hover:bg-neutral-900 group">
                        <i data-lucide="megaphone" class="w-4 h-4 text-green-400 opacity-70 group-hover:opacity-100"></i>
                        <span class="font-medium text-sm">Marketing Hub</span>
                    </a>
                </nav>
            </div>
             <button class="p-2 text-neutral-400" onclick="document.querySelector('aside').classList.toggle('hidden'); document.querySelector('aside').classList.toggle('md:flex')">
                <i data-lucide="menu" class="w-6 h-6"></i>
            </button>
        </div>
    </div>
    
    <!-- Mobile Toggle Button (Fixed) -->
    <button onclick="toggleSidebar()" class="md:hidden fixed bottom-6 right-6 z-50 bg-neutral-900 border border-neutral-700 p-4 rounded-full shadow-2xl text-white">
        <i data-lucide="menu" class="w-6 h-6"></i>
    </button>
    `;

    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

function renderAboutSidebar(activePage) {
    const menuItems = [
        { id: 'skills', label: 'Skills Matrix', icon: 'zap', href: '/skills/', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        { id: 'skills_detailed', label: 'Detailed Breakdown', icon: 'list', href: '/skills_detailed/', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        { id: 'awards', label: 'Awards & Honors', icon: 'trophy', href: '/work_awards/', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
        { id: 'testimonials', label: 'Testimonials', icon: 'message-circle', href: '/testimonials/', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
        { id: 'about', label: 'About Me', icon: 'user', href: '/about.html', color: 'text-neutral-400', bg: 'bg-neutral-500/10', border: 'border-neutral-500/20' }
    ];

    const sidebarHTML = `
    <div id="work-sidebar" class="fixed top-0 left-0 h-full w-64 bg-black border-r border-neutral-800 z-40 transform -translate-x-full md:translate-x-0 overflow-y-auto transition-transform duration-300">
        <div class="p-6">
            <a href="/" class="block mb-8">
                <span class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-green-400">About Hub</span>
            </a>

            <nav class="space-y-2">
                ${menuItems.map(item => {
        const isActive = activePage === item.id;
        const activeClass = isActive
            ? `${item.bg} ${item.color} border ${item.border}`
            : 'text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent';

        return `
                    <a href="${item.href}" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${activeClass}">
                        <i data-lucide="${item.icon}" class="w-5 h-5 ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}"></i>
                        <span class="font-medium text-sm">${item.label}</span>
                        ${isActive ? '<i data-lucide="chevron-right" class="w-4 h-4 ml-auto opacity-50"></i>' : ''}
                    </a>
                    `;
    }).join('')}
            </nav>
            
             <div class="mt-8 pt-8 border-t border-neutral-800">
                <a href="/work.html" class="flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-neutral-500 hover:text-white hover:bg-neutral-900 group">
                    <i data-lucide="briefcase" class="w-4 h-4 text-neutral-500 opacity-70 group-hover:opacity-100"></i>
                    <span class="font-medium text-sm">View Work Portfolio</span>
                </a>
             </div>
             
             <button class="p-2 text-neutral-400 absolute top-4 right-4 md:hidden" onclick="toggleSidebar()">
                <i data-lucide="x" class="w-6 h-6"></i>
            </button>
        </div>
    </div>
    
     <!-- Mobile Toggle Button (Fixed) -->
    <button onclick="toggleSidebar()" class="md:hidden fixed bottom-6 right-6 z-50 bg-neutral-900 border border-neutral-700 p-4 rounded-full shadow-2xl text-white">
        <i data-lucide="menu" class="w-6 h-6"></i>
    </button>
    `;

    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
    // Initialize icons
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Global Toggle logic is now handled in work_scroll.js to support all sidebars
