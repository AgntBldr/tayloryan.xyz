const QUEST_RESOURCES = {
    categories: [
        { id: 'discovery', name: 'Project Discovery', description: 'Find projects to create quests' },
        { id: 'enrichment', name: 'Quest Enrichment', description: 'Research the project and find links and information' },
        { id: 'building', name: 'Quest Building', description: 'Setup the first draft, use the quest builder, and get the quest reviewed' },
        { id: 'promotion', name: 'Quest Promotion', description: 'After publishing the quest, promoting the quest for user adoption' }
    ],
    items: [
        // --- Project Discovery ---
        {
            id: 'res-all',
            category: 'discovery',
            title: 'All Quest Portfolio Resources',
            type: 'Sheet',
            image: 'assets/overview/overview_image_1.png',
            description: 'Master list of all resources used in the portfolio.'
        },
        {
            id: 'res-platforms',
            category: 'discovery',
            title: 'Quest Platforms - Project Discovery',
            type: 'Sheet',
            image: 'assets/discover.png',
            description: 'List of major quest platforms and aggregators.'
        },
        {
            id: 'res-accelerators',
            category: 'discovery',
            title: 'Accelerators - Blockchain & Web3',
            type: 'Sheet',
            image: 'assets/arch.png',
            description: 'Top accelerators in the crypto space for deal flow.'
        },
        {
            id: 'res-airdrops',
            category: 'discovery',
            title: 'Airdrops and ICOs',
            type: 'Sheet',
            image: 'assets/sats.png',
            description: 'Tracking upcoming token events and opportunities.'
        },
        {
            id: 'res-funding',
            category: 'discovery',
            title: 'Funding Feeds',
            type: 'Sheet',
            image: 'assets/gorillionaire.png',
            description: 'Latest rounds and raises in the ecosystem.'
        },
        {
            id: 'res-events',
            category: 'discovery',
            title: 'All Crypto Event Directories',
            type: 'Sheet',
            image: 'assets/river.png',
            description: 'Comprehensive list of global crypto events.'
        },
        {
            id: 'res-hackathons',
            category: 'discovery',
            title: 'Hackathon Directories',
            type: 'Sheet',
            image: 'assets/terminal.png',
            description: 'Where builders gather - great for finding early projects.'
        },
        {
            id: 'res-pitch',
            category: 'discovery',
            title: 'Pitch Competitions',
            type: 'Sheet',
            image: 'assets/zeebu.png',
            description: 'Listing of upcoming pitch competitions.'
        },
        {
            id: 'res-twitter',
            category: 'discovery',
            title: 'X / Twitter - Airdrop Alerts',
            type: 'Sheet',
            image: 'assets/waye.png',
            description: 'Key accounts tracking airdrop alpha.'
        },
        {
            id: 'res-telegram',
            category: 'discovery',
            title: 'Telegram Airdrop Channels',
            type: 'Sheet',
            image: 'assets/membit.png',
            description: 'Community channels for real-time alerts.'
        },
        {
            id: 'res-search',
            category: 'discovery',
            title: 'Search Terms - Airdrop',
            type: 'Sheet',
            image: 'assets/glider.png',
            description: 'Optimized search queries for finding new opportunities.'
        },

        // --- Quest Enrichment ---
        {
            id: 'res-collection',
            category: 'enrichment',
            title: 'Quest Collection',
            type: 'Sheet',
            image: 'assets/overview/overview_image_2.png',
            description: 'Database of completed and in-progress quests.'
        },
        {
            id: 'res-prompt-research',
            category: 'enrichment',
            title: 'Prompt - Quest Project Research',
            type: 'Doc',
            image: 'assets/haiku_agent.png',
            description: 'AI prompt for deep-diving into project docs and whitepapers.'
        },
        {
            id: 'res-enrichment',
            category: 'enrichment',
            title: 'Quest Enrichment Guide',
            type: 'Doc',
            image: 'assets/dria.png',
            description: 'Methodology for gathering assets and metadata.'
        },

        // --- Quest Building ---
        {
            id: 'res-prompt-quest',
            category: 'building',
            title: 'Prompt - Quest Prompt',
            type: 'Doc',
            image: 'assets/cables.png',
            description: 'The core AI prompt used to generate quest structures.'
        },
        {
            id: 'res-template',
            category: 'building',
            title: 'Template - Quest Template',
            type: 'Doc',
            image: 'assets/overview/overview_image_3.png',
            description: 'Standardized structure for quest deliverables.'
        },

        // --- Quest Promotion ---
        {
            id: 'res-prompt-written',
            category: 'promotion',
            title: 'Prompt - Written Posts',
            type: 'Doc',
            image: 'assets/scribbledao.png',
            description: 'Generating engaging social media copy for launches.'
        },
        {
            id: 'res-prompt-promo',
            category: 'promotion',
            title: 'Prompt - Quest Promotion',
            type: 'Doc',
            image: 'assets/overview/overview_image_5.png',
            description: 'Strategy guide for maximizing quest participation.'
        }
    ]
};
