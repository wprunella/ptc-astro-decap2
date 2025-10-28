import { promises as fs } from 'fs';
import path from 'path';

// --- CONFIGURATION ---
// 🚨 IMPORTANT: Replace with your actual Gemini API Key
const API_KEY = "AIzaSyAXCNlbjfrPEVE-98EpGvcgwq-st5wdjr0"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`;
const OUTPUT_DIR = path.join(process.cwd(), 'src', 'content', 'locations');

// ----------------------------------------------------
// STEP 1: INPUT DATA - D.C. Market Master List (37 Locations)
// ----------------------------------------------------
const locationsToGenerate = [
    { city: "Washington", state: "DC", slug: "washington-dc", type: "major_city", parent_slug: "", zip_codes: ["20001", "20004", "20006", "20037"], meta_title: "Top Personal Trainers in Washington DC | Find a Fitness Coach", meta_description: "Connect with certified personal trainers across Washington D.C., specializing in executive fitness, stress management, and historic running routes." },
    
    // D.C. Neighborhoods
    { city: "Adams Morgan", state: "DC", slug: "adams-morgan-dc", type: "neighborhood", parent_slug: "washington-dc", zip_codes: ["20009"], meta_title: "Personal Trainers in Adams Morgan DC | Nightlife & Urban Fitness", meta_description: "Find certified trainers in Adams Morgan. Coaching focused on high-energy functional training and balancing fitness with a busy social life." },
    { city: "Bloomingdale", state: "DC", slug: "bloomingdale-dc", type: "neighborhood", parent_slug: "washington-dc", zip_codes: ["20001"], meta_title: "Personal Trainers in Bloomingdale DC | Historic & Community Fitness", meta_description: "Connect with certified trainers in Bloomingdale. Expertise in historic home gyms, community center workouts, and neighborhood wellness." },
    { city: "Capitol Hill", state: "DC", slug: "capitol-hill-dc", type: "neighborhood", parent_slug: "washington-dc", zip_codes: ["20002", "20003"], meta_title: "Personal Trainers in Capitol Hill DC | Political & Executive Fitness", meta_description: "Find elite trainers near Capitol Hill. Specialized coaching for politicians, staffers, and long-hour executive schedules." },
    { city: "Cathedral Heights", state: "DC", slug: "cathedral-heights-dc", type: "neighborhood", parent_slug: "washington-dc", zip_codes: ["20016"], meta_title: "Personal Trainers in Cathedral Heights DC | Residential & Academic Wellness", meta_description: "Connect with trainers in Cathedral Heights. Coaching near American University, focusing on family fitness and established residential gyms." },
    { city: "Cleveland Park", state: "DC", slug: "cleveland-park-dc", type: "neighborhood", parent_slug: "washington-dc", zip_codes: ["20008"], meta_title: "Personal Trainers in Cleveland Park DC | Suburban Feel Urban Fitness", meta_description: "Find certified trainers in Cleveland Park. Expertise in home gyms, park workouts, and training near the National Cathedral." },
    { city: "Dupont Circle", state: "DC", slug: "dupont-circle-dc", type: "neighborhood", parent_slug: "washington-dc", zip_codes: ["20036"], meta_title: "Personal Trainers in Dupont Circle DC | International & Corporate Fitness", meta_description: "Connect with trainers in Dupont Circle. Specialized in diplomatic staff, corporate office gyms, and maximizing urban density workouts." },
    { city: "Friendship Heights", state: "DC", slug: "friendship-heights-dc", type: "neighborhood", parent_slug: "washington-dc", zip_codes: ["20016"], meta_title: "Personal Trainers in Friendship Heights DC | Retail & Luxury Wellness", meta_description: "Find elite trainers in Friendship Heights. Coaching focused on luxury condo amenities and high-end retail area fitness solutions." },
    { city: "Georgetown", state: "DC", slug: "georgetown-dc", type: "neighborhood", parent_slug: "washington-dc", zip_codes: ["20007"], meta_title: "Personal Trainers in Georgetown DC | Historic & University Fitness", meta_description: "Connect with trainers in Georgetown. Expertise in historic home gyms, university athletes, and waterfront running programs." },
    { city: "Kalorama", state: "DC", slug: "kalorama-dc", type: "neighborhood", parent_slug: "washington-dc", zip_codes: ["20008"], meta_title: "Personal Trainers in Kalorama DC | Diplomatic & Luxury Residential Fitness", meta_description: "Find discreet trainers in Kalorama. Coaching for diplomats and high-profile residents, focusing on in-home and embassy gym training." },
    { city: "Logan Circle", state: "DC", slug: "logan-circle-dc", type: "neighborhood", parent_slug: "washington-dc", zip_codes: ["20005"], meta_title: "Personal Trainers in Logan Circle DC | Urban Lifestyle & Boutique Fitness", meta_description: "Connect with certified trainers in Logan Circle. Experts in boutique studio fitness, urban running, and maximizing apartment gym spaces." },
    { city: "Metro Center", state: "DC", slug: "metro-center-dc", type: "neighborhood", parent_slug: "washington-dc", zip_codes: ["20004", "20005"], meta_title: "Personal Trainers in Metro Center DC | Downtown Corporate Wellness", meta_description: "Find elite trainers in Metro Center. Specialized corporate wellness, express lunchtime workouts, and downtown office gym experts." },
    { city: "Mount Pleasant", state: "DC", slug: "mount-pleasant-dc", type: "neighborhood", parent_slug: "washington-dc", zip_codes: ["20010"], meta_title: "Personal Trainers in Mount Pleasant DC | Community & Family Fitness", meta_description: "Connect with certified trainers in Mount Pleasant. Coaching focused on community parks, family fitness, and residential home training." },
    { city: "Navy Yard", state: "DC", slug: "navy-yard-dc", type: "neighborhood", parent_slug: "washington-dc", zip_codes: ["20003"], meta_title: "Personal Trainers in Navy Yard DC | Waterfront & Government Fitness", meta_description: "Find fitness coaches in Navy Yard. Expertise in waterfront trails, military/government schedules, and high-rise apartment gyms." },
    { city: "NoMa", state: "DC", slug: "noma-dc", type: "neighborhood", parent_slug: "washington-dc", zip_codes: ["20002"], meta_title: "Personal Trainers in NoMa DC | Modern Development & Commuter Fitness", meta_description: "Connect with trainers in NoMa. Coaching focused on new development amenities, fast-paced corporate schedules, and metro access convenience." },
    { city: "Penn Quarter", state: "DC", slug: "penn-quarter-dc", type: "neighborhood", parent_slug: "washington-dc", zip_codes: ["20004"], meta_title: "Personal Trainers in Penn Quarter DC | Arts & Corporate Fitness", meta_description: "Find elite trainers in Penn Quarter. Specialists in corporate express workouts, arts community wellness, and downtown office gyms." },
    { city: "Printers Row", state: "DC", slug: "printers-row-dc", type: "neighborhood", parent_slug: "washington-dc", zip_codes: ["20001"], meta_title: "Personal Trainers in Printers Row DC | Downtown Office & Residential Fitness", meta_description: "Connect with trainers in Printers Row. Coaching focused on downtown residential buildings, fast-paced work schedules, and urban commuting." },
    { city: "Shaw", state: "DC", slug: "shaw-dc", type: "neighborhood", parent_slug: "washington-dc", zip_codes: ["20001"], meta_title: "Personal Trainers in Shaw DC | Revitalized Community Fitness", meta_description: "Find certified trainers in Shaw. Expertise in new residential amenities, boutique fitness studios, and urban lifestyle training." },
    { city: "Tenleytown", state: "DC", slug: "tenleytown-dc", type: "neighborhood", parent_slug: "washington-dc", zip_codes: ["20016"], meta_title: "Personal Trainers in Tenleytown DC | Residential & University Fitness", meta_description: "Connect with trainers in Tenleytown. Coaching focused on residential gyms, university students, and community recreation centers." },
    { city: "The Wharf", state: "DC", slug: "the-wharf-dc", type: "neighborhood", parent_slug: "washington-dc", zip_codes: ["20024"], meta_title: "Personal Trainers in The Wharf DC | Waterfront & Hospitality Fitness", meta_description: "Find elite trainers at The Wharf. Specialized in waterfront workouts, hospitality schedules, and luxury residential amenities." },
    { city: "West End", state: "DC", slug: "west-end-dc", type: "neighborhood", parent_slug: "washington-dc", zip_codes: ["20037"], meta_title: "Personal Trainers in West End DC | Hotel & Diplomatic Fitness", meta_description: "Connect with trainers in West End. Experts in luxury hotel gyms, diplomatic staff schedules, and high-end residential training." },
    { city: "Woodley Park", state: "DC", slug: "woodley-park-dc", type: "neighborhood", parent_slug: "washington-dc", zip_codes: ["20008"], meta_title: "Personal Trainers in Woodley Park DC | Residential & Park Fitness", meta_description: "Find certified trainers in Woodley Park. Coaching near the National Zoo, Rock Creek Park, and high-end residential home gyms." },
    
    // Virginia Suburbs
    { city: "Alexandria", state: "VA", slug: "alexandria-va", type: "suburb", parent_slug: "washington-dc", zip_codes: ["22301", "22314"], meta_title: "Personal Trainers in Alexandria VA | Old Town & Commuter Fitness", meta_description: "Connect with certified trainers in Alexandria. Experts in Old Town running, family fitness, and metro-accessible workouts." },
    { city: "Annandale", state: "VA", slug: "annandale-va", type: "suburb", parent_slug: "washington-dc", zip_codes: ["22003"], meta_title: "Personal Trainers in Annandale VA | Community & Family Fitness", meta_description: "Find certified trainers in Annandale. Coaching focused on community centers, accessible gyms, and family wellness programs." },
    { city: "Arlington", state: "VA", slug: "arlington-va", type: "suburb", parent_slug: "washington-dc", zip_codes: ["22201", "22209"], meta_title: "Personal Trainers in Arlington VA | Young Professional & Commuter Fitness", meta_description: "Connect with trainers in Arlington. Specialists in high-rise amenities, metro corridor access, and young professional routines." },
    { city: "Ashburn", state: "VA", slug: "ashburn-va", type: "suburb", parent_slug: "washington-dc", zip_codes: ["20147", "20148"], meta_title: "Personal Trainers in Ashburn VA | Technology Corridor Fitness", meta_description: "Find certified trainers in Ashburn. Expertise in tech corridor schedules, corporate gym solutions, and large community fitness centers." },
    { city: "Brambleton", state: "VA", slug: "brambleton-va", type: "suburb", parent_slug: "washington-dc", zip_codes: ["20148"], meta_title: "Personal Trainers in Brambleton VA | Planned Community Fitness", meta_description: "Connect with trainers in Brambleton. Coaching focused on community center access, neighborhood trails, and family fitness." },
    { city: "Fairfax", state: "VA", slug: "fairfax-va", type: "suburb", parent_slug: "washington-dc", zip_codes: ["22030", "22033"], meta_title: "Personal Trainers in Fairfax VA | University & Suburban Fitness", meta_description: "Find certified trainers in Fairfax. Experts near George Mason University, family homes, and large suburban commercial gyms." },
    { city: "Falls Church", state: "VA", slug: "falls-church-va", type: "suburb", parent_slug: "washington-dc", zip_codes: ["22041", "22046"], meta_title: "Personal Trainers in Falls Church VA | Independent City Wellness", meta_description: "Connect with trainers in Falls Church. Coaching focused on community fitness, convenient workouts, and local park district amenities." },
    { city: "Great Falls", state: "VA", slug: "great-falls-va", type: "suburb", parent_slug: "washington-dc", zip_codes: ["22066"], meta_title: "Personal Trainers in Great Falls VA | Luxury Estate Fitness", meta_description: "Find elite personal trainers in Great Falls. Exclusive coaching for private estates, custom home gyms, and equestrian fitness." },
    { city: "Leesburg", state: "VA", slug: "leesburg-va", type: "suburb", parent_slug: "washington-dc", zip_codes: ["20175", "20176"], meta_title: "Personal Trainers in Leesburg VA | Historic Loudoun County Fitness", meta_description: "Connect with trainers in Leesburg. Specialists in historic town center training, wine country wellness, and family fitness." },
    { city: "McLean", state: "VA", slug: "mclean-va", type: "suburb", parent_slug: "washington-dc", zip_codes: ["22101", "22102"], meta_title: "Personal Trainers in McLean VA | High-Net-Worth Executive Fitness", meta_description: "Find elite personal trainers in McLean. Discreet coaching for executives, high-end home gyms, and international travel preparation." },
    { city: "Oakton", state: "VA", slug: "oakton-va", type: "suburb", parent_slug: "washington-dc", zip_codes: ["22124"], meta_title: "Personal Trainers in Oakton VA | Residential & Commuter Wellness", meta_description: "Connect with trainers in Oakton. Coaching focused on residential community gyms, commuter schedules, and home workout routines." },
    { city: "Reston", state: "VA", slug: "reston-va", type: "suburb", parent_slug: "washington-dc", zip_codes: ["20190", "20194"], meta_title: "Personal Trainers in Reston VA | Planned Community & Corporate Fitness", meta_description: "Find certified trainers in Reston. Experts in planned community amenities, corporate offices, and outdoor park systems." },
    { city: "Springfield", state: "VA", slug: "springfield-va", type: "suburb", parent_slug: "washington-dc", zip_codes: ["22150", "22153"], meta_title: "Personal Trainers in Springfield VA | Family & Military Community Fitness", meta_description: "Connect with trainers in Springfield. Coaching focused on family health, accessible gyms, and flexible scheduling for military families." },
    { city: "Vienna", state: "VA", slug: "vienna-va", type: "suburb", parent_slug: "washington-dc", zip_codes: ["22180", "22182"], meta_title: "Personal Trainers in Vienna VA | Suburban Family Wellness", meta_description: "Find certified trainers in Vienna. Specialists in suburban residential training, home gyms, and local recreation center programs." },

    // Maryland Suburbs
    { city: "Bethesda", state: "MD", slug: "bethesda-md", type: "suburb", parent_slug: "washington-dc", zip_codes: ["20814", "20817"], meta_title: "Personal Trainers in Bethesda MD | NIH & Corporate Fitness", meta_description: "Connect with trainers in Bethesda. Experts near NIH/military facilities, corporate schedules, and luxury apartment amenities." },
    { city: "Chevy Chase", state: "MD", slug: "chevy-chase-md", type: "suburb", parent_slug: "washington-dc", zip_codes: ["20815"], meta_title: "Personal Trainers in Chevy Chase MD | Upscale Home & Club Training", meta_description: "Find elite personal trainers in Chevy Chase. Coaching for high-end home gyms and prestigious local athletic clubs near D.C." },
    { city: "Darnestown", state: "MD", slug: "darnestown-md", type: "suburb", parent_slug: "washington-dc", zip_codes: ["20874", "20878"], meta_title: "Personal Trainers in Darnestown MD | Rural Lifestyle & Family Fitness", meta_description: "Connect with certified trainers in Darnestown. Specialists in custom home gyms, family wellness, and maintaining an active country lifestyle." },
    { city: "Kensington", state: "MD", slug: "kensington-md", type: "suburb", parent_slug: "washington-dc", zip_codes: ["20895"], meta_title: "Personal Trainers in Kensington MD | Historic Community Wellness", meta_description: "Find certified trainers in Kensington. Coaching focused on community recreation centers, historic home gyms, and local suburban wellness." },
    { city: "North Potomac", state: "MD", slug: "north-potomac-md", type: "suburb", parent_slug: "washington-dc", zip_codes: ["20878", "20879"], meta_title: "Personal Trainers in North Potomac MD | Family & Residential Fitness", meta_description: "Connect with trainers in North Potomac. Experts in residential community gyms, family fitness, and specialized routines." },
    { city: "Potomac", state: "MD", slug: "potomac-md", type: "suburb", parent_slug: "washington-dc", zip_codes: ["20854"], meta_title: "Personal Trainers in Potomac MD | Luxury Estate & Equestrian Fitness", meta_description: "Find elite personal trainers in Potomac. Exclusive coaching for private estates, equestrian properties, and high-end home gym design." },
    { city: "Rockville", state: "MD", slug: "rockville-md", type: "suburb", parent_slug: "washington-dc", zip_codes: ["20850", "20852"], meta_title: "Personal Trainers in Rockville MD | Corporate & Commuter Fitness", meta_description: "Connect with certified trainers in Rockville. Specialists in corporate campus gyms, commuter-friendly schedules, and large fitness centers." },
    { city: "Silver Spring", state: "MD", slug: "silver-spring-md", type: "suburb", parent_slug: "washington-dc", zip_codes: ["20901", "20910"], meta_title: "Personal Trainers in Silver Spring MD | Urban Suburban Wellness", meta_description: "Find certified trainers in Silver Spring. Coaching focused on urban density amenities, diverse community fitness, and metro access." },
];

// ----------------------------------------------------
// STEP 2: AI PROMPT TEMPLATE (Structured for Authority)
// ----------------------------------------------------
const systemInstruction = `
You are an expert SEO Content Architect. Your task is to generate four distinct content segments for a personal trainer matching service in a specific location.

Output MUST be a single JSON object with the following four keys. All content must be grammatically perfect and hyper-local:
1.  **brief_description:** A concise, **60-80 word paragraph** focused on conversion and high-intent keywords.
2.  **local_culture_segment:** A 250-350 word section detailing the city's unique fitness culture, major parks/landmarks (e.g., National Mall, Rock Creek Park), and political/executive demographics. Must use H2 and H3 headings.
3.  **training_environment_segment:** A 300-400 word section covering local gym types, private training options, and popular outdoor workout spots (e.g., government office gyms, embassy facilities, Capital Crescent Trail). Must use H2 and H3 headings.
4.  **specialized_programs_segment:** A 200-250 word section listing specialized training programs for the local demographic (e.g., stress management for staffers, military/executive fitness, diplomatic travel prep). Must use H2 and H3 headings.

Total word count for the three body segments (2, 3, and 4) must exceed 750 words.
Do NOT use any H1 tags (#) in the output. Use H2 (##) or H3 (###) only.
`;

// This function calls the Gemini API to get the unique structured content
async function generateUniqueContent(location) {
    const locationType = location.type === 'major_city' ? 'Washington D.C. Metropolitan Hub' : (location.type === 'suburb' ? 'Affluent D.C. Suburb' : 'D.C. Neighborhood');
    
    const userQuery = `
    Generate the structured content for the ${locationType} of ${location.city}, ${location.state}. 
    Focus the content on the D.C. area's specific demographic (Political schedules, high stress, commuter lifestyle, historic landmarks) and the lifestyle of this ${locationType}.
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

    console.log(`\nStarting generation of ${locationsToGenerate.length} D.C. market files...`);

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
        ].join('\n\n---\n\n'); 

        // 3. Write File
        const fileContent = frontmatter + '\n' + fullBodyArticle;
        
        const filename = path.join(OUTPUT_DIR, `${location.slug}.md`);

        await fs.writeFile(filename, fileContent, 'utf-8');
        console.log(` ✅ Done. Written to ${filename}`);
    }
    console.log('\n✨ D.C. market generation complete! Commit new files to Git.\n');
}

generateFiles();
