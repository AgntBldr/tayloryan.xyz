const fs = require('fs');
const path = require('path');

const dataExtractPath = 'data_extract.json';
const targetPath = 'assets/js/marketing_full_data.js';

function slugify(text) {
    if (!text) return '';
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

function transformItem(item, category, sourceFile) {
    if (!item.Resource || item.Resource === 'Name' || item.Resource === 'Resource') return null;

    // Map fields
    const title = item.Resource;
    const id = slugify(title);

    // Determine Type
    let type = item.Type || item['Type (Doc)'] || item['Type.1'] || 'Resource';

    // Determine Tags
    let tags = [];
    if (item.Notes) {
        tags = item.Notes.split(',').map(t => t.trim()).filter(t => t);
    }

    // Determine URL
    let url = item.URL;
    if (url && url.includes('{{')) url = '#'; // Placeholder

    return {
        id: id,
        category: category,
        title: title,
        description: item.Description || '',
        url: url,
        type: type,
        format_inferred: item['Format'] || 'Resource', // Simple fallback
        status: 'Active',
        owner: 'Marketing',
        difficulty: item['Expertise to Use'] || 'Beginner',
        cost: item.Pricing || 'Free',
        access: item.Freemium || 'Full Access',
        region: item.Region || 'Global',
        goals: item['Use cases'] || '',
        tags: tags,
        section: item.Section || 'Strategy', // Default section
        source_file: sourceFile
    };
}

try {
    // Read Data
    const rawData = fs.readFileSync(dataExtractPath, 'utf8');
    const extractedData = JSON.parse(rawData);

    // Read Existing File
    let fileContent = fs.readFileSync(targetPath, 'utf8');

    // Extract format
    const startMatch = fileContent.match(/window\.MARKETING_FULL_DATA\s*=\s*\[/);
    if (!startMatch) {
        throw new Error('Could not find array start in target file');
    }

    // Parse existing JSON
    // We need to be careful with parsing JS file as JSON. 
    // Best approach: Extract the array part string, try to parse it. 
    // But since we are appending, we can just insert before the closing bracket.
    // However, we want to avoid duplicates.

    let existingData = [];
    const jsonStrMatch = fileContent.match(/window\.MARKETING_FULL_DATA\s*=\s*(\[[\s\S]*?\]);/);
    if (jsonStrMatch) {
        try {
            existingData = JSON.parse(jsonStrMatch[1]);
        } catch (e) {
            console.log("Could not parse existing data as JSON, proceeding with append mode.");
        }
    }

    const newItems = [];
    const existingIds = new Set(existingData.map(i => i.id));

    // Process Testimonials
    if (extractedData.Testimonials) {
        extractedData.Testimonials.forEach(item => {
            const transformed = transformItem(item, 'Testimonials', 'Testimonial Creation');
            if (transformed && !existingIds.has(transformed.id)) {
                newItems.push(transformed);
                existingIds.add(transformed.id);
            }
        });
    }

    // Process Content Creator
    if (extractedData.ContentCreator) {
        extractedData.ContentCreator.forEach(item => {
            const transformed = transformItem(item, 'Content Creator', 'Content Creator Program');
            // Override Section for shared resources
            if (transformed) {
                if (transformed.title.includes('Shared')) transformed.section = 'Shared Resources';

                if (!existingIds.has(transformed.id)) {
                    newItems.push(transformed);
                    existingIds.add(transformed.id);
                }
            }
        });
    }

    console.log(`Adding ${newItems.length} new items.`);

    if (newItems.length > 0) {
        // Construct new JS file content
        // We can reconstruct the whole array to ensure validity
        const finalData = [...newItems, ...existingData]; // Put new items on top? Or bottom. User asked to "Ingest", no preference. Top is easier to see.

        const newFileContent = `window.MARKETING_FULL_DATA = ${JSON.stringify(finalData, null, 2)};`;
        fs.writeFileSync(targetPath, newFileContent);
        console.log('Successfully updated marketing_full_data.js');
    } else {
        console.log('No new items to add.');
    }

} catch (error) {
    console.error('Error:', error);
    process.exit(1);
}
