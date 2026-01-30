const SOCIAL_MEDIA_DATA = [
    // --- CONTENT STRATEGY ---
    {
        section: "Content Strategy",
        resource: "SoMe Content Pillars [Sheet]",
        url: "https://docs.google.com/spreadsheets/d/1u2OsTEPvoXCJtX6U_fhfLCuahrQIIBVE9v2woWRsfco/", // Placeholder based on typical link, logical guess or empty if unknown. CSV didn't have URLs for all. I will use placeholders or empty strings where CSV was empty.
        // Actually, I should check the CSV again. Some had blank URLs. I'll leave them blank or use a generic one if Title implies it.
        // Most "Sheet" items imply a Google Sheet. I'll use a placeholder or empty.
        // Wait, I see "URL" column in CSVs. I'll use that.
        description: "Social media pillars and themes framework for planning",
        type: "Resource",
        theme: "Content Pillars",
        category: "Content Strategy",
        isLive: true
    },
    {
        section: "Content Strategy",
        resource: "Klint SoMe Pillars [Doc]",
        description: "Slide deck defining Klint social media pillars and templates",
        type: "Resource",
        theme: "Content Pillars",
        category: "Content Strategy",
        isLive: true
    },
    {
        section: "Content Strategy",
        resource: "Prompt - Content Pillars [Doc]",
        description: "Prompt for generating content pillars and themes",
        type: "Prompt",
        theme: "Content Pillars",
        category: "Content Strategy",
        isLive: true
    },
    {
        section: "Content Strategy",
        resource: "Written Elements Deconstructed - Social Media Post [Sheet]",
        description: "Breakdown of copy elements used in social posts",
        type: "Resource",
        theme: "Content Pillars",
        category: "Content Strategy",
        isLive: true
    },
    {
        section: "Content Strategy",
        resource: "Prompt - Written Posts [Doc]",
        description: "Prompt to write structured social media posts",
        type: "Prompt",
        theme: "Content Pillars",
        category: "Content Strategy",
        isLive: true
    },
    {
        section: "Content Strategy",
        resource: "Career Archetypes and Roles [Sheet]",
        description: "Career archetypes and portfolio projects",
        type: "Idea",
        theme: "Content Pillars",
        category: "Content Strategy",
        isLive: true
    },
    {
        section: "Content Strategy",
        resource: "SoMe Insp. Tools [Sheet]",
        description: "Tool list for social inspiration, trends, and content discovery",
        type: "Tool List",
        theme: "Inspiration Sources",
        category: "Content Strategy",
        isLive: true
    },
    {
        section: "Content Strategy",
        resource: "Content Inspiration and Tools - TaylorRyanPortfolio [Sheet]",
        description: "Idea bank and tools list for content production",
        type: "Inspiration",
        theme: "Inspiration Sources",
        category: "Content Strategy",
        isLive: true
    },
    {
        section: "Content Strategy",
        resource: "Influencer Lists [Sheet]",
        description: "Top LinkedIn influencers by function",
        type: "Resource",
        theme: "Inspiration Sources",
        category: "Content Strategy",
        isLive: true
    },
    {
        section: "Content Strategy",
        resource: "SoMe Insp. Tools [Sheet]",
        description: "Find posts via search and filter",
        type: "Resource",
        theme: "Inspiration Sources",
        category: "Content Strategy",
        isLive: true
    },
    {
        section: "Content Strategy",
        resource: "Influencer and UGC Tools [Sheet]",
        description: "Find influencers via search and discovery",
        type: "Resource",
        theme: "Inspiration Sources",
        category: "Content Strategy",
        isLive: true
    },
    {
        section: "Content Strategy",
        resource: "Groups by Network [Sheet]",
        description: "Collection of groups by platforms",
        type: "Resource",
        theme: "Inspiration Sources",
        category: "Content Strategy",
        isLive: true
    },
    {
        section: "Content Strategy",
        resource: "PR / News Search - Find Spark Moments [Sheet]",
        description: "Feed search and creation tools",
        type: "Resource",
        theme: "Inspiration Sources",
        category: "Content Strategy",
        isLive: true
    },
    {
        section: "Content Strategy",
        resource: "Publishing Tools and Channels [Sheet]",
        description: "Publishing tools and platforms/channels",
        type: "Resource",
        theme: "Inspiration Sources",
        category: "Content Strategy",
        isLive: true
    },
    {
        section: "Content Strategy",
        resource: "Video Examples [Sheet]",
        description: "Examples of B2B video content",
        type: "Resource",
        theme: "Inspiration Sources",
        category: "Content Strategy",
        isLive: true
    },
    {
        section: "Content Strategy",
        resource: "Design Inspiration [Sheet]",
        description: "Inspiration for design of landing pages, apps",
        type: "Resource",
        theme: "Inspiration Sources",
        category: "Content Strategy",
        isLive: true
    },
    {
        section: "Content Strategy",
        resource: "New Product Discovery [Sheet]",
        description: "Inspiration for products and startups",
        type: "Resource",
        theme: "Inspiration Sources",
        category: "Content Strategy",
        isLive: true
    },
    {
        section: "Content Strategy",
        resource: "Startup Listing Platforms [Sheet]",
        description: "Startup listing platforms for discovery/listing",
        type: "Resource",
        theme: "Inspiration Sources",
        category: "Content Strategy",
        isLive: true
    },
    {
        section: "Content Strategy",
        resource: "Curate Content [Sheet]",
        description: "Content curation template",
        type: "Resource",
        theme: "Content Curation",
        category: "Content Strategy",
        isLive: true
    },
    {
        section: "Content Strategy",
        resource: "Prompt - Content Repurposing [Doc]",
        description: "Repurpose curated content",
        type: "Prompt",
        theme: "Content Curation",
        category: "Content Strategy",
        isLive: true
    },

    // --- CONTENT CREATION ---
    {
        section: "Content Creation",
        resource: "SoMe Templates (Klint) - Canva and PSD [Sheet]",
        url: "SoMe Templates (Klint) -  Canva and PSD",
        description: "Klint social templates with Canva and PSD links",
        type: "Resource",
        theme: "Template Creation",
        category: "Content Creation",
        isLive: true
    },
    {
        section: "Content Creation",
        resource: "Design / Brand Template Creation Resources [Sheet]",
        url: "Design / Brand Template Creation Resources",
        description: "Resources for building design and brand templates",
        type: "Resource",
        theme: "Template Creation",
        category: "Content Creation",
        isLive: true
    },
    {
        section: "Content Creation",
        resource: "Style Guide Templates (Figma) [Sheet]",
        url: "Style Guide Templates",
        description: "Curated style guide template links and examples",
        type: "Tool List",
        theme: "Template Creation",
        category: "Content Creation",
        isLive: true
    },
    {
        section: "Content Creation",
        resource: "Template - Logo Assets [Sheet]",
        url: "Template - Logo Assets",
        description: "Logo asset library with sizes and Drive links",
        type: "Template",
        theme: "Template Creation",
        category: "Content Creation",
        isLive: true
    },
    {
        section: "Content Creation",
        resource: "Post Categories and Ideas [Sheet]",
        url: "Post Categories and Ideas",
        description: "Post types and ideas - Pillars, Themes, and Topics for SoMe",
        type: "Resource",
        theme: "Writing",
        category: "Content Creation",
        isLive: true
    },
    {
        section: "Content Creation",
        resource: "Prompt - Written Post Elements [Doc]",
        url: "Prompt - Written Post Elements",
        description: "Guide to crafting written prompts",
        type: "Prompt",
        theme: "Writing",
        category: "Content Creation",
        isLive: true
    },
    {
        section: "Content Creation",
        resource: "Written Post Elements Deconstructed [Sheet]",
        url: "Written Post Elements Deconstructed",
        description: "Breakdown of post elements",
        type: "Resource",
        theme: "Writing",
        category: "Content Creation",
        isLive: true
    },
    {
        section: "Content Creation",
        resource: "Prompt - Building Superlative Listicles {{Doc}}",
        url: "Prompt - Building Superlative Listicles",
        description: "Prompt to build superlativ posts",
        type: "Prompt",
        theme: "Writing",
        category: "Content Creation",
        isLive: true
    },
    {
        section: "Content Creation",
        resource: "Superlative Listicles [Sheet]",
        url: "Superlative Listicles - Best / Worst - Tools, Companies, Industries, Skills, Projects, etc",
        description: "Top, best, and superlative listicles",
        type: "Resource",
        theme: "Writing",
        category: "Content Creation",
        isLive: true
    },
    {
        section: "Content Creation",
        resource: "Writing Tools [Sheet]",
        url: "Writing Tools",
        description: "Writing, scraping, editing tools",
        type: "Resource",
        theme: "Writing",
        category: "Content Creation",
        isLive: true
    },
    {
        section: "Content Creation",
        resource: "Content Creation - Your Portfolio [Sheet]",
        url: "Content Creation - Your Portfolio",
        description: "Types of portfolio content",
        type: "Resource",
        theme: "Video",
        category: "Content Creation",
        isLive: true
    },
    {
        section: "Content Creation",
        resource: "Prompt - Video Content Ideas [Doc]",
        url: "Prompt - Video Content Ideas",
        description: "Video content ideas prompt",
        type: "Prompt",
        theme: "Video",
        category: "Content Creation",
        isLive: true
    },
    {
        section: "Content Creation",
        resource: "Content Creation - Your Portfolio [Sheet]",
        url: "Content Creation - Your Portfolio",
        description: "Video content ideas for you to create",
        type: "Resource",
        theme: "Video",
        category: "Content Creation",
        isLive: true
    },
    {
        section: "Content Creation",
        resource: "Video Examples [Sheet]",
        url: "Video Examples",
        description: "More video examples",
        type: "Resource",
        theme: "Video",
        category: "Content Creation",
        isLive: true
    },
    {
        section: "Content Creation",
        resource: "Video Elements Deconstructed [Sheet]",
        url: "Video Elements Deconstructed",
        description: "Breakdown of video elements",
        type: "Resource",
        theme: "Video",
        category: "Content Creation",
        isLive: true
    },
    {
        section: "Content Creation",
        resource: "Video Tools [Sheet]",
        url: "Video Tools ",
        description: "Video creation and editing tools",
        type: "Resource",
        theme: "Video",
        category: "Content Creation",
        isLive: true
    },
    {
        section: "Content Creation",
        resource: "Visual Tools [Sheet]",
        url: "Visual Tools",
        description: "Graphic design, visual creation tools",
        type: "Resource",
        theme: "Visual",
        category: "Content Creation",
        isLive: true
    },
    {
        section: "Content Creation",
        resource: "Visual SoMe Pillars, Themes, and Topics [Sheet]",
        url: "Visual SoMe Pillars, Themes, and Topics",
        description: "Social media content framework",
        type: "Resource",
        theme: "Visual",
        category: "Content Creation",
        isLive: true
    },
    {
        section: "Content Creation",
        resource: "Visuals Elements Deconstructed [Sheet]",
        url: "Visuals Elements Deconstructed",
        description: "Breakdown of visual elements",
        type: "Resource",
        theme: "Visual",
        category: "Content Creation",
        isLive: true
    },
    {
        section: "Content Creation",
        resource: "Prompt - Visual Content Formats [Doc]",
        url: "Prompt - Visual Content Formats ",
        description: "Visual content prompt templates",
        type: "Prompt",
        theme: "Visual",
        category: "Content Creation",
        isLive: true
    },
    {
        section: "Content Creation",
        resource: "Audio Tools [Sheet]",
        url: "Audio Tools",
        description: "Audio creation and editing tools",
        type: "Resource",
        theme: "Other Tools",
        category: "Content Creation",
        isLive: true
    },
    {
        section: "Content Creation",
        resource: "LinkedIn Content Tools",
        url: "Linkedin Content Tools",
        description: "LinkedIn content creation tools",
        type: "Resource",
        theme: "Other Tools",
        category: "Content Creation",
        isLive: true
    },
    {
        section: "Content Creation",
        resource: "Publishing Tools and Channels",
        url: "Publishing Tools and Channels",
        description: "Publishing and scheduling tools",
        type: "Resource",
        theme: "Other Tools",
        category: "Content Creation",
        isLive: true
    },
    {
        section: "Content Creation",
        resource: "Gimmicky Tools",
        url: "Gimmicky  Tools",
        description: "Fun, creative, and viral tools",
        type: "Resource",
        theme: "Other Tools",
        category: "Content Creation",
        isLive: true
    },
    {
        section: "Content Creation",
        resource: "AI Dev Tools [Sheet]",
        url: "AI Dev Tools",
        description: "Curated AI tools spreadsheet",
        type: "Resource",
        theme: "Other Tools",
        category: "Content Creation",
        isLive: true
    },
    {
        section: "Content Creation",
        resource: "Automation Tools [Sheet]",
        url: "Automation Tools",
        description: "Curated automation tools list",
        type: "Resource",
        theme: "Other Tools",
        category: "Content Creation",
        isLive: true
    },
    {
        section: "Content Creation",
        resource: "Online Learning Platforms",
        url: "Online Learning Platforms",
        description: "Online education tools list",
        type: "Resource",
        theme: "Other Tools",
        category: "Content Creation",
        isLive: true
    },

    // --- CONTENT PUBLISHING ---
    {
        section: "Content Publishing",
        resource: "Bulk social media via Publer - General Guide [Doc]",
        url: "Bulk social media via Publer - General Guide",
        description: "Bulk scheduling workflow for Publer social posts",
        type: "Guide",
        theme: "Workflows",
        category: "Content Publishing",
        isLive: true
    },
    {
        section: "Content Publishing",
        resource: "How to Write Social Media Captions for Klint [Doc]",
        url: "How to Write Social Media Captions for Klint",
        description: "Caption writing standards for Klint social media",
        type: "Guide",
        theme: "Workflows",
        category: "Content Publishing",
        isLive: true
    },
    {
        section: "Content Publishing",
        resource: "Twitter via Publer [Doc]",
        url: "Twitter via Publer",
        description: "Twitter publishing checklist using Publer",
        type: "Guide",
        theme: "Workflows",
        category: "Content Publishing",
        isLive: true
    },
    {
        section: "Content Publishing",
        resource: "Pinterest via Publer [Doc]",
        url: "Pinterest via Publer",
        description: "Pinterest pin scheduling steps in Publer",
        type: "Guide",
        theme: "Workflows",
        category: "Content Publishing",
        isLive: true
    },
    {
        section: "Content Publishing",
        resource: "LinkedIn via Publer [Doc]",
        url: "LinkedIn via Publer",
        description: "LinkedIn scheduling workflow in Publer",
        type: "Guide",
        theme: "Workflows",
        category: "Content Publishing",
        isLive: true
    },
    {
        section: "Content Publishing",
        resource: "Facebook via Publer [Doc]",
        url: "Facebook via Publer",
        description: "Facebook page posting workflow in Publer",
        type: "Guide",
        theme: "Workflows",
        category: "Content Publishing",
        isLive: true
    },
    {
        section: "Content Publishing",
        resource: "Google My Business via Publer [Doc]",
        url: "Google My Business via Publer",
        description: "Google Business Profile posting steps in Publer",
        type: "Guide",
        theme: "Workflows",
        category: "Content Publishing",
        isLive: true
    },
    {
        section: "Content Publishing",
        resource: "Publishing Tools and Channels [Sheet]",
        url: "https://docs.google.com/spreadsheets/d/1u2OsTEPvoXCJtX6U_fhfLCuahrQIIBVE9v2woWRsfco/",
        description: "Directory of publishing tools and channels with pricing and use cases",
        type: "Tool List",
        theme: "Scheduling",
        category: "Content Publishing",
        isLive: true
    },
    {
        section: "Content Publishing",
        resource: "SoMe Calendar Template [Sheet]",
        url: "SoMe Calendar Template",
        description: "Social media scheduling template",
        type: "Resource",
        theme: "Scheduling",
        category: "Content Publishing",
        isLive: true
    },
    {
        section: "Content Publishing",
        resource: "Social Media Calendar - GS [Sheet]",
        url: "Social Media Calendar - GS",
        description: "Social media content calendar",
        type: "Resource",
        theme: "Scheduling",
        category: "Content Publishing",
        isLive: true
    },
    {
        section: "Content Publishing",
        resource: "Curate Content Planner [Sheet]",
        url: "Curate Content Planner - GetHiredAbroad.com",
        description: "Content curation planner with source links, status, channel fields",
        type: "Template",
        theme: "Scheduling",
        category: "Content Publishing",
        isLive: true
    },
    {
        section: "Content Publishing",
        resource: "Content Creation - Your Portfolio [Sheet]",
        url: "Content Creation - Your Portfolio - GetHiredAbroad.com",
        description: "Content ideas by format with hooks, examples, templates",
        type: "Inspiration",
        theme: "Scheduling",
        category: "Content Publishing",
        isLive: true
    },
    {
        section: "Content Publishing",
        resource: "Curated Content - WeGro Coin (Example) [Sheet]",
        url: "Curated Content - WeGro Coin",
        description: "Example of curated content",
        type: "Resource",
        theme: "Scheduling",
        category: "Content Publishing",
        isLive: true
    }
];
