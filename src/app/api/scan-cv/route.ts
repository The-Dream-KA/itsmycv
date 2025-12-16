import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Helper function to convert buffer to base64
function bufferToBase64(buffer: Buffer): string {
    return buffer.toString('base64')
}

// Helper function to get mime type string for Gemini
function getMimeTypeForGemini(mimeType: string): string {
    if (mimeType === 'application/pdf') return 'application/pdf'
    if (mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    if (mimeType === 'application/msword') return 'application/msword'
    return mimeType
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 })
        }

        // Validate file type
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
        ]

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Invalid file type. Only PDF and DOCX files are supported.' },
                { status: 400 }
            )
        }

        // Convert file to buffer and base64
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64Data = bufferToBase64(buffer)
        const mimeType = getMimeTypeForGemini(file.type)

        // Use Gemini with file data directly (supports PDF natively)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' })

        const prompt = `You are an expert CV/Resume analyzer with deep understanding of various CV formats, layouts, and structures from around the world. Your task is to meticulously extract ALL information from the uploaded CV document with maximum accuracy and completeness.

⚠️ CRITICAL INSTRUCTIONS - READ CAREFULLY:
1. Read the ENTIRE document from start to finish - do not skip ANY sections, headers, bullet points, or details
2. Extract EXACTLY what is written - preserve original wording, dates, numbers, and formatting
3. Do not infer, assume, or add information that isn't explicitly stated
4. Pay attention to ALL text elements: headers, subheaders, bullet points, tables, sidebars, columns, footers, and footnotes
5. Capture COMPLETE multi-line descriptions, responsibilities, and achievements - do not truncate
6. Be thorough with technical details, tools, technologies, frameworks, methodologies, and version numbers
7. Extract EVERY date, duration, time period, and location mentioned
8. Capture ALL contact information including multiple emails, phone numbers, addresses
9. If the CV has a two-column or multi-column layout, read ALL columns
10. Don't miss any sidebar content, text boxes, or annotations

EXTRACTION REQUIREMENTS:

📋 Personal Information (EXTRACT EVERY DETAIL):
- Full name (extract complete name exactly as written)
- Email address(es) (capture ALL email addresses found)
- Phone number(s) (with country codes, capture ALL phone numbers)
- Full Address (complete address with street, number, zip code, city, country)
- Location/City
- Country
- Postal/Zip code (if present)
- LinkedIn profile URL (complete URL)
- GitHub profile URL (complete URL)
- Portfolio/Personal website URL
- Other social media or professional profiles (Twitter, X, Facebook, Instagram, Stack Overflow, Medium, etc.)
- Nationality (if stated)
- Date of birth (if stated)
- Age (if stated)
- Marital status (if mentioned)
- Visa/work permit status (if mentioned)
- Driving license (type and validity if mentioned)
- Military service status (if mentioned)
- Gender (if stated)
- Profile photo or avatar (note if present)

💼 Professional Summary/Objective:
- Extract the complete professional summary, objective statement, or career profile
- Capture the full text exactly as written
- Include any career goals, value propositions, or key highlights mentioned

👔 Work Experience (EXTRACT EVERY DETAIL FOR EACH POSITION):
For EACH position, extract ALL of the following:
- Company/Organization name (complete official name)
- Job title/Position (exact title as written)
- Employment duration (exact start date - end date, or "Present" for current roles)
- Location (city, state/province, country)
- Employment type (Full-time, Part-time, Contract, Freelance, Internship, Remote, Hybrid, etc.)
- Company industry/sector (if mentioned)
- Department (if mentioned)
- Complete description of responsibilities (capture EVERY bullet point with full text - DO NOT TRUNCATE)
- Key achievements, accomplishments, and quantifiable results (ALL metrics, numbers, percentages)
- Technologies, tools, frameworks, languages, and methodologies used (LIST EVERY SINGLE ONE)
- Team size, reporting structure, or people managed (if mentioned)
- Projects worked on during this role (names, descriptions, outcomes)
- Awards or recognition received in this role (if mentioned)
- Reason for leaving (if mentioned)
- Salary or compensation (if mentioned)
- Key clients or partners worked with (if mentioned)

CRITICAL: Read and extract EVERY word from the work experience section. This is usually the longest and most important part of a CV.

🎓 Education (EXTRACT COMPLETE DETAILS FOR EACH QUALIFICATION):
For EACH educational qualification, extract ALL:
- Institution name (complete official name of university, college, school, academy)
- Degree/Qualification title (exact title: Bachelor's, Master's, PhD, MBA, Diploma, Certificate, Associate, etc.)
- Field of study/Major/Specialization/Concentration (complete name)
- Minor or second major (if mentioned)
- Graduation date or duration (exact start month/year - end month/year)
- GPA/Grade/Score (with scale, e.g., "3.8/4.0" or "First Class Honours")
- Class rank or percentile (if mentioned)
- Location of institution (city, country)
- Relevant coursework (capture ALL courses listed)
- Academic achievements, awards, distinctions, or honors (Dean's List, scholarships, etc.)
- Thesis/dissertation/capstone project title (if applicable)
- Research focus or advisor name (if mentioned)
- Study abroad or exchange programs (if mentioned)
- Activities, clubs, or societies (if mentioned)
- Academic projects (if mentioned)

🛠️ Skills (EXTRACT EVERY SINGLE SKILL - BE EXHAUSTIVE):
Extract ALL skills mentioned throughout the ENTIRE document, including:
- Programming Languages (e.g., JavaScript, Python, Java, C++, TypeScript, etc. - include ALL)
- Frameworks & Libraries (e.g., React, Angular, Vue, Django, Flask, Spring, etc. - include ALL)
- Databases (e.g., MySQL, PostgreSQL, MongoDB, Redis, etc. - include ALL)
- Cloud Platforms (e.g., AWS, Azure, GCP, etc. - include ALL services like EC2, S3, Lambda)
- DevOps Tools (e.g., Docker, Kubernetes, Jenkins, GitHub Actions, etc. - include ALL)
- Development Tools (IDEs, editors, version control, package managers, etc.)
- Testing Tools (Jest, Pytest, Selenium, JUnit, etc.)
- Design Tools (Figma, Sketch, Adobe Creative Suite, etc.)
- Operating Systems (Windows, Linux, macOS, Unix, etc.)
- Methodologies (Agile, Scrum, Kanban, DevOps, TDD, CI/CD, etc.)
- Soft Skills (leadership, communication, problem-solving, teamwork, etc.)
- Domain Expertise (industry-specific knowledge, business domains)
- Technical Concepts (OOP, REST APIs, Microservices, GraphQL, etc.)
- Hardware/Network skills (if mentioned)
- Any other skills mentioned

CRITICAL SKILLS EXTRACTION RULES:
- Extract skills from EVERYWHERE in the CV: dedicated skills sections, work experience descriptions, project descriptions, education, certifications, etc.
- If the CV categorizes skills (e.g., "Technical Skills", "Programming Languages", "Frontend", "Backend", "Tools", "Soft Skills"), preserve those EXACT categories
- If skills are in a simple list without categories, return them as a flat array
- Include proficiency levels if specified (e.g., "Expert", "Advanced", "Intermediate", "Years of experience")
- Include version numbers if mentioned (e.g., "React 18", "Python 3.11", "Node.js 20")
- Capture EVERY skill, even if it seems minor or is mentioned only once
- Don't miss skills mentioned in bullet points or sentences
- Look for skills in: Skills section, Technical Skills, Core Competencies, Technologies, Tools, Expertise, Proficiencies, etc.

SKILLS JSON FORMAT - Use one of these structures:
Option 1 - Categorized (if CV has categories):
"skills": {
  "Programming Languages": ["JavaScript", "Python", "Java"],
  "Frontend": ["React", "Vue", "HTML", "CSS"],
  "Backend": ["Node.js", "Django", "Express"],
  "Databases": ["PostgreSQL", "MongoDB"],
  "Soft Skills": ["Leadership", "Communication"]
}

Option 2 - Array of category objects (if CV uses this format):
"skills": [
  {"category": "Programming Languages", "skills": ["JavaScript", "Python"]},
  {"category": "Frameworks", "skills": ["React", "Django"]}
]

Option 3 - Flat array (if no categories):
"skills": ["JavaScript", "Python", "React", "Node.js", "Leadership", "Communication"]

📜 Certifications & Licenses:
For EACH certification, extract:
- Certification name/title
- Issuing organization/authority
- Issue date
- Expiration date (if applicable)
- Credential ID or license number (if provided)
- Credential URL (if provided)

🚀 Projects:
For EACH project, extract:
- Project name/title
- Description (complete project description)
- Role/Contribution
- Duration or date
- Technologies/tools used
- Key achievements or outcomes
- Project URL or repository link (if provided)
- Team size (if mentioned)

🏆 Awards & Achievements:
Extract ALL awards, honors, recognitions, or achievements:
- Award/Achievement title
- Issuing organization
- Date received
- Description or context
- Any quantifiable accomplishments (rankings, competition results, etc.)

🌍 Languages:
For EACH language, extract:
- Language name
- Proficiency level (Native, Fluent, Professional, Intermediate, Basic, or any scale mentioned like CEFR levels)

💡 Volunteer Work/Community Service:
For EACH volunteer experience, extract:
- Organization name
- Role/Position
- Duration
- Description of activities
- Impact or achievements

📚 Publications/Research:
- Publication titles
- Authors/Co-authors
- Publication date
- Journal/Conference name
- DOI or URL (if provided)

🎯 Interests & Hobbies:
- Extract any personal interests, hobbies, or extracurricular activities mentioned

📎 Additional Sections:
- Patents
- Speaking engagements
- Professional memberships
- References (if provided)
- Any other unique sections present in the CV

JSON STRUCTURE REQUIREMENTS:
Return a well-structured JSON object with these keys (use null or empty array [] if section is not present):

⚠️ IMPORTANT: The "skills" field is MANDATORY and must NEVER be null or empty if there are ANY skills mentioned anywhere in the CV!

{
  "personalInformation": { 
    name: "string", 
    email: "string", 
    phone: "string", 
    fullAddress: "complete address string",
    location: "city, country", 
    linkedin: "url", 
    github: "url", 
    website: "url",
    nationality: "string",
    ... (any other personal fields found)
  },
  "professionalSummary": "complete summary text or null",
  "workExperience": [
    { 
      company: "string", 
      position: "string", 
      duration: "start - end", 
      location: "string",
      responsibilities: ["resp1", "resp2", ...],  // EVERY responsibility as separate item
      achievements: ["achievement1", ...],
      technologies: ["tech1", "tech2", ...]  // ALL technologies mentioned
    }
  ],
  "education": [
    { 
      institution: "string", 
      degree: "string", 
      fieldOfStudy: "string",
      minor: "string if present",
      graduationDate: "date", 
      gpa: "grade",
      honors: "honors/distinctions",
      location: "string",
      coursework: ["course1", "course2", ...],
      achievements: ["achievement1", ...],
      thesis: "thesis title if applicable",
      activities: ["activity1", ...]
    }
  ],
  "skills": {
    "Programming Languages": ["JavaScript", "Python", "Java", ...],
    "Frontend": ["React", "Vue", "HTML", "CSS", ...],
    "Backend": ["Node.js", "Django", "Express", ...],
    "Databases": ["PostgreSQL", "MongoDB", "MySQL", ...],
    "DevOps": ["Docker", "Kubernetes", "Jenkins", ...],
    "Cloud": ["AWS", "Azure", "GCP", ...],
    "Tools": ["Git", "VS Code", "Jira", ...],
    "Soft Skills": ["Leadership", "Communication", "Problem Solving", ...],
    ... (any other skill categories found)
  },
  OR
  "skills": [  // Use this format if skills are not categorized in the CV
    "JavaScript", "Python", "React", "Node.js", "Leadership", "Communication", ...
  ],
  "certifications": [{ name, issuer, date, ... }],
  "projects": [{ name, description, technologies: [], duration, url, ... }],
  "awards": [{ title, issuer, date, description, ... }],
  "languages": [{ language: "language name", proficiency: "level" }],
  "volunteerWork": [{ organization, role, duration, description, ... }],
  "publications": [{ title, authors, date, journal, ... }],
  "interests": [strings],
  "additionalSections": { sectionName: content }
}

QUALITY CHECKS:
✓ Ensure no information is missed or truncated
✓ Preserve exact dates, numbers, and technical terms
✓ Capture complete bullet points and descriptions
✓ Maintain proper structure and organization
✓ Return valid, parseable JSON only

Return ONLY the JSON object, no additional text, explanations, or markdown formatting.`

        // Send the file data inline with the prompt
        let result
        try {
            result = await model.generateContent([
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: mimeType
                    }
                },
                prompt
            ])
        } catch (aiError: unknown) {
            const status = (aiError as { status?: number }).status

            // Handle rate limit (429)
            if (status === 429) {
                const retryDelay =
                    (aiError as { errorDetails?: Array<{ retryDelay?: string }> }).errorDetails?.find(
                        (detail) => typeof detail?.retryDelay === 'string'
                    )?.retryDelay || null

                return NextResponse.json(
                    {
                        error: 'AI model rate limit reached. Please wait and try again shortly.',
                        retryAfter: retryDelay,
                    },
                    { status: 429 }
                )
            }

            // Handle service overload (503)
            if (status === 503) {
                return NextResponse.json(
                    {
                        error: 'The AI service is currently overloaded. Please try again in a few moments.',
                        suggestion: 'The gemini-2.5-pro model is experiencing high demand. Please wait 30-60 seconds and try again.'
                    },
                    { status: 503 }
                )
            }

            console.error('Gemini API error:', aiError)
            throw aiError
        }
        const response = result.response
        const text = response.text()

        // Try to parse the JSON response
        let cvData
        try {
            // Remove markdown code blocks if present
            const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
            cvData = JSON.parse(cleanedText)
        } catch (parseError) {
            console.error('Failed to parse AI response:', parseError)
            return NextResponse.json(
                {
                    error: 'Failed to parse CV data',
                    rawText: text
                },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            data: cvData,
            fileName: file.name,
            fileSize: file.size
        })
    } catch (error) {
        console.error('Error scanning CV:', error)
        return NextResponse.json(
            {
                error: 'Failed to scan CV',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
