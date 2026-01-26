import re

html_path = r'c:\Users\tempv2\Desktop\PortfolioAgent\quest_portfolio.html'

with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add Nav Button
if 'id="btn-resources"' not in content:
    nav_pattern = r'(<button onclick="switchView\(\'analytics\'\)" id="btn-analytics"[^>]*>Analytics</button>)'
    nav_replacement = r'\1\n            <button onclick="switchView(\'resources\')" id="btn-resources" class="px-6 py-2 rounded-full text-sm font-bold text-neutral-500 hover:text-white transition-all">Resources</button>'
    content = re.sub(nav_pattern, nav_replacement, content)

# 2. Add Container Views (Grid + Detail)
if 'id="resources-view"' not in content:
    view_html = """
    <!-- RESOURCES VIEW -->
    <div id="resources-view" class="hidden max-w-7xl mx-auto pb-12 transition-opacity duration-300 opacity-0 relative z-10">
        <div class="mb-8">
            <h2 class="text-3xl font-bold text-white mb-2">Quest Resources</h2>
            <p class="text-neutral-400">Curated databases, prompts, and tools used to build this portfolio.</p>
        </div>
        
        <!-- Categories Container -->
        <div id="resources-container" class="space-y-12">
            <!-- Injected via JS -->
        </div>
    </div>

    <!-- RESOURCE DETAIL VIEW -->
    <div id="resource-detail-view" class="hidden max-w-7xl mx-auto pb-12 transition-opacity duration-300 opacity-0 relative z-20">
        <!-- Breadcrumbs -->
        <button onclick="switchView('resources')" class="flex items-center gap-2 text-neutral-500 hover:text-purple-400 mb-6 transition-colors group">
            <i data-lucide="arrow-left" class="w-4 h-4 group-hover:-translate-x-1 transition-transform"></i>
            <span class="text-sm font-medium">Back to Resources</span>
        </button>

        <div class="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden min-h-[600px]">
            <!-- Header -->
            <div class="h-48 relative overflow-hidden">
                <img id="res-detail-image" src="" class="w-full h-full object-cover opacity-40">
                <div class="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent"></div>
                <div class="absolute bottom-6 left-6 right-6">
                    <div class="flex items-center gap-3 mb-2">
                        <span id="res-detail-type" class="px-2 py-1 rounded text-xs font-mono uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">Sheet</span>
                        <span id="res-detail-cat" class="text-neutral-400 text-sm uppercase tracking-wider font-medium">Category</span>
                    </div>
                    <h1 id="res-detail-title" class="text-3xl md:text-4xl font-bold text-white leading-tight">Resource Title</h1>
                </div>
            </div>

            <!-- Content Area -->
            <div class="p-6 md:p-8">
                <p id="res-detail-desc" class="text-neutral-300 text-lg mb-8 max-w-3xl">Description goes here.</p>
                
                <!-- Dynamic Content (Table or Text) -->
                <div id="res-detail-content" class="bg-neutral-800/30 border border-neutral-800 rounded-xl overflow-hidden min-h-[300px] relative">
                    <!-- Content Injected -->
                </div>
                
                <div class="mt-6 flex justify-end">
                     <a id="res-detail-link" href="#" target="_blank" class="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg font-bold transition-colors">
                        <span>Open Original Source</span>
                        <i data-lucide="external-link" class="w-4 h-4"></i>
                    </a>
                </div>
            </div>
        </div>
    </div>
    """
    # Insert before analytics or after overview
    content = content.replace('<div id="analytics-view"', view_html + '\n    <div id="analytics-view"')

# 3. Add Script Include
if 'assets/js/quest_resources.js' not in content:
    content = content.replace('<script src="quests_data.js"></script>', '<script src="quests_data.js"></script>\n    <script src="assets/js/quest_resources.js"></script>')

# 4. Inject Logic (switchView update + new functions)
# We append specific functions to the script block using a marker
if 'function renderResources()' not in content:
    logic_extensions = """
        // --- RESOURCES LOGIC ---
        function renderResources() {
            const container = document.getElementById('resources-container');
            container.innerHTML = '';

            QUEST_RESOURCES.categories.forEach(cat => {
                const items = QUEST_RESOURCES.items.filter(i => i.category === cat.id);
                if (items.length === 0) return;

                const section = document.createElement('div');
                section.className = 'animate-fade-in';
                section.innerHTML = `
                    <h3 class="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        <span class="w-1 h-6 bg-purple-500 rounded-full"></span> ${cat.name}
                    </h3>
                    <p class="text-neutral-500 text-sm mb-6 ml-3">${cat.description}</p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        ${items.map(item => `
                            <div onclick="openResourceDetail('${item.id}')" class="group bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden cursor-pointer hover:border-purple-500/50 transition-all hover:-translate-y-1 relative">
                                <div class="h-32 relative overflow-hidden bg-neutral-800">
                                    <img src="${item.image}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80">
                                    <div class="absolute inset-0 bg-gradient-to-t from-neutral-900/90 to-transparent"></div>
                                    <div class="absolute top-3 right-3">
                                        <span class="px-2 py-1 rounded text-[10px] font-bold uppercase ${item.type === 'Sheet' ? 'bg-green-900/80 text-green-300' : 'bg-blue-900/80 text-blue-300'} backdrop-blur-sm border border-white/5">
                                            ${item.type}
                                        </span>
                                    </div>
                                </div>
                                <div class="p-5 relative">
                                    <h4 class="text-white font-bold text-lg mb-1 group-hover:text-purple-400 transition-colors leading-tight">${item.title}</h4>
                                    <p class="text-neutral-500 text-xs line-clamp-2">${item.description}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;
                container.appendChild(section);
            });
            lucide.createIcons();
        }

        function openResourceDetail(id) {
            const item = QUEST_RESOURCES.items.find(i => i.id === id);
            if (!item) return;

            // Populate Detail View
            document.getElementById('res-detail-image').src = item.image;
            document.getElementById('res-detail-title').innerText = item.title;
            document.getElementById('res-detail-desc').innerText = item.description;
            document.getElementById('res-detail-type').innerText = item.type;
            document.getElementById('res-detail-cat').innerText = QUEST_RESOURCES.categories.find(c => c.id === item.category)?.name || 'Resource';
            
            // Mock Content Generation
            const contentDiv = document.getElementById('res-detail-content');
            if (item.type === 'Sheet') {
                contentDiv.innerHTML = `
                    <div class="p-4 border-b border-neutral-800 bg-neutral-900/50 flex justify-between items-center">
                        <span class="text-xs font-mono text-neutral-500">124 Rows • Last updated yesterday</span>
                        <div class="flex gap-2">
                            <div class="w-3 h-3 rounded-full bg-red-500/20"></div>
                            <div class="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                            <div class="w-3 h-3 rounded-full bg-green-500/20"></div>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left text-sm text-neutral-400">
                            <thead class="bg-neutral-800 text-neutral-200">
                                <tr>
                                    <th class="p-4 font-medium">Name</th>
                                    <th class="p-4 font-medium">Category</th>
                                    <th class="p-4 font-medium">Status</th>
                                    <th class="p-4 font-medium">Link</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-neutral-800/50">
                                ${[1,2,3,4,5].map(i => `
                                    <tr class="hover:bg-neutral-700/20">
                                        <td class="p-4 text-white">Item Example ${i}</td>
                                        <td class="p-4">${item.category}</td>
                                        <td class="p-4"><span class="px-2 py-0.5 rounded-full bg-neutral-800 border border-neutral-700 text-xs">Active</span></td>
                                        <td class="p-4 text-purple-400 cursor-pointer hover:underline">View</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                    <div class="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                        <div class="text-center p-6 bg-neutral-900 border border-purple-500/30 rounded-xl shadow-2xl max-w-sm">
                            <i data-lucide="lock" class="w-8 h-8 text-purple-500 mx-auto mb-3"></i>
                            <h3 class="text-white font-bold mb-1">Preview Mode</h3>
                            <p class="text-neutral-400 text-sm mb-4">Live data sync requires API configuration.</p>
                            <a href="https://docs.google.com/spreadsheets/d/1xKfrR7PgbR3ZVBgg-VcbNPDM-sW3YG333HIhulw3wko/edit?usp=drive_link" target="_blank" class="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-bold transition-colors">
                                Open Google Sheet
                            </a>
                        </div>
                    </div>
                `;
            } else {
                contentDiv.innerHTML = `
                    <div class="p-8 md:p-12 prose prose-invert max-w-none">
                        <h3>${item.title}</h3>
                        <p>This resource contains structured prompts and styling guides for ${item.category}.</p>
                        <hr class="border-neutral-700 my-6">
                        <div class="bg-neutral-900 p-6 rounded-lg border border-neutral-700 font-mono text-sm text-green-400 overflow-x-auto">
                            // AI Prompt Example<br>
                            Role: Expert Web3 Growth Marketer<br>
                            Task: Analyze the attached whitepaper for ${item.category} opportunities.<br>
                            Output: Bulleted list of integration points...
                        </div>
                        <p class="mt-6 text-neutral-400">Full document content is available in the original source file.</p>
                    </div>
                `;
            }
            
            // Set Link
            const linkBtn = document.getElementById('res-detail-link');
            // Hardcoded master link as fallback or logic to find specific link if we had it
            linkBtn.href = "https://docs.google.com/spreadsheets/d/1xKfrR7PgbR3ZVBgg-VcbNPDM-sW3YG333HIhulw3wko/edit?usp=drive_link"; 

            switchView('resource-detail');
            lucide.createIcons();
        }
    """
    # Insert logic before document.addEventListener
    content = content.replace('document.addEventListener(\'DOMContentLoaded\', init);', logic_extensions + '\n        document.addEventListener(\'DOMContentLoaded\', init);')

# 5. Patch switchView logic to include new views
# Regex to find the [grid, analytics, overview] array and add the new one
reset_logic = r'\[grid, analytics, overview\]\.forEach'
new_reset_logic = r'[grid, analytics, overview, document.getElementById("resources-view"), document.getElementById("resource-detail-view")].forEach'
content = re.sub(reset_logic, new_reset_logic, content)

# Regex to find "const btnOverview" and add btnResources
btn_decl = r'(const btnOverview = document.getElementById\(\'btn-overview\'\);)'
btn_decl_new = r'\1\n            const btnResources = document.getElementById(\'btn-resources\');'
content = re.sub(btn_decl, btn_decl_new, content)

# Update reset buttons logic
reset_btns = r'\[btnGrid, btnAnalytics, btnOverview\]\.forEach'
new_reset_btns = r'[btnGrid, btnAnalytics, btnOverview, btnResources].forEach'
content = re.sub(reset_btns, new_reset_btns, content)

# Add logic for view === 'resources' 
if "else if (view === 'resources')" not in content:
    view_logic_pattern = r'(else if \(view === \'overview\'\) \{[^}]+\})'
    resources_logic = """
            } else if (view === 'resources') {
                const resView = document.getElementById('resources-view');
                resView.classList.remove('hidden');
                controls.classList.add('hidden');
                setTimeout(() => resView.classList.remove('opacity-0'), 10);

                btnResources.classList.add('bg-neutral-800', 'text-white', 'shadow-lg');
                btnResources.classList.remove('text-neutral-500');
                renderResources();
            } else if (view === 'resource-detail') {
                const detailView = document.getElementById('resource-detail-view');
                detailView.classList.remove('hidden');
                controls.classList.add('hidden');
                setTimeout(() => detailView.classList.remove('opacity-0'), 10);
                
                // Keep Resource Tab Active
                btnResources.classList.add('bg-neutral-800', 'text-white', 'shadow-lg');
                btnResources.classList.remove('text-neutral-500');
            """
    content = re.sub(view_logic_pattern, r'\1' + resources_logic, content)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Quest resources tab injected successfully.")
