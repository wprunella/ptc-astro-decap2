import { promises as fs } from 'fs';
import path from 'path';

// --- CONFIGURATION ---
// 🚨 IMPORTANT: Replace with your actual Gemini API Key
const API_KEY = "AIzaSyAXCNlbjfrPEVE-98EpGvcgwq-st5wdjr0"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'content', 'locations');

// ----------------------------------------------------
// STEP 1: INPUT DATA - Miami Market Master List (13 Locations)
// ----------------------------------------------------
const locationsToGenerate = [
    { city: "Miami", state: "FL", slug: "miami-fl", type: "major_city", parent_slug: "", zip_codes: ["33130", "33131", "33137"], meta_title: "Top Personal Trainers in Miami FL | Find a Fitness Coach", meta_description: "Connect with certified personal trainers across Miami, specializing in aesthetic fitness, high-rise wellness, and tropical lifestyle training." },
    
    // Neighborhoods
    { city: "South Beach", state: "FL", slug: "south-beach-fl", type: "neighborhood", parent_slug: "miami-fl", zip_codes: ["33139", "33141"], meta_title: "Personal Trainers in South Beach Miami | Oceanfront Workouts", meta_description: "Find elite personal trainers in South Beach. Experts in beach body fitness, high-intensity training, and luxury condo gym access." },
    { city: "Brickell", state: "FL", slug: "brickell-fl", type: "neighborhood", parent_slug: "miami-fl", zip_codes: ["33129", "33131"], meta_title: "Personal Trainers in Brickell Miami | Corporate & High-Rise Fitness", meta_description: "Connect with certified trainers in Miami's financial district. Corporate wellness, stress reduction, and luxury high-rise gym experts." },
    { city: "Coconut Grove", state: "FL", slug: "coconut-grove-fl", type: "neighborhood", parent_slug: "miami-fl", zip_codes: ["33133"], meta_title: "Personal Trainers in Coconut Grove Miami | Historic & Waterfront Fitness", meta_description: "Find fitness coaches in Coconut Grove. Training focused on historic estates, bayfront running, and community wellness centers." },
    { city: "Coral Gables", state: "FL", slug: "coral-gables-fl", type: "neighborhood", parent_slug: "miami-fl", zip_codes: ["33134", "33146"], meta_title: "Personal Trainers in Coral Gables FL | University & Luxury Wellness", meta_description: "Connect with certified trainers in Coral Gables. Academic schedule coordination, historic properties, and high-end residential fitness." },
    { city: "Key Biscayne", state: "FL", slug: "key-biscayne-fl", type: "neighborhood", parent_slug: "miami-fl", zip_codes: ["33149"], meta_title: "Personal Trainers in Key Biscayne Miami | Island & Waterfront Training", meta_description: "Find elite personal trainers in Key Biscayne. Island lifestyle fitness, ocean sports conditioning, and exclusive residential gym access." },
    
    // Suburbs
    { city: "Fort Lauderdale", state: "FL", slug: "fort-lauderdale-fl", type: "suburb", parent_slug: "miami-fl", zip_codes: ["33301", "33304"], meta_title: "Personal Trainers in Fort Lauderdale FL | Yachting & Beach Lifestyle Fitness", meta_description: "Connect with certified trainers in Fort Lauderdale. Specialists in marine fitness, beachfront workouts, and luxury residential training." },
    { city: "Palm Beach", state: "FL", slug: "palm-beach-fl", type: "suburb", parent_slug: "miami-fl", zip_codes: ["33480"], meta_title: "Personal Trainers in Palm Beach FL | Exclusive Estate & Club Fitness", meta_description: "Find elite personal trainers in Palm Beach. Coaching for private estates, country clubs, and high-profile client discretion." },
    { city: "Boca Raton", state: "FL", slug: "boca-raton-fl", type: "suburb", parent_slug: "miami-fl", zip_codes: ["33431", "33434"], meta_title: "Personal Trainers in Boca Raton FL | Luxury Community Fitness", meta_description: "Connect with certified trainers in Boca Raton. Experts in gated community access, family fitness, and prestigious private club training." },
    { city: "Aventura", state: "FL", slug: "aventura-fl", type: "suburb", parent_slug: "miami-fl", zip_codes: ["33180"], meta_title: "Personal Trainers in Aventura FL | High-Rise & Retail District Fitness", meta_description: "Find fitness coaches in Aventura. Training focused on high-rise residential amenities, international clients, and luxury shopping area wellness." },
    { city: "Pinecrest", state: "FL", slug: "pinecrest-fl", type: "suburb", parent_slug: "miami-fl", zip_codes: ["33156"], meta_title: "Personal Trainers in Pinecrest FL | Family Estate Wellness", meta_description: "Connect with certified trainers in Pinecrest. Specialists in private home gym design, multi-generational family fitness, and large property training." },
    { city: "Hallandale Beach", state: "FL", slug: "hallandale-beach-fl", type: "suburb", parent_slug: "miami-fl", zip_codes: ["33009"], meta_title: "Personal Trainers in Hallandale Beach FL | Coastal Retirement & Wellness", meta_description: "Find certified trainers in Hallandale Beach. Coaching focused on longevity, senior fitness, and oceanfront walking/low-impact routines." },
    { city: "Southwest Ranches", state: "FL", slug: "southwest-ranches-fl", type: "suburb", parent_slug: "miami-fl", zip_codes: ["33330", "33331"], meta_title: "Personal Trainers in Southwest Ranches FL | Equestrian & Rural Fitness", meta_description: "Connect with trainers in Southwest Ranches. Experts in farm/equestrian fitness, large home gym integration, and personalized country living wellness." },
];

// ----------------------------------------------------
// STEP 2: AI PROMPT TEMPLATE (Structured for Authority)
// ----------------------------------------------------
const systemInstruction = `
You are an expert SEO Content Architect. Your task is to generate four distinct content segments for a personal trainer matching service in a specific location.

Output MUST be a single JSON object with the following four keys. All content must be grammatically perfect and hyper-local:
1.  **brief_description:** A concise, **60-80 word paragraph** focused on conversion and high-intent keywords.
2.  **local_culture_segment:** A 250-350 word section detailing the city's unique fitness culture, major parks/landmarks, and seasonal challenges (e.g., tropical humidity, international events, beach focus). Must use H2 and H3 headings.
3.  **training_environment_segment:** A 300-400 word section covering local gym types, private training options, and popular outdoor workout spots (e.g., high-rise gyms, beach, marinas, country clubs). Must use H2 and H3 headings.
4.  **specialized_programs_segment:** A 200-250 word section listing specialized training programs for the local demographic (e.g., aesthetic fitness, hospitality workers, frequent international travelers). Must use H2 and H3 headings.

Total word count for the three body segments (2, 3, and 4) must exceed 750 words.
Do NOT use any H1 tags (#) in the output. Use H2 (##) or H3 (###) only.
`;

// This function calls the Gemini API to get the unique structured content
async function generateUniqueContent(location) {
    const locationType = location.type === 'major_city' ? 'Miami Metropolitan Hub' : (location.type === 'suburb' ? 'Premium Coastal Suburb' : 'International Neighborhood');
    
    const userQuery = `
    Generate the structured content for the ${locationType} of ${location.city}, ${location.state}. 
    Focus the content on South Florida's specific demographic (Aesthetics, International travel, Luxury amenities) and the tropical lifestyle of this ${locationType}.
    The final output must be ONLY the required JSON object.
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
        
        // CRITICAL: Clean the JSON string before parsing
        let jsonText = result.candidates?.[0]?.content?.parts?.[0]?.text.trim();
        jsonText = jsonText.replace(/```json|```/g, '').trim(); 
        
        return JSON.parse(jsonText); 

    } catch (error) {
        console.error(`Fetch/Parsing Error for ${location.city}:`, error.message);
        return { brief_description: `ERROR: Data generation failed for ${location.city}`, full_body_content: `Placeholder content due to processing error.` };
    }
}

// ----------------------------------------------------
// STEP 3: FILE WRITING LOGIC
// ----------------------------------------------------
async function generateFiles() {
    if (API_KEY === "YOUR_GEMINI_API_KEY" || API_KEY === "") {
        console.error("\nFATAL ERROR: Please set your Gemini API Key in the script before running.\n");
        return;
    }
    
    await fs.mkdir(OUTPUT_DIR, { recursive: true });

    console.log(`\nStarting generation of ${locationsToGenerate.length} Miami market files...`);

    for (const location of locationsToGenerate) {
        process.stdout.write(`Generating structured content for ${location.city}, ${location.state}...`);
        
        const generatedContent = await generateUniqueContent(location);
        
        // 1. Construct the YAML Frontmatter (Using brief_description)
        const escapedBriefDescription = generatedContent.brief_description.replace(/"/g, '\\"');

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
brief_description: "${escapedBriefDescription}"
---`;

        // 2. Combine Body Sections for the Final Article (Full Pillar Content)
        // This creates a single Markdown body of ~750+ words
        const fullBodyArticle = [
            generatedContent.local_culture_segment,
            generatedContent.training_environment_segment,
            generatedContent.specialized_programs_segment,
        ].join('\n\n---\n\n'); 

        // 3. Write File
        const fileContent = frontmatter + '\n' + fullBodyArticle;
        
        const filename = path.join(OUTPUT_DIR, `${location.slug}.md`);

        await fs.writeFile(filename, fileContent, 'utf-8');
        console.log(` ✅ Done. Written to ${filename}`);
    }
    console.log('\n✨ Miami market generation complete! Commit new files to Git.\n');
}

generateFiles();
