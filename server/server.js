import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Subject configurations
// Update server's SUBJECT_CONFIGS
const SUBJECT_CONFIGS = {
  mathematics_aa: {
    model: "claude-3-haiku-20240307",
    validCourses: ['IB Mathematics AA HL', 'IB Mathematics AA SL'],
    examStyles: ['Paper 1', 'Paper 2'],
    stepValidation: (step) => step.includes('=') || step.includes(';'),
    responseFormat: 'calculation'
  },
  mathematics_ai: {
    model: "claude-3-haiku-20240307",
    validCourses: ['IB Mathematics AI HL', 'IB Mathematics AI SL'],
    examStyles: ['Paper 1', 'Paper 2'],
    stepValidation: (step) => step.includes('=') || step.includes(';'),
    responseFormat: 'calculation'
  },
  physics_hl: {
    model: "claude-3-haiku-20240307",
    validCourses: ['IB Physics HL'],
    examStyles: ['Paper 1', 'Paper 2', 'Paper 3'],
    stepValidation: (step) => step.includes('=') || step.includes('N') || step.includes('J'),
    responseFormat: 'calculation'
  },
  physics_sl: {
    model: "claude-3-haiku-20240307",
    validCourses: ['IB Physics SL'],
    examStyles: ['Paper 1', 'Paper 2', 'Paper 3'],
    stepValidation: (step) => step.includes('=') || step.includes('N') || step.includes('J'),
    responseFormat: 'calculation'
  },
  chemistry_hl: {
    model: "claude-3-haiku-20240307",
    validCourses: ['IB Chemistry HL'],
    examStyles: ['Paper 1', 'Paper 2', 'Paper 3'],
    stepValidation: (step) => step.includes('→') || step.includes('='),
    responseFormat: 'calculation'
  },
  chemistry_sl: {
    model: "claude-3-haiku-20240307",
    validCourses: ['IB Chemistry SL'],
    examStyles: ['Paper 1', 'Paper 2', 'Paper 3'],
    stepValidation: (step) => step.includes('→') || step.includes('='),
    responseFormat: 'calculation'
  },
  biology_hl: {
    model: "claude-3-haiku-20240307",
    validCourses: ['IB Biology HL'],
    examStyles: ['Paper 1', 'Paper 2', 'Paper 3'],
    stepValidation: (step) => step.length > 20,
    responseFormat: 'explanation'
  },
  biology_sl: {
    model: "claude-3-haiku-20240307",
    validCourses: ['IB Biology SL'],
    examStyles: ['Paper 1', 'Paper 2', 'Paper 3'],
    stepValidation: (step) => step.length > 20,
    responseFormat: 'explanation'
  },
  economics_hl: {
    model: "claude-3-haiku-20240307",
    validCourses: ['IB Economics HL'],
    examStyles: ['Paper 1', 'Paper 2', 'Paper 3'],
    stepValidation: (step) => step.length > 50,
    responseFormat: 'essay'
  },
  economics_sl: {
    model: "claude-3-haiku-20240307",
    validCourses: ['IB Economics SL'],
    examStyles: ['Paper 1', 'Paper 2'],
    stepValidation: (step) => step.length > 50,
    responseFormat: 'essay'
  },
  business_hl: {
    model: "claude-3-haiku-20240307",
    validCourses: ['IB Business Management HL'],
    examStyles: ['Paper 1', 'Paper 2'],
    stepValidation: (step) => step.length > 50,
    responseFormat: 'case_study'
  },
  business_sl: {
    model: "claude-3-haiku-20240307",
    validCourses: ['IB Business Management SL'],
    examStyles: ['Paper 1', 'Paper 2'],
    stepValidation: (step) => step.length > 50,
    responseFormat: 'case_study'
  },
  computer_science_hl: {
    model: "claude-3-haiku-20240307",
    validCourses: ['IB Computer Science HL'],
    examStyles: ['Paper 1', 'Paper 2', 'Paper 3'],
    stepValidation: (step) => step.includes('{') || step.includes('function'),
    responseFormat: 'code'
  },
  computer_science_sl: {
    model: "claude-3-haiku-20240307",
    validCourses: ['IB Computer Science SL'],
    examStyles: ['Paper 1', 'Paper 2'],
    stepValidation: (step) => step.includes('{') || step.includes('function'),
    responseFormat: 'code'
  }
};

// System prompts for different subjects
const SYSTEM_PROMPTS = {
  mathematics_aa: `You are an IB Mathematics AA expert. Generate precise mathematical problems that require step-by-step solutions. 
  Focus on clear problem statements and ensure steps are logically connected.`,
mathematics_ai: `You are an IB Mathematics AI expert. Generate precise mathematical problems that require step-by-step solutions. 
  Focus on clear problem statements and ensure steps are logically connected.`,
  physics: `You are an IB Physics expert. Create problems that combine theoretical understanding with practical calculations. 
           Include unit analysis and physical constants where relevant.`,
  chemistry: `You are an IB Chemistry expert. Design problems involving chemical reactions, stoichiometry, and theoretical concepts. 
             Include balanced equations and proper chemical notation.`,
  biology: `You are an IB Biology expert. Create questions about biological processes, experimental design, and data analysis. 
           Include diagrams and experimental scenarios where appropriate.`,
  economics: `You are an IB Economics expert. Generate questions requiring economic analysis, graphical interpretation, and real-world applications. 
             Include case studies and data analysis components.`,
  business: `You are an IB Business Management expert. Create case-study based questions that test analytical and strategic thinking. 
            Include real-world business scenarios and quantitative analysis.`,
  computer_science: `You are an IB Computer Science expert. Design programming problems and theoretical computer science questions. 
                    Include both code writing and analysis tasks.`,
  english: `You are an IB English expert. Create literary analysis and commentary questions. 
           Focus on critical thinking and textual analysis skills.`
};

// Express setup
const app = express();
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;

// Helper function to extract JSON from text with improved error handling
function extractJSONFromText(text) {
  try {
    // Look for JSON structure with nested object notation
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      console.warn('No JSON structure found in text');
      return null;
    }

    const jsonStr = match[0];
    try {
      const parsed = JSON.parse(jsonStr);
      return parsed;
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError);
      
      // Try to clean the string and parse again
      const cleanedStr = jsonStr
        .replace(/[\u0000-\u001F]+/g, ' ')
        .replace(/\\/g, '\\\\')
        .replace(/"\s+/g, '"')
        .replace(/\s+"/g, '"');
      
      return JSON.parse(cleanedStr);
    }
  } catch (error) {
    console.error('JSON extraction failed:', error);
    return null;
  }
}

// Enhanced user profile validation
function validateUserProfile(userProfile) {
  if (!userProfile) throw new Error('User profile is required');
  if (!userProfile.subject) throw new Error('Subject is required');
  
  // If course isn't provided, construct it from subject
  if (!userProfile.course) {
    const subjectName = userProfile.subject.replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    userProfile.course = `IB ${subjectName} HL`;
  }
  
  const subjectConfig = SUBJECT_CONFIGS[userProfile.subject];
  if (!subjectConfig) {
    throw new Error(`Invalid subject. Must be one of: ${Object.keys(SUBJECT_CONFIGS).join(', ')}`);
  }
  
  if (!subjectConfig.validCourses.includes(userProfile.course)) {
    throw new Error(`Invalid course for ${userProfile.subject}. Must be one of: ${subjectConfig.validCourses.join(', ')}`);
  }

  return {
    ...userProfile,
    config: subjectConfig,
    systemPrompt: SYSTEM_PROMPTS[userProfile.subject]
  };
}

// Performance tracking system
const userPerformance = new Map();

function updateUserPerformance(userId, subject, topic, isCorrect, currentDifficulty) {
  if (!userPerformance.has(userId)) {
    userPerformance.set(userId, {
      subjects: new Map(),
      overallDifficulty: 5
    });
  }

  const userStats = userPerformance.get(userId);
  
  if (!userStats.subjects.has(subject)) {
    userStats.subjects.set(subject, new Map());
  }

  const subjectStats = userStats.subjects.get(subject);
  
  if (!subjectStats.has(topic)) {
    subjectStats.set(topic, {
      difficulty: 5,
      consecutiveCorrect: 0,
      consecutiveIncorrect: 0,
      totalAttempts: 0,
      correctAttempts: 0
    });
  }

  const topicStats = subjectStats.get(topic);
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
  return {
    newDifficulty: topicStats.difficulty,
    stats: {
      accuracy: (topicStats.correctAttempts / topicStats.totalAttempts * 100).toFixed(1),
      streak: topicStats.consecutiveCorrect,
      level: Math.floor(topicStats.difficulty)
    }
  };
}

function calculateOverallDifficulty(userStats) {
  let totalDifficulty = 0;
  let topicCount = 0;
  
  userStats.subjects.forEach(subjectStats => {
    subjectStats.forEach(stats => {
      totalDifficulty += stats.difficulty;
      topicCount++;
    });
  });
  
  return topicCount > 0 ? totalDifficulty / topicCount : 5;
}
// Helper function to get subject-specific fields for question generation
function getSubjectSpecificFields(subject) {
  const fields = {
      mathematics_aa: {
        formulasNeeded: [],
        calculatorRequired: true,
        diagramRequired: false
      },
      mathematics_ai: {
        formulasNeeded: [],
        calculatorRequired: true,
        diagramRequired: false
      },
    physics: {
      units: "",
      constants: [],
      diagramRequired: true,
      calculatorRequired: true
    },
    chemistry: {
      reactionType: "",
      balancingRequired: false,
      safetyPrecautions: [],
      equipment: []
    },
    biology: {
      diagrams: [],
      dataAnalysis: false,
      experimentalDesign: false,
      variables: []
    },
    economics: {
      graphsRequired: false,
      calculations: false,
      dataAnalysis: true,
      realWorldContext: ""
    },
    business: {
      caseStudyLength: "short",
      calculationsRequired: false,
      companiesInvolved: [],
      industry: ""
    },
    computer_science: {
      programmingLanguage: "",
      pseudocodeRequired: false,
      concepts: [],
      timeComplexity: false
    },
    english: {
      textType: "",
      wordLimit: 0,
      sourceProvided: false,
      comparativeAnalysis: false
    }
  };

  return JSON.stringify(fields[subject] || {}, null, 2);
}

// Generate Question Route
app.post('/api/generate-question', async (req, res) => {
  try {
    console.log('Received generate question request:', req.body);
    const { prompt, userProfile, previousQuestion } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const validatedProfile = validateUserProfile(userProfile);
    const topic = prompt.split(':')[0].trim();

    // Construct subject-specific prompt
    const questionPrompt = `Create an IB ${validatedProfile.subject.toUpperCase()} question following these guidelines:

1. Topic: ${topic}
2. Course Level: ${validatedProfile.course}
3. Question Requirements:
   - Make it challenging but achievable
   - Include real-world applications
   - Break down into clear, logical steps
   - Follow IB exam style and marking criteria
   - Include sufficient context and data
   ${previousQuestion ? `4. Previous Question (for reference): ${previousQuestion}\n` : ''}

The question should:
- Be clearly stated and unambiguous
- Include all necessary information
- Be appropriately challenging for ${validatedProfile.course}
- Follow IB assessment objectives
- Use proper mathematical/scientific notation where applicable
- Include relevant diagrams or data if needed

For calculations:
- Ensure numbers are reasonable and practical
- Include units where appropriate
- Make intermediate steps trackable

For essays/analysis:
- Provide clear evaluation criteria
- Include specific points to address
- Set appropriate word limits

${SUBJECT_CONFIGS[validatedProfile.subject].responseFormat === 'calculation' ? 
  '- Include clear numerical or algebraic steps\n- Specify required formulas\n- Ensure calculations are meaningful' : ''}
${SUBJECT_CONFIGS[validatedProfile.subject].responseFormat === 'essay' ? 
  '- Include clear evaluation criteria\n- Specify structure requirements\n- Provide context for analysis' : ''}
${SUBJECT_CONFIGS[validatedProfile.subject].responseFormat === 'case_study' ? 
  '- Provide detailed business context\n- Include both qualitative and quantitative aspects\n- Ensure realistic scenario' : ''}
${SUBJECT_CONFIGS[validatedProfile.subject].responseFormat === 'code' ? 
  '- Specify exact requirements\n- Include input/output examples\n- Define constraints' : ''}

Return ONLY a JSON object with this structure:
{
  "question": "Complete question text here",
  "details": {
    "topic": "${topic}",
    "subtopic": "specific subtopic",
    "difficulty": "medium",
    "examStyle": "${validatedProfile.config.examStyles[0]}",
    "expectedSteps": [
      "Detailed step 1 description",
      "Detailed step 2 description"
    ],
    "subjectSpecific": ${getSubjectSpecificFields(validatedProfile.subject)}
  }
}`;

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: validatedProfile.config.model,
        max_tokens: 1000,
        temperature: 0.2,
        system: validatedProfile.systemPrompt,
        messages: [{
          role: "user",
          content: questionPrompt
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

    if (!response.data?.content?.[0]?.text) {
      throw new Error('Invalid response structure from Claude API');
    }

    const text = response.data.content[0].text;
    console.log('Raw response from Claude:', text);

    const questionData = extractJSONFromText(text);
    if (!questionData) {
      throw new Error('Failed to extract valid JSON from Claude response');
    }

    // Validate response structure
    if (!questionData.question || !questionData.details) {
      throw new Error('Missing required fields in question data');
    }

    // Add subject-specific validation here
    if (validatedProfile.config.responseFormat === 'calculation' && 
        !questionData.details.subjectSpecific?.calculatorRequired) {
      questionData.details.subjectSpecific.calculatorRequired = true;
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
      error: 'Failed to generate question',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
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

    const validatedProfile = validateUserProfile(userProfile);
    const subjectConfig = SUBJECT_CONFIGS[validatedProfile.subject];

    // Construct subject-specific check prompt
    const checkPrompt = `Check this step of an IB ${validatedProfile.subject.toUpperCase()} solution:
      Course: ${validatedProfile.course}
      Question: ${question}
      Current Step: ${currentStep + 1}
      Student's Answer: ${stepAnswer}
      
      Consider these subject-specific criteria:
      ${subjectConfig.responseFormat === 'calculation' ? 
        '- Check mathematical accuracy\n- Verify formula usage' : ''}
      ${subjectConfig.responseFormat === 'essay' ? 
        '- Evaluate argument structure\n- Check evidence usage' : ''}
      ${subjectConfig.responseFormat === 'case_study' ? 
        '- Verify business analysis\n- Check practical recommendations' : ''}
      ${subjectConfig.responseFormat === 'code' ? 
        '- Check code functionality\n- Verify algorithm efficiency' : ''}

      Return only a JSON object with this structure:
      {
        "stepCheck": {
          "isCorrect": boolean,
          "feedback": "Detailed feedback",
          "canContinue": boolean,
          "conceptualUnderstanding": "Strong/Moderate/Weak",
          "subjectSpecific": {
            ${getSubjectSpecificCheckFields(validatedProfile.subject)}
          }
        }
      }`;

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: subjectConfig.model,
        max_tokens: 500,
        temperature: 0.2,
        system: validatedProfile.systemPrompt,
        messages: [{
          role: "user",
          content: checkPrompt
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
    if (validatedProfile.id) {
      const topic = question.split('\n')[0]?.trim();
      const performanceUpdate = updateUserPerformance(
        validatedProfile.id,
        validatedProfile.subject,
        topic,
        result.stepCheck.isCorrect,
        result.stepCheck.conceptualUnderstanding
      );

      result.stepCheck.nextQuestionDifficulty = performanceUpdate.newDifficulty;
      result.stepCheck.performance = performanceUpdate.stats;
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

// Helper function for subject-specific check fields
function getSubjectSpecificCheckFields(subject) {
  const fields = {
    math: `"calculationAccuracy": true, "formulaUsage": "correct"`,
    physics: `"unitAccuracy": true, "conceptualApplication": "strong"`,
    chemistry: `"equationBalance": true, "reactionMechanism": "correct"`,
    biology: `"terminologyUse": "accurate", "conceptualLinks": "strong"`,
    economics: `"analysisDepth": "thorough", "evidenceUse": "strong"`,
    business: `"analyticalDepth": "high", "practicalRelevance": "strong"`,
    computer_science: `"syntaxAccuracy": true, "algorithmEfficiency": "optimal"`,
    english: `"analyticalDepth": "high", "textualEvidence": "strong"`
  };
  return fields[subject] || '';
}

// Get Explanation Route
app.post('/api/get-explanation', async (req, res) => {
  try {
    console.log('Received explanation request:', req.body);
    const { question, step, userProfile } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    if (!step) {
      return res.status(400).json({ error: 'Step is required' });
    }

    const validatedProfile = validateUserProfile(userProfile);
    
    // Get user's performance data
    let performanceContext = '';
    if (validatedProfile.id) {
      const userStats = userPerformance.get(validatedProfile.id);
      const subject = userStats?.subjects.get(validatedProfile.subject);
      const topic = question.split('\n')[0]?.trim();
      const topicStats = subject?.get(topic);
      
      if (topicStats) {
        performanceContext = `
          Student Performance Context:
          - Current difficulty level: ${topicStats.difficulty}/10
          - Success rate: ${(topicStats.correctAttempts / topicStats.totalAttempts * 100).toFixed(1)}%
          - Consecutive correct answers: ${topicStats.consecutiveCorrect}
        `;
      }
    }

    // Construct subject-specific explanation prompt
    const explanationPrompt = `Explain this IB ${validatedProfile.subject.toUpperCase()} step:
      Course: ${validatedProfile.course}
      Question: ${question}
      Step to Explain: ${step}
      ${performanceContext}

      Provide an explanation tailored for ${validatedProfile.subject} that includes:
      ${SUBJECT_CONFIGS[validatedProfile.subject].responseFormat === 'calculation' ? 
        '- Mathematical concepts and formulas\n- Step-by-step calculation process' : ''}
      ${SUBJECT_CONFIGS[validatedProfile.subject].responseFormat === 'essay' ? 
        '- Analysis framework\n- Evidence integration approach' : ''}
      ${SUBJECT_CONFIGS[validatedProfile.subject].responseFormat === 'case_study' ? 
        '- Business analysis framework\n- Application of business concepts' : ''}
      ${SUBJECT_CONFIGS[validatedProfile.subject].responseFormat === 'code' ? 
        '- Programming concepts\n- Algorithm design principles' : ''}

      Return ONLY a JSON object with this structure:
      {
        "explanation": {
          "hint": "A brief, helpful hint that guides without giving away the answer",
          "conceptExplanation": "A clear explanation of the subject-specific concept involved",
          "prerequisites": ["List any prerequisite concepts needed"],
          "commonMistakes": ["Common errors students make"],
          "nextSteps": ["Suggested next steps or related topics"],
          "subjectSpecific": {
            ${getSubjectSpecificExplanationFields(validatedProfile.subject)}
          }
        }
      }`;

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: validatedProfile.config.model,
        max_tokens: 1000,
        temperature: 0.2,
        system: validatedProfile.systemPrompt,
        messages: [{
          role: "user",
          content: explanationPrompt
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

    if (!response.data?.content?.[0]?.text) {
      throw new Error('Invalid response structure from Claude API');
    }

    const text = response.data.content[0].text;
    const explanationData = extractJSONFromText(text);
    
    if (!explanationData || !explanationData.explanation) {
      throw new Error('Invalid explanation format from Claude API');
    }

    res.json(explanationData);

  } catch (error) {
    console.error('Error getting explanation:', error);
    if (error.response) {
      console.error('Claude API error details:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to get explanation',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get Solution Route
app.post('/api/get-solution', async (req, res) => {
  try {
    const { question, step, stepIndex, userProfile } = req.body;
    
    if (!question || !step || stepIndex === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const validatedProfile = validateUserProfile(userProfile);
    const subjectConfig = SUBJECT_CONFIGS[validatedProfile.subject];

    // Construct subject-specific solution prompt
    const solutionPrompt = `Provide a detailed solution for this ${validatedProfile.subject.toUpperCase()} step:
      Question: ${question}
      Current Step (${stepIndex + 1}): ${step}
      
      Provide a solution that includes:
      ${subjectConfig.responseFormat === 'calculation' ? 
        '- Detailed mathematical working\n- Formula applications\n- Final calculation' : ''}
      ${subjectConfig.responseFormat === 'essay' ? 
        '- Argument structure\n- Evidence integration\n- Analysis points' : ''}
      ${subjectConfig.responseFormat === 'case_study' ? 
        '- Business analysis\n- Supporting evidence\n- Recommendations' : ''}
      ${subjectConfig.responseFormat === 'code' ? 
        '- Code implementation\n- Algorithm explanation\n- Optimization notes' : ''}

      Format the solution with:
      1. A clear explanation of the approach
      2. Detailed working specific to this step
      3. Key points and tips for understanding

      Return the solution in this JSON structure:
      {
        "solution": {
          "explanation": "Step-by-step explanation",
          "working": "Detailed working or implementation",
          "tips": ["Key points for understanding"],
          "subjectSpecific": {
            ${getSubjectSpecificSolutionFields(validatedProfile.subject)}
          }
        }
      }`;

    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: subjectConfig.model,
        max_tokens: 1000,
        temperature: 0.2,
        system: validatedProfile.systemPrompt,
        messages: [{
          role: "user",
          content: solutionPrompt
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
    
    // Parse and format the solution
    let parsedContent;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      }

      res.json({
        solution: {
          ...parsedContent?.solution,
          explanation: parsedContent?.solution?.explanation || 
                      `Step ${stepIndex + 1}: ${text.split('\n')[0]}`,
          working: parsedContent?.solution?.working || text,
          tips: Array.isArray(parsedContent?.solution?.tips) ? 
                parsedContent.solution.tips : 
                [`Key point for ${validatedProfile.subject} step ${stepIndex + 1}`]
        }
      });
    } catch (parseError) {
      console.error('Solution parsing error:', parseError);
      // Fallback formatted response
      res.json({
        solution: {
          explanation: `Step ${stepIndex + 1}: ${text.split('\n')[0]}`,
          working: text,
          tips: [`Review ${validatedProfile.subject} concepts for step ${stepIndex + 1}`]
        }
      });
    }

  } catch (error) {
    console.error('Solution error:', error);
    res.status(500).json({
      error: 'Failed to get solution',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Helper function for subject-specific explanation fields
function getSubjectSpecificExplanationFields(subject) {
  const fields = {
    math: `"relatedFormulas": [], "visualAids": false`,
    physics: `"keyEquations": [], "experimentalContext": ""`,
    chemistry: `"reactionDetails": {}, "labSafety": []`,
    biology: `"biologicalContext": "", "experimentalDesign": {}`,
    economics: `"models": [], "realWorldExamples": []`,
    business: `"businessConcepts": [], "industryContext": ""`,
    computer_science: `"algorithms": [], "complexityAnalysis": ""`,
    english: `"literaryDevices": [], "contextualFactors": ""`
  };
  return fields[subject] || '';
}

// Helper function for subject-specific solution fields
function getSubjectSpecificSolutionFields(subject) {
  const fields = {
    math: `"alternativeApproaches": [], "visualRepresentation": null`,
    physics: `"unitAnalysis": "", "uncertaintyCalculation": null`,
    chemistry: `"mechanismDetails": "", "equilibriumConsiderations": null`,
    biology: `"processDescription": "", "dataInterpretation": null`,
    economics: `"modelApplication": "", "dataAnalysis": null`,
    business: `"strategicAnalysis": "", "recommendations": []`,
    computer_science: `"codeImplementation": "", "optimizationNotes": ""`,
    english: `"textualAnalysis": "", "criticalPerspectives": []`
  };
  return fields[subject] || '';
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));