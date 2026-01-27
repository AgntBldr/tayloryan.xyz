
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
            /* Sidebar transitions */
            #work-sidebar { transition: transform 0.3s ease-in-out; }
            @media (min-width: 768px) { #work-sidebar { transform: translateX(0) !important; } }
        `;
        document.head.appendChild(style);
    }

    // Determine Menu Items based on context
    let menuItems = [];
    let isSpeakerPage = activePage === 'speaker' || activePage === 'testimonials' || activePage === 'speaker_topics' || activePage === 'contact';

    if (activePage === 'speaker' || window.location.pathname.includes('work_speaker')) {
        // Special Speaker Menu
        // Ensure we catch "work_speaker" as the active page correctly if passed specifically
        isSpeakerPage = true;
    }

    if (isSpeakerPage) {
        renderSpeakerSidebar(activePage);
        return;
    }

    // Standard Work Menu
    menuItems = [
        { id: 'vibecoding', label: 'Vibecoding', icon: 'code-2', href: '/work_vibecoding/', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20' },
        { id: 'projects', label: 'Projects Hub', icon: 'briefcase', href: '/work_projects/', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        { id: 'quests', label: 'Quests', icon: 'sword', href: '/portfolio/quests/', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        { id: 'speaker', label: 'Public Speaking', icon: 'mic-2', href: '/work_speaker/', color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20' },
        { id: 'podcasts', label: 'Podcasts', icon: 'headphones', href: '/work_podcasts/', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
        { id: 'writing', label: 'Writing', icon: 'pen-tool', href: '/work_writing/', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
        { id: 'courses', label: 'Courses', icon: 'graduation-cap', href: '/work_courses/', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' },
        { id: 'tutorials', label: 'Tutorials', icon: 'video', href: '/work_tutorials/', color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' },
        { id: 'marketing', label: 'Marketing Hub', icon: 'megaphone', href: '/portfolio/marketing/', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' }
    ];

    const sidebarHTML = `
    <div id="work-sidebar" class="fixed top-0 left-0 h-full w-64 bg-black border-r border-neutral-800 z-40 transform -translate-x-full md:translate-x-0 overflow-y-auto">
        <div class="p-6">
            <a href="/" class="block mb-8">
                <span class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-neutral-100 to-neutral-400">Taylor Ryan</span>
            </a>

            <nav class="space-y-2">
                ${menuItems.map(item => {
        const isActive = activePage === item.id;
        const activeClass = isActive
            ? `\${item.bg} \${item.color} border \${item.border}`
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
        </div>
        
        <!-- Mobile Close Button -->
        <button onclick="toggleSidebar()" class="md:hidden absolute top-4 right-4 text-neutral-400">
            <i data-lucide="x" class="w-6 h-6"></i>
        </button>
    </div>

    <!-- Mobile Toggle Button (Fixed) -->
    <button onclick="toggleSidebar()" class="md:hidden fixed bottom-6 right-6 z-50 bg-neutral-900 border border-neutral-700 p-4 rounded-full shadow-2xl text-white">
        <i data-lucide="menu" class="w-6 h-6"></i>
    </button>
    `;

    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
}

function renderSpeakerSidebar(activePage) {
    const menuItems = [
        { id: 'speaker', label: 'Speaker Overview', icon: 'mic-2', href: '/work_speaker/', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
        { id: 'testimonials', label: 'Testimonials', icon: 'message-square', href: '/testimonials/', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
        { id: 'speaker_topics', label: 'Speaker Topics', icon: 'list', href: '/work_speaker_topics/', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
        { id: 'contact', label: 'Contact', icon: 'mail', href: '/contact/', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' }
    ];

    const sidebarHTML = `
    <div id="work-sidebar" class="fixed top-0 left-0 h-full w-64 bg-black border-r border-neutral-800 z-40 transform -translate-x-full md:translate-x-0 overflow-y-auto">
        <div class="p-6">
            <a href="/" class="block mb-8">
                <span class="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Speaker Hub</span>
            </a>

            <nav class="space-y-2">
                ${menuItems.map(item => {
        const isActive = activePage === item.id;
        const activeClass = isActive
            ? `\${item.bg} \${item.color} border \${item.border}`
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
                <a href="/work_projects/" class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-neutral-500 hover:text-white group">
                    <i data-lucide="arrow-left" class="w-5 h-5"></i>
                    <span class="font-medium text-sm">Back to Projects</span>
                </a>
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
