document.addEventListener('DOMContentLoaded', () => {
    // Initial Render Logic
    const initSidebar = () => {
        if (!document.getElementById('work-sidebar')) {
            // Check if render function is available
            if (typeof renderWorkSidebar === 'function') {
                renderWorkSidebar('projects');
            } else {
                console.warn('renderWorkSidebar not ready yet. Retrying...');
                setTimeout(initSidebar, 100);
            }
        }
    };

    // Run immediately if ready, else wait
    if (document.readyState === 'loading') {
        // We are already in DOMContentLoaded listener, so we just run
        initSidebar();
    } else {
        initSidebar();
    }

    let currentSidebarState = 'projects'; // Default to projects since we just rendered it
    let isTransitioning = false;

    // Map sections to sidebar states
    const sectionMap = {
        'section-projects': { type: 'projects', arg: 'projects' },
        'section-marketing': { type: 'marketing', arg: 'overview' },
        'section-skills': { type: 'about', arg: 'skills' },
        'section-testimonials': { type: 'about', arg: 'testimonials' }
    };

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px', // Trigger when section is mostly in view
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                const config = sectionMap[id];

                if (config) {
                    handleSidebarSwitch(config.type, config.arg);
                }
            }
        });

    }, observerOptions);

    // Observe
    Object.keys(sectionMap).forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    });

    function handleSidebarSwitch(newType, newArg) {
        if (currentSidebarState === newType) {
            // Same sidebar, maybe just update active link if we wanted sophisticated logic.
            // For now, doing nothing avoids flicker.
            return;
        }
        transitionSidebar(newType, newArg);
    }

    async function transitionSidebar(type, arg) {
        if (isTransitioning) return;
        isTransitioning = true;

        const isDesktop = window.innerWidth >= 768;
        const sidebar = document.getElementById('work-sidebar');

        if (sidebar) {
            // Slide Out (Only animation on Desktop)
            if (isDesktop) {
                sidebar.classList.remove('md:translate-x-0');
                sidebar.classList.add('-translate-x-full'); // Ensure closed state is active
                await new Promise(r => setTimeout(r, 300));
            }
            sidebar.remove();
        }

        // Render New
        if (type === 'projects') {
            renderWorkSidebar(arg);
        } else if (type === 'marketing') {
            renderMarketingSidebar(arg);
        } else if (type === 'about') {
            renderAboutSidebar(arg);
        }

        const newSidebar = document.getElementById('work-sidebar');
        if (newSidebar) {
            if (isDesktop) {
                // Prepare for Slide In (Desktop Only)
                // Start hidden (it has -translate-x-full from HTML, but also md:translate-x-0)
                // We need to override md:translate-x-0 temporarily
                newSidebar.classList.remove('md:translate-x-0');

                // Force Reflow
                void newSidebar.offsetWidth;

                // Slide In
                newSidebar.classList.add('md:translate-x-0');
            }
            // On Mobile: It renders with -translate-x-full by default, so it stays hidden. 
            // The Toggle button will open it.
        }

        currentSidebarState = type;
        isTransitioning = false;
    }

});

// Global Sidebar Toggle (Mobile) - Attached to Window for Scope Safety
window.toggleSidebar = function () {
    const sidebar = document.getElementById('work-sidebar');
    if (sidebar) {
        // Toggle the translate class to show/hide
        sidebar.classList.toggle('-translate-x-full');

        // Ensure z-index is correct if it was somehow lost (safety)
        if (!sidebar.classList.contains('-translate-x-full')) {
            sidebar.style.zIndex = '50';
        }
    } else {
        console.warn('Sidebar toggle clicked but no #work-sidebar found.');
    }
};
