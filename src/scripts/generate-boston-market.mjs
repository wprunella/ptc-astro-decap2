import { promises as fs } from 'fs';
import path from 'path';

// --- CONFIGURATION ---
// 🚨 IMPORTANT: INSERT YOUR API KEY HERE 
const API_KEY = "AIzaSyAXCNlbjfrPEVE-98EpGvcgwq-st5wdjr0"; // <-- YOUR KEY IS INSERTED HERE
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'content', 'locations');

// ----------------------------------------------------
// STEP 1: INPUT DATA - Boston Market Master List (23 Locations)
// ----------------------------------------------------
const locationsToGenerate = [
    {
        city: "Boston", state: "MA", slug: "boston-ma", type: "major_city", parent_slug: "", 
        zip_codes: ["02108", "02116", "02210"], 
        meta_title: "Top Personal Trainers in Boston MA | Find a Fitness Coach",
        meta_description: "Connect with certified personal trainers across Boston and the metro area. Specialists in corporate wellness, strength, and marathon training."
    },
    // Neighborhoods
    {
        city: "Back Bay", state: "MA", slug: "back-bay-ma", type: "neighborhood", parent_slug: "boston-ma", 
        zip_codes: ["02116", "02199"],
        meta_title: "Personal Trainers in Back Bay Boston | Luxury Fitness Coaching",
        meta_description: "Find elite personal trainers in Back Bay. Fitness experts near Newbury Street, the Esplanade, and high-end residential gyms."
    },
    {
        city: "South End", state: "MA", slug: "south-end-ma", type: "neighborhood", parent_slug: "boston-ma", 
        zip_codes: ["02118"],
        meta_title: "Personal Trainers in South End Boston | Boutique Wellness Experts",
        meta_description: "Connect with wellness coaches in Boston's South End. Experts in boutique studio fitness, yoga, and functional strength training near SOWA."
    },
    {
        city: "Beacon Hill", state: "MA", slug: "beacon-hill-ma", type: "neighborhood", parent_slug: "boston-ma", 
        zip_codes: ["02108"],
        meta_title: "Personal Trainers in Beacon Hill Boston | Historic District Wellness",
        meta_description: "Find discreet, high-quality personal trainers in Beacon Hill. Coaching in private home gyms and historic community centers."
    },
    {
        city: "Seaport", state: "MA", slug: "seaport-ma", type: "neighborhood", parent_slug: "boston-ma", 
        zip_codes: ["02210", "02127"],
        meta_title: "Personal Trainers in Seaport Boston | Corporate & High-Rise Fitness",
        meta_description: "Connect with certified trainers in Boston's Seaport district. Experts in corporate fitness, high-rise gym amenities, and waterfront running programs."
    },
    {
        city: "North End", state: "MA", slug: "north-end-ma", type: "neighborhood", parent_slug: "boston-ma", 
        zip_codes: ["02113"],
        meta_title: "Personal Trainers in North End Boston | Urban Lifestyle Fitness",
        meta_description: "Find personal trainers in the North End. Specialized coaching for urban living, functional strength, and maximizing small home gym spaces."
    },
    {
        city: "Charlestown", state: "MA", slug: "charlestown-ma", type: "neighborhood", parent_slug: "boston-ma", 
        zip_codes: ["02129"],
        meta_title: "Personal Trainers in Charlestown Boston | Historic Community Fitness",
        meta_description: "Connect with certified trainers in Charlestown. Coaching near the Bunker Hill Monument and experts in historic property fitness solutions."
    },
    {
        city: "South Boston", state: "MA", slug: "south-boston-ma", type: "neighborhood", parent_slug: "boston-ma", 
        zip_codes: ["02127"],
        meta_title: "Personal Trainers in South Boston | Beach & Community Workouts",
        meta_description: "Find fitness coaches in South Boston. Specialized training near Castle Island, M Street Beach, and local community recreation centers."
    },
    {
        city: "Fenway-Kenmore", state: "MA", slug: "fenway-kenmore-ma", type: "neighborhood", parent_slug: "boston-ma", 
        zip_codes: ["02215"],
        meta_title: "Personal Trainers in Fenway/Kenmore Boston | Student & Medical Fitness",
        meta_description: "Connect with trainers near Fenway Park and the Longwood Medical Area. Experts in student fitness, late-night hours, and university gym training."
    },
    // 🔥 NEW ENTRY: Allston/Brighton
    {
        city: "Allston-Brighton", state: "MA", slug: "allston-brighton-ma", type: "neighborhood", parent_slug: "boston-ma", 
        zip_codes: ["02134", "02135"],
        meta_title: "Personal Trainers in Allston-Brighton Boston | Student & Young Professional Fitness",
        meta_description: "Find certified trainers in Allston-Brighton. Coaching for young professionals and students, specializing in functional strength and high-intensity workouts."
    },
    // Suburbs
    {
        city: "Cambridge", state: "MA", slug: "cambridge-ma", type: "suburb", parent_slug: "boston-ma", 
        zip_codes: ["02138", "02142"],
        meta_title: "Personal Trainers in Cambridge MA | Harvard & MIT Area Fitness",
        meta_description: "Connect with trainers in Cambridge. Experts near Harvard and MIT, focusing on academic and corporate stress reduction through fitness."
    },
    {
        city: "Newton", state: "MA", slug: "newton-ma", type: "suburb", parent_slug: "boston-ma", 
        zip_codes: ["02459", "02460"],
        meta_title: "Personal Trainers in Newton MA | Family & Commuter Fitness",
        meta_description: "Find certified personal trainers in Newton. Coaching for busy families and professionals, specializing in home and private club training."
    },
    {
        city: "Wellesley", state: "MA", slug: "wellesley-ma", type: "suburb", parent_slug: "boston-ma", 
        zip_codes: ["02481", "02482"],
        meta_title: "Personal Trainers in Wellesley MA | Upscale Home & Club Training",
        meta_description: "Connect with elite personal trainers in Wellesley. Experts in high-end home gyms and prestigious local athletic club training."
    },
    {
        city: "Lexington", state: "MA", slug: "lexington-ma", type: "suburb", parent_slug: "boston-ma", 
        zip_codes: ["02420", "02421"],
        meta_title: "Personal Trainers in Lexington MA | Historic Community Fitness",
        meta_description: "Find certified trainers in Lexington. Coaching focused on endurance, functional fitness, and historic community sports fields."
    },
    {
        city: "Concord", state: "MA", slug: "concord-ma", type: "suburb", parent_slug: "boston-ma", 
        zip_codes: ["01742"],
        meta_title: "Personal Trainers in Concord MA | Literary & Outdoor Fitness",
        meta_description: "Connect with fitness coaches in Concord. Training utilizing the area's extensive trails, natural parks, and private home gyms."
    },
    {
        city: "Needham", state: "MA", slug: "needham-ma", type: "suburb", parent_slug: "boston-ma", 
        zip_codes: ["02492", "02494"],
        meta_title: "Personal Trainers in Needham MA | Commuter Wellness & Family Fitness",
        meta_description: "Find certified personal trainers in Needham. Specialized training programs for commuters, stress management, and local fitness centers."
    },
    {
        city: "Brookline", state: "MA", slug: "brookline-ma", type: "suburb", parent_slug: "boston-ma", 
        zip_codes: ["02445", "02446"],
        meta_title: "Personal Trainers in Brookline MA | Urban Suburban Wellness",
        meta_description: "Connect with trainers in Brookline. Experts in urban-suburban fitness, maximizing green spaces, and private health club training."
    },
    {
        city: "Medford", state: "MA", slug: "medford-ma", type: "suburb", parent_slug: "boston-ma", 
        zip_codes: ["02153", "02155"],
        meta_title: "Personal Trainers in Medford MA | Tufts & Community Fitness",
        meta_description: "Find certified personal trainers in Medford. Coaching near Tufts University, emphasizing community recreation and functional fitness."
    },
    // 🔥 NEW ENTRY: Somerville
    {
        city: "Somerville", state: "MA", slug: "somerville-ma", type: "suburb", parent_slug: "boston-ma", 
        zip_codes: ["02143", "02144", "02145"],
        meta_title: "Personal Trainers in Somerville MA | Young Professional & Urban Fitness",
        meta_description: "Connect with fitness experts in Somerville. Training focused on functional strength, high-intensity workouts, and maximizing urban spaces."
    },
    // 🔥 NEW ENTRY: Waltham
    {
        city: "Waltham", state: "MA", slug: "waltham-ma", type: "suburb", parent_slug: "boston-ma", 
        zip_codes: ["02451", "02452", "02453"],
        meta_title: "Personal Trainers in Waltham MA | Technology Sector Fitness & Commuter Wellness",
        meta_description: "Find certified trainers in Waltham. Coaching for the technology sector, focusing on corporate stress reduction and accessible gym training."
    },
    // 🔥 NEW ENTRY: Weston
    {
        city: "Weston", state: "MA", slug: "weston-ma", type: "suburb", parent_slug: "boston-ma", 
        zip_codes: ["02493"],
        meta_title: "Personal Trainers in Weston MA | Luxury Home & Estate Fitness",
        meta_description: "Connect with elite personal trainers in Weston. Experts in private home gyms, expansive property training, and exclusive club access."
    },
    // 🔥 NEW ENTRY: Winchester
    {
        city: "Winchester", state: "MA", slug: "winchester-ma", type: "suburb", parent_slug: "boston-ma", 
        zip_codes: ["01890"],
        meta_title: "Personal Trainers in Winchester MA | Family Wellness & Community Sports",
        meta_description: "Find certified trainers in Winchester. Coaching focused on family health, community sports performance, and local recreation centers."
    },
];

// ----------------------------------------------------
// STEP 2: AI PROMPT TEMPLATE (Now requests two distinct content pieces)
// ----------------------------------------------------
const systemInstruction = `
You are an expert SEO Content Architect. Your task is to generate two distinct, high-quality Markdown content pieces for a personal trainer matching service in a specific location:
1.  **brief_description:** A concise, 30-word summary used on coupled pages.
2.  **full_body_content:** A long, detailed, hyper-local article (min 220 words, maximum 300 words) for the location pillar page.

Output MUST be returned as a single JSON object with two keys: "brief_description" and "full_body_content".
The content MUST be hyper-local, use the city's context, and reference local landmarks/fitness cultures.

// 🔥 CRITICAL FIX: Ensure no H1 tags are created in the body content.
// All section headings within the content must use H2 (##) or H3 (###).
The output content MUST NOT start with a single '#' (H1 tag).

Use Markdown formatting (H2 and H3 headings, paragraphs, bolding, lists) in the body content.
`;

// This function calls the Gemini API to get the unique content
async function generateUniqueContent(location) {
    const locationType = location.type === 'major_city' ? 'Boston' : (location.type === 'suburb' ? 'suburb' : 'neighborhood');
    
    const userQuery = `
    Generate a concise 30-word brief description and a 250-word detailed article for ${location.city}, ${location.state}. 
    Focus the brief description on high-intent keywords for fitness coaching/personal training. 
    Focus the detailed article on unique local landmarks and recognized fitness cultures (e.g., Boston Common, hockey, football, yoga).
    The final output must be a single JSON object with keys: "brief_description" and "full_body_content".
    `;

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            console.error(`API Error for ${location.city}: ${response.statusText}`);
            return { brief_description: `ERROR: Failed to generate content for ${location.city}`, full_body_content: `Placeholder content due to API failure.` };
        }
        
        const result = await response.json();
        
        // CRITICAL: Parse the AI's JSON output
        let jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text.trim();
        
        // This removes the Markdown code fences (```json or ```) and trims whitespace
        jsonText = jsonText.replace(/```json|```/g, '').trim(); 
        
        const content = JSON.parse(jsonText); 
        
        return content; // Returns { brief_description: '...', full_body_content: '...' }

    } catch (error) {
        console.error(`Fetch/Parsing Error for ${location.city}:`, error.message);
        return { brief_description: `ERROR: Data generation failed for ${location.city}`, full_body_content: `Placeholder content due to processing error.` };
    }
}

// ----------------------------------------------------
// STEP 3: FILE WRITING LOGIC (Updated to use new fields)
// ----------------------------------------------------
async function generateFiles() {
    if (API_KEY === "") {
        console.error("\nFATAL ERROR: Please set your Gemini API Key in the script before running.\n");
        return;
    }
    
    // ... (Directory setup logic remains here) ...
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    console.log(`\nStarting generation of ${locationsToGenerate.length} Boston market files...`);

    for (const location of locationsToGenerate) {
        process.stdout.write(`Generating content for ${location.city}, ${location.state}...`);
        
        // 💥 NEW: Generate both content pieces
        const generatedContent = await generateUniqueContent(location);
        
        // 1. Construct the YAML Frontmatter (Added brief_description field)
        const frontmatter = `---
city: "${location.city}"
state: "${location.state}"
slug: "${location.slug}"
type: "${location.type}"
parent_slug: "${location.parent_slug || ''}"
hero_image: "/assets/images/${location.slug}-hero.jpg"
zip_codes: [${location.zip_codes.map(zc => `"${zc}"`).join(', ')}]
meta_title: "${location.meta_title}"
meta_description: "${location.meta_description}"
brief_description: "${generatedContent.brief_description.replace(/"/g, '\\"')}" 
---`;

        // 2. Combine Frontmatter and Body (Uses the long body content for the main file body)
        const fileContent = frontmatter + '\n' + generatedContent.full_body_content;
        
        // ... (File writing logic remains here) ...
        const filename = path.join(OUTPUT_DIR, `${location.slug}.md`);

        await fs.writeFile(filename, fileContent, 'utf-8');
        console.log(` ✅ Done. Written to ${filename}`);
    }
    console.log('\n✨ Boston market generation complete! Commit new files to Git.\n');
}

generateFiles();