import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Adjust this to match your frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Add this near the top of your server.js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

// Helper function to extract JSON from text
function extractJSONFromText(text) {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      const jsonStr = match[0];
      return JSON.parse(jsonStr);
    }
  } catch (error) {
    console.error('JSON extraction failed:', error);
    return null;
  }
  return null;
}

// Helper function to validate user profile
function validateUserProfile(userProfile) {
  if (!userProfile) throw new Error('User profile is required');
  if (!userProfile.math_course) throw new Error('Math course is required');
  if (!userProfile.id) throw new Error('User ID is required');
  
  const validCourses = [
    'IB Math AA HL',
    'IB Math AA SL',
    'IB Math AI HL',
    'IB Math AI SL'
  ];
  
  if (!validCourses.includes(userProfile.math_course)) {
    throw new Error(`Invalid math course. Must be one of: ${validCourses.join(', ')}`);
  }
}

// Track user performance in memory
const userPerformance = new Map();

function updateUserPerformance(userId, topic, isCorrect, currentDifficulty) {
  if (!userPerformance.has(userId)) {
    userPerformance.set(userId, {
      topics: new Map(),
      overallDifficulty: 5
    });
  }

  const userStats = userPerformance.get(userId);
  
  if (!userStats.topics.has(topic)) {
    userStats.topics.set(topic, {
      difficulty: 5,
      consecutiveCorrect: 0,
      consecutiveIncorrect: 0,
      totalAttempts: 0,
      correctAttempts: 0
    });
  }

  const topicStats = userStats.topics.get(topic);
  topicStats.totalAttempts++;
  
  if (isCorrect) {
    topicStats.correctAttempts++;
    topicStats.consecutiveCorrect++;
    topicStats.consecutiveIncorrect = 0;
    
    if (topicStats.consecutiveCorrect >= 2) {
      topicStats.difficulty = Math.min(10, topicStats.difficulty + 0.5);
    }
  } else {
    topicStats.consecutiveCorrect = 0;
    topicStats.consecutiveIncorrect++;
    
    if (topicStats.consecutiveIncorrect >= 2) {
      topicStats.difficulty = Math.max(1, topicStats.difficulty - 1);
    }
  }

  userStats.overallDifficulty = calculateOverallDifficulty(userStats);
  return topicStats.difficulty;
}

function calculateOverallDifficulty(userStats) {
  let totalDifficulty = 0;
  let topicCount = 0;
  
  userStats.topics.forEach(stats => {
    totalDifficulty += stats.difficulty;
    topicCount++;
  });
  
  return topicCount > 0 ? totalDifficulty / topicCount : 5;
}

// Generate Question Route
app.post('/api/generate-question', async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    const { prompt, userProfile } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
      validateUserProfile(userProfile);
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    const topic = prompt.split(':')[0].trim();
    
    const systemPrompt = `You are an IB Math expert assistant. Generate questions in valid JSON format only. 
    Do not include any other text or formatting outside the JSON structure.`;
    
    const userPrompt = `Create an IB Math question with these parameters:
    Topic: ${topic}
    Course: ${userProfile.math_course}
    
    Return ONLY a JSON object with this exact structure - no other text:
    {
      "question": "Write the complete question text here",
      "details": {
        "topic": "${topic}",
        "subtopic": "specific subtopic name",
        "difficulty": "medium",
        "examStyle": "Paper 1",
        "expectedSteps": [
          "Step 1 description",
          "Step 2 description"
        ]
      }
    }`;

    console.log('Sending request to Claude API...');
    
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: "claude-3-haiku-20240307",
        max_tokens: 1000,
        temperature: 0.2,
        system: systemPrompt,
        messages: [{
          role: "user",
          content: userPrompt
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    console.log('Claude API response received');
    
    if (!response.data?.content?.[0]?.text) {
      throw new Error('Invalid response structure from Claude API');
    }

    const text = response.data.content[0].text;
    console.log('Raw text from Claude:', text);

    const questionData = extractJSONFromText(text);
    if (!questionData) {
      throw new Error('Failed to extract valid JSON from Claude response');
    }

    if (!questionData.question || !questionData.details) {
      throw new Error('Missing required fields in question data');
    }

    res.json(questionData);

  } catch (error) {
    console.error('Error generating question:', error);
    if (error.response) {
      console.error('Claude API error details:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to generate question via Claude API',
      details: error.message
    });
  }
});

// Check Step Route
app.post('/api/check-step', async (req, res) => {
  try {
    const { question, currentStep, stepAnswer, userProfile } = req.body;
    
    if (!question || !stepAnswer || currentStep === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: "claude-3-haiku-20240307",
        max_tokens: 150,
        temperature: 0.2,
        messages: [{
          role: "user",
          content: `Check this step of an IB Math solution:
            Course: ${userProfile.math_course}
            Question: ${question}
            Current Step: ${currentStep + 1}
            Student's Answer: ${stepAnswer}
            
            Return only a JSON object with this structure:
            {
              "stepCheck": {
                "isCorrect": boolean,
                "feedback": "Detailed feedback",
                "canContinue": boolean,
                "conceptualUnderstanding": "Strong/Moderate/Weak"
              }
            }`
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    const text = response.data.content[0].text;
    const result = extractJSONFromText(text);
    
    if (!result || !result.stepCheck) {
      throw new Error('Invalid response format from Claude API');
    }

    // Update user performance
    if (userProfile.id) {
      const topic = question.split('\n')[0]?.trim();
      const newDifficulty = updateUserPerformance(
        userProfile.id,
        topic,
        result.stepCheck.isCorrect,
        result.stepCheck.conceptualUnderstanding
      );
      result.stepCheck.nextQuestionDifficulty = newDifficulty;
    }

    res.json(result);

  } catch (error) {
    console.error('Error checking step:', error);
    res.status(500).json({ 
      error: 'Failed to check step',
      details: error.message
    });
  }
});

// Get Explanation Route
app.post('/api/get-explanation', async (req, res) => {
  try {
    console.log('Received explanation request:', req.body);
    const { question, step, userProfile } = req.body;
    
    // Validate input
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    if (!step) {
      return res.status(400).json({ error: 'Step is required' });
    }
    if (!userProfile || !userProfile.math_course) {
      return res.status(400).json({ error: 'Valid user profile is required' });
    }

    // Get user's performance data if available
    let performanceContext = '';
    if (userProfile.id) {
      const userStats = userPerformance.get(userProfile.id);
      const topic = question.split('\n')[0]?.trim();
      const topicStats = userStats?.topics.get(topic);
      
      if (topicStats) {
        performanceContext = `
          Student Performance:
          - Current difficulty level: ${topicStats.difficulty}/10
          - Success rate: ${(topicStats.correctAttempts / topicStats.totalAttempts * 100).toFixed(1)}%
        `;
      }
    }

    console.log('Sending request to Claude API for explanation...');
    
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: "claude-3-haiku-20240307",
        max_tokens: 500,
        temperature: 0.2,
        system: "You are an IB Math expert. Provide clear, concise explanations in JSON format only.",
        messages: [{
          role: "user",
          content: `Explain this IB Math step:
            Course: ${userProfile.math_course}
            Question: ${question}
            Step to Explain: ${step}
            ${performanceContext}

            Return ONLY a JSON object with this exact structure - no other text:
            {
              "explanation": {
                "hint": "A brief, helpful hint that guides without giving away the answer",
                "conceptExplanation": "A clear explanation of the mathematical concept involved",
                "prerequisites": ["List any prerequisite concepts needed"],
                "commonMistakes": ["Common errors students make"],
                "nextSteps": ["Suggested next steps or related topics"]
              }
            }`
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01'
        }
      }
    );

    // Log the raw response for debugging
    console.log('Claude API explanation response:', {
      status: response.status,
      headers: response.headers,
      data: response.data
    });

    if (!response.data?.content?.[0]?.text) {
      console.error('Invalid response structure:', response.data);
      throw new Error('Invalid response structure from Claude API');
    }

    const text = response.data.content[0].text;
    console.log('Raw explanation text from Claude:', text);

    // Extract and parse JSON
    const explanationData = extractJSONFromText(text);
    if (!explanationData) {
      console.error('Failed to extract JSON from:', text);
      throw new Error('Failed to extract valid JSON from Claude response');
    }

    // Validate explanation structure
    if (!explanationData.explanation) {
      console.error('Missing explanation in response:', explanationData);
      throw new Error('Missing explanation in Claude response');
    }

    // Send successful response
    res.json(explanationData);

  } catch (error) {
    console.error('Error getting explanation:', error);
    
    // Log detailed error information
    if (error.response) {
      console.error('Claude API error details:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers
      });
    }
    
    // Send appropriate error response
    res.status(500).json({ 
      error: 'Failed to get explanation',
      details: error.message,
      type: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Add this new endpoint in server.js

// Add this endpoint to server.js
// Update this endpoint in server.js

app.post('/api/get-solution', async (req, res) => {
  try {
    const { question, step, stepIndex, userProfile } = req.body;
    
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: "claude-3-haiku-20240307",
        max_tokens: 500,
        temperature: 0.2,
        messages: [{
          role: "user",
          content: `Solve this specific step:
            Question: ${question}
            Current Step (${stepIndex + 1}): ${step}
            
            IMPORTANT: Only provide the solution for this specific step, not the entire problem.
            Format your response as a clear solution with:
            1. A brief explanation of this step only
            2. The working for this specific step
            3. Tips specific to this step`
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'anthropic-version': '2023-06-01',
          'x-api-key': CLAUDE_API_KEY
        }
      }
    );

    const text = response.data.content[0].text;
    
    // Try to parse any JSON in the response
    let parsedContent;
    try {
      // Find any JSON-like content in the text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      }

      // If we successfully parsed nested content, use it
      if (parsedContent && parsedContent.solution) {
        parsedContent = parsedContent.solution;
      }

      res.json({
        solution: {
          solution: {
            explanation: parsedContent?.explanation || `Step ${stepIndex + 1}: ` + text.split('\n')[0],
            working: parsedContent?.working || text,
            tips: Array.isArray(parsedContent?.tips) ? parsedContent.tips : [`Tip for step ${stepIndex + 1}`]
          }
        }
      });
    } catch (parseError) {
      // If parsing fails, return a formatted version of the raw text
      res.json({
        solution: {
          solution: {
            explanation: `Step ${stepIndex + 1}: ` + text.split('\n')[0],
            working: text,
            tips: [`Review step ${stepIndex + 1} carefully`]
          }
        }
      });
    }

  } catch (error) {
    console.error('Solution error:', error);
    res.status(500).json({
      error: 'Failed to get solution',
      details: error.message
    });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));