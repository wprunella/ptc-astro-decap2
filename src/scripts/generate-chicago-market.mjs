import { promises as fs } from 'fs';
import path from 'path';

// --- CONFIGURATION ---
const API_KEY = "AIzaSyAXCNlbjfrPEVE-98EpGvcgwq-st5wdjr0"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'content', 'locations');

// ----------------------------------------------------
// STEP 1: INPUT DATA - Chicago Market Master List (33 Locations)
// ----------------------------------------------------
const locationsToGenerate = [
    { city: "Chicago", state: "IL", slug: "chicago-il", type: "major_city", parent_slug: "", zip_codes: ["60601", "60610", "60611", "60654"], meta_title: "Top Personal Trainers in Chicago IL | Find a Fitness Coach", meta_description: "Connect with certified personal trainers across Chicago, specializing in corporate fitness, strength, and lakefront running programs." },
    // Neighborhoods (IL)
    { city: "Andersonville", state: "IL", slug: "andersonville-il", type: "neighborhood", parent_slug: "chicago-il", zip_codes: ["60640"], meta_title: "Personal Trainers in Andersonville Chicago | Community & Functional Fitness", meta_description: "Find certified trainers in Andersonville. Coaching focused on functional strength, boutique studio fitness, and maximizing neighborhood gym spaces." },
    { city: "Bridgeport", state: "IL", slug: "bridgeport-il", type: "neighborhood", parent_slug: "chicago-il", zip_codes: ["60609", "60616"], meta_title: "Personal Trainers in Bridgeport Chicago | South Side Community Fitness", meta_description: "Connect with certified trainers in Bridgeport. Coaching specializing in community recreation centers and strength building." },
    { city: "Edgewater", state: "IL", slug: "edgewater-il", type: "neighborhood", parent_slug: "chicago-il", zip_codes: ["60660"], meta_title: "Personal Trainers in Edgewater Chicago | Lakefront Wellness", meta_description: "Find elite personal trainers in Edgewater. Fitness experts near the lakefront trails, running programs, and senior fitness." },
    { city: "Gold Coast", state: "IL", slug: "gold-coast-il", type: "neighborhood", parent_slug: "chicago-il", zip_codes: ["60611"], meta_title: "Personal Trainers in Gold Coast Chicago | Luxury High-Rise Fitness", meta_description: "Connect with certified trainers in Chicago's Gold Coast. Experts in luxury high-rise amenities, home gyms, and discreet fitness coaching." },
    { city: "Lakeview", state: "IL", slug: "lakeview-il", type: "neighborhood", parent_slug: "chicago-il", zip_codes: ["60657"], meta_title: "Personal Trainers in Lakeview Chicago | Young Professional Fitness", meta_description: "Find fitness coaches in Lakeview. Specialists in group fitness, functional training, and maximizing urban park workouts." },
    { city: "Lincoln Park", state: "IL", slug: "lincoln-park-il", type: "neighborhood", parent_slug: "chicago-il", zip_codes: ["60614"], meta_title: "Personal Trainers in Lincoln Park Chicago | Family & Performance Training", meta_description: "Connect with trainers in Lincoln Park. Coaching for young families, performance athletes, and training near Lincoln Park Zoo." },
    { city: "Lincoln Square", state: "IL", slug: "lincoln-square-il", type: "neighborhood", parent_slug: "chicago-il", zip_codes: ["60625"], meta_title: "Personal Trainers in Lincoln Square Chicago | Community & Lifestyle Fitness", meta_description: "Find certified trainers in Lincoln Square. Training focused on sustainable health, mobility, and community wellness centers." },
    { city: "Logan Square", state: "IL", slug: "logan-square-il", type: "neighborhood", parent_slug: "chicago-il", zip_codes: ["60647"], meta_title: "Personal Trainers in Logan Square Chicago | Creative & Urban Fitness", meta_description: "Connect with trainers in Logan Square. Experts in unique functional fitness, arts community wellness, and urban exercise solutions." },
    { city: "Old Town", state: "IL", slug: "old-town-il", type: "neighborhood", parent_slug: "chicago-il", zip_codes: ["60610"], meta_title: "Personal Trainers in Old Town Chicago | Historic Area Wellness", meta_description: "Find certified trainers in Old Town. Coaching focused on historic property amenities and training near Wells Street corridor." },
    { city: "Printers Row", state: "IL", slug: "printers-row-il", type: "neighborhood", parent_slug: "chicago-il", zip_codes: ["60605"], meta_title: "Personal Trainers in Printers Row Chicago | South Loop Corporate Fitness", meta_description: "Connect with trainers in Printers Row. Specialized corporate wellness, express workouts, and fitness solutions for the South Loop." },
    { city: "River North", state: "IL", slug: "river-north-il", type: "neighborhood", parent_slug: "chicago-il", zip_codes: ["60654"], meta_title: "Personal Trainers in River North Chicago | Art & High-End Fitness", meta_description: "Find elite personal trainers in River North. Experts in high-end gyms, art district wellness, and urban density training." },
    { city: "South Loop", state: "IL", slug: "south-loop-il", type: "neighborhood", parent_slug: "chicago-il", zip_codes: ["60605"], meta_title: "Personal Trainers in South Loop Chicago | Downtown Residential Fitness", meta_description: "Connect with trainers in the South Loop. Coaching focused on new high-rise amenities, museum campus running, and downtown living." },
    { city: "Streeterville", state: "IL", slug: "streeterville-il", type: "neighborhood", parent_slug: "chicago-il", zip_codes: ["60611"], meta_title: "Personal Trainers in Streeterville Chicago | Luxury & Tourist District Fitness", meta_description: "Find certified trainers in Streeterville. Experts near Navy Pier, luxury hotels, and Magnificent Mile area fitness solutions." },
    { city: "Ukrainian Village", state: "IL", slug: "ukrainian-village-il", type: "neighborhood", parent_slug: "chicago-il", zip_codes: ["60622"], meta_title: "Personal Trainers in Ukrainian Village Chicago | Historic & Boutique Fitness", meta_description: "Connect with trainers in Ukrainian Village. Coaching focused on boutique studios, historic architecture, and unique functional training." },
    { city: "West Loop", state: "IL", slug: "west-loop-il", type: "neighborhood", parent_slug: "chicago-il", zip_codes: ["60607"], meta_title: "Personal Trainers in West Loop Chicago | Tech & Culinary Fitness", meta_description: "Find elite personal trainers in West Loop. Specialists in corporate tech offices, Fulton Market training, and urban high-intensity routines." },
    { city: "Wicker Park", state: "IL", slug: "wicker-park-il", type: "neighborhood", parent_slug: "chicago-il", zip_codes: ["60622"], meta_title: "Personal Trainers in Wicker Park Chicago | Bohemian & Creative Fitness", meta_description: "Connect with trainers in Wicker Park. Coaching focused on unique home gyms, arts community wellness, and urban lifestyle training." },
    // Suburbs (IL)
    { city: "Barrington", state: "IL", slug: "barrington-il", type: "suburb", parent_slug: "chicago-il", zip_codes: ["60010"], meta_title: "Personal Trainers in Barrington IL | Northwest Suburban Fitness", meta_description: "Find certified trainers in Barrington. Coaching for family fitness, private home gyms, and local athletic club training in the northwest suburbs." },
    { city: "Deerfield", state: "IL", slug: "deerfield-il", type: "suburb", parent_slug: "chicago-il", zip_codes: ["60015"], meta_title: "Personal Trainers in Deerfield IL | North Shore Family Wellness", meta_description: "Connect with certified trainers in Deerfield. Specialists in family wellness, home gym design, and North Shore private club training." },
    { city: "Evanston", state: "IL", slug: "evanston-il", type: "suburb", parent_slug: "chicago-il", zip_codes: ["60201", "60202"], meta_title: "Personal Trainers in Evanston IL | University & North Shore Fitness", meta_description: "Find trainers in Evanston. Experts near Northwestern University, lakefront training, and specialized fitness for the North Shore community." },
    { city: "Glencoe", state: "IL", slug: "glencoe-il", type: "suburb", parent_slug: "chicago-il", zip_codes: ["60022"], meta_title: "Personal Trainers in Glencoe IL | Luxury North Shore Estate Fitness", meta_description: "Connect with elite personal trainers in Glencoe. Exclusive coaching for private home gyms, luxury estates, and North Shore athletic clubs." },
    { city: "Glenview", state: "IL", slug: "glenview-il", type: "suburb", parent_slug: "chicago-il", zip_codes: ["60025", "60026"], meta_title: "Personal Trainers in Glenview IL | Suburban Family & Commuter Fitness", meta_description: "Find certified trainers in Glenview. Coaching for family fitness, commuter schedules, and training at local park district facilities." },
    { city: "Highland Park", state: "IL", slug: "highland-park-il", type: "suburb", parent_slug: "chicago-il", zip_codes: ["60035"], meta_title: "Personal Trainers in Highland Park IL | North Shore Arts & Wellness", meta_description: "Connect with trainers in Highland Park. Specialists in arts community wellness, outdoor lakefront training, and high-end private gyms." },
    { city: "Hinsdale", state: "IL", slug: "hinsdale-il", type: "suburb", parent_slug: "chicago-il", zip_codes: ["60521", "60522"], meta_title: "Personal Trainers in Hinsdale IL | Western Suburbs Luxury Fitness", meta_description: "Find elite personal trainers in Hinsdale. Coaching for family wellness, home gym design, and prestigious Western Suburbs athletic clubs." },
    { city: "Kenilworth", state: "IL", slug: "kenilworth-il", type: "suburb", parent_slug: "chicago-il", zip_codes: ["60043"], meta_title: "Personal Trainers in Kenilworth IL | Exclusive North Shore Fitness", meta_description: "Connect with elite trainers in Kenilworth. Exclusive coaching for luxury properties and discreet, high-quality home gym training." },
    { city: "Lake Forest", state: "IL", slug: "lake-forest-il", type: "suburb", parent_slug: "chicago-il", zip_codes: ["60045"], meta_title: "Personal Trainers in Lake Forest IL | North Shore Estate Wellness", meta_description: "Find certified trainers in Lake Forest. Specialists in expansive estate gyms, private club access, and North Shore luxury fitness." },
    { city: "Naperville", state: "IL", slug: "naperville-il", type: "suburb", parent_slug: "chicago-il", zip_codes: ["60540", "60563"], meta_title: "Personal Trainers in Naperville IL | Western Suburbs Family Fitness", meta_description: "Connect with trainers in Naperville. Coaching for active families, commuter schedules, and training at large suburban fitness centers." },
    { city: "Oak Park", state: "IL", slug: "oak-park-il", type: "suburb", parent_slug: "chicago-il", zip_codes: ["60301", "60302"], meta_title: "Personal Trainers in Oak Park IL | Historic Community Fitness", meta_description: "Find certified trainers in Oak Park. Coaching focused on historic home amenities, community recreation centers, and urban suburban wellness." },
    { city: "Western Springs", state: "IL", slug: "western-springs-il", type: "suburb", parent_slug: "chicago-il", zip_codes: ["60558"], meta_title: "Personal Trainers in Western Springs IL | Family Commuter Wellness", meta_description: "Connect with certified trainers in Western Springs. Specialists in family fitness, commuter schedules, and local park district programs." },
    { city: "Wilmette", state: "IL", slug: "wilmette-il", type: "suburb", parent_slug: "chicago-il", zip_codes: ["60091"], meta_title: "Personal Trainers in Wilmette IL | North Shore Family Fitness", meta_description: "Find trainers in Wilmette. Experts in family wellness, home gym design, and North Shore private club training." },
    { city: "Winnetka", state: "IL", slug: "winnetka-il", type: "suburb", parent_slug: "chicago-il", zip_codes: ["60093"], meta_title: "Personal Trainers in Winnetka IL | Elite North Shore Estate Fitness", meta_description: "Connect with elite personal trainers in Winnetka. Exclusive coaching for luxury homes, private clubs, and North Shore estate fitness." },
];

// ----------------------------------------------------
// STEP 2: AI PROMPT TEMPLATE
// ----------------------------------------------------
const systemInstruction = `
You are an expert SEO Content Architect. Your task is to generate two distinct, high-quality Markdown content pieces for a personal trainer matching service in a specific location.

Output MUST be a single JSON object with the following four keys. All content must be grammatically perfect and hyper-local:
1.  **brief_description:** A concise, **60-80 word paragraph** focused on conversion and high-intent keywords.
2.  **local_culture_segment:** A 250-350 word section detailing the city's unique fitness culture, major parks/landmarks, and seasonal challenges (e.g., Chicago Marathon, lakefront running). Must use H2 and H3 headings.
3.  **training_environment_segment:** A 300-400 word section covering local gym types, private training options, and popular outdoor workout spots (e.g., Equinox, Lakefront Trail, corporate facilities). Must use H2 and H3 headings.
4.  **specialized_programs_segment:** A 200-250 word section listing specialized training programs for the local demographic (e.g., corporate professionals, arts community, North Shore families). Must use H2 and H3 headings.

Total word count for the three body segments (2, 3, and 4) must exceed 750 words.
Do NOT use any H1 tags (#) in the output. Use H2 (##) or H3 (###) only.
`;

// This function calls the Gemini API to get the unique structured content
async function generateUniqueContent(location) {
    const locationType = location.type === 'major_city' ? 'Major City' : (location.type === 'suburb' ? 'Affluent Suburb' : 'Neighborhood');
    
    const userQuery = `
    Generate the structured content for the ${locationType} of ${location.city}, ${location.state}. 
    Focus the content on Chicago's specific demographic (Midwestern discipline, corporate schedules, North Shore/Western Suburbs family life) and the lifestyle of this ${locationType}.
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
    // ... (Error checks and directory setup remain) ...

    console.log(`\nStarting generation of ${locationsToGenerate.length} Chicago market files...`);

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
        const fullBodyArticle = [
            generatedContent.local_culture_segment,
            generatedContent.training_environment_segment,
            generatedContent.specialized_programs_segment,
        ].join('\n\n---\n\n'); // Use horizontal rules or double newlines to separate sections

        // 3. Write File
        const fileContent = frontmatter + '\n' + fullBodyArticle;
        
        const filename = path.join(OUTPUT_DIR, `${location.slug}.md`);

        await fs.writeFile(filename, fileContent, 'utf-8');
        console.log(` ✅ Done. Written to ${filename}`);
    }
    console.log('\n✨ Chicago market generation complete! Commit new files to Git.\n');
}

// Execute the generation process
generateFiles(); 
// NOTE: Execute this function manually after filling out the API key.