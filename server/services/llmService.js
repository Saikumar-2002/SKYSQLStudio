/**
 * LLM Service for generating SQL hints.
 * Supports both Gemini and OpenAI APIs.
 * Uses prompt engineering to give hints without revealing full solutions.
 */

const SYSTEM_PROMPT = `You are CipherSQL Tutor, an expert SQL teaching assistant. Your role is to help students learn SQL by giving them HINTS — never full solutions.

RULES:
1. NEVER write the complete SQL query that solves the problem
2. NEVER give away more than 50% of the solution at once
3. Guide students to think step-by-step
4. If the student's query has errors, point out the TYPE of error without fixing it
5. Use encouraging, supportive language
6. Keep hints concise (2-3 sentences max)
7. If the student seems stuck on basics, suggest reviewing the relevant SQL concept
8. Reference the table/column names from the schema when helpful

HINT PROGRESSION STRATEGY:
- First hint: Conceptual direction (which SQL clause/concept to use)
- Second hint: More specific guidance about structure
- Third hint: Point to exact syntax pattern without full query`;

async function getHint({ question, userQuery, schemaTables, difficulty }) {
    const schemaDescription = schemaTables.map(t =>
        `Table "${t.tableName}": columns (${t.columns.map(c => `${c.name} ${c.type}`).join(', ')})`
    ).join('\n');

    const userPrompt = `
Assignment (${difficulty}):
${question}

Available Schema:
${schemaDescription}

Student's Current Query Attempt:
${userQuery || '(no attempt yet)'}

Please provide a helpful HINT (not the solution) to guide the student.`;

    // Try Gemini first, then OpenAI
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key') {
        return await callGemini(userPrompt);
    }

    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key') {
        return await callOpenAI(userPrompt);
    }

    // Fallback: generate a rule-based hint
    return generateRuleBasedHint(question, userQuery, difficulty);
}

async function callGemini(userPrompt) {
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [{ parts: [{ text: userPrompt }] }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 200
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Try breaking the problem into smaller steps.';
}

async function callOpenAI(userPrompt) {
    const apiKey = process.env.OPENAI_API_KEY;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 200
        })
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'Try breaking the problem into smaller steps.';
}

function generateRuleBasedHint(question, userQuery, difficulty) {
    const q = question.toLowerCase();
    const uq = (userQuery || '').toLowerCase().trim();

    if (!uq) {
        return 'Start by thinking about which table(s) contain the data you need. Write a basic SELECT statement first.';
    }

    if (!uq.startsWith('select')) {
        return 'Remember: every SQL query starts with SELECT. What columns do you want to retrieve?';
    }

    if (q.includes('join') && !uq.includes('join')) {
        return 'This problem requires combining data from multiple tables. Consider using a JOIN clause to connect them.';
    }

    if (q.includes('where') && !uq.includes('where')) {
        return 'You need to filter the results. The WHERE clause lets you specify conditions for which rows to include.';
    }

    if (q.includes('group by') && !uq.includes('group by')) {
        return 'When you need aggregate results (counts, averages, etc.), GROUP BY organizes your data into groups first.';
    }

    if (q.includes('having') && !uq.includes('having')) {
        return 'To filter grouped results, you\'ll need a HAVING clause. It works like WHERE, but for groups.';
    }

    if (q.includes('subquer') && !uq.includes('select', uq.indexOf('from'))) {
        return 'Think about using a subquery — a SELECT within a SELECT. Calculate what you need first, then use it in your main query.';
    }

    if (q.includes('rank') || q.includes('window')) {
        if (!uq.includes('over')) {
            return 'Window functions use the OVER() clause. Think about how you want to partition and order your data.';
        }
    }

    return 'You\'re on the right track! Double-check your column names match the schema, and make sure your logic matches the question requirements.';
}

module.exports = { getHint };
