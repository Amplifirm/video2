// src/lib/claude.ts
import { API_URL } from '../config/api';
import type { 
  UserProfile, 
  ClaudeQuestionResponse, 
  ClaudeAnswerResponse,
  ClaudeSolutionResponse
} from '../types/practice';

// Add this function to claude.ts
// In claude.ts
export async function getSolution(
    question: string,
    step: string,
    userProfile: UserProfile,
    stepIndex: number
  ): Promise<ClaudeSolutionResponse> {
    try {
      console.log('Sending solution request:', { question, step, stepIndex, userProfile });
  
      const response = await fetch(`${API_URL}/get-solution`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          step,
          stepIndex,
          userProfile
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        console.error('Server error:', data);
        throw new Error(data.error || `Server error: ${response.status}`);
      }
  
      console.log('Solution response:', data);
  
      if (!data.solution) {
        throw new Error('Invalid solution format received');
      }
  
      return {
        solution: data.solution
      };
    } catch (error) {
      console.error('Solution fetch error:', error);
      return {
        error: error instanceof Error ? error.message : 'Failed to get solution'
      };
    }
  }

export async function getExplanation(
  question: string,
  step: string,
  userProfile: UserProfile
): Promise<ClaudeAnswerResponse> {
  try {
    const response = await fetch(`${API_URL}/get-explanation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        step,
        userProfile
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.explanation) {
      throw new Error('Invalid explanation format from server');
    }

    return data;
  } catch (error) {
    console.error('Explanation error:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to get explanation'
    };
  }
}

export async function generateQuestion(
  prompt: string, 
  userProfile: UserProfile,
  previousQuestion?: string
): Promise<ClaudeQuestionResponse> {
  try {
    const response = await fetch(`${API_URL}/generate-question`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        userProfile,
        previousQuestion
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.question || !data.details) {
      throw new Error('Invalid response format from server');
    }

    return data;
  } catch (error) {
    console.error('Question generation error:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to generate question'
    };
  }
}



export async function checkStep(
  question: string,
  currentStep: number,
  stepAnswer: string,
  userProfile: UserProfile,
  isSkippingSteps?: boolean
): Promise<ClaudeAnswerResponse> {
  try {
    const response = await fetch(`${API_URL}/check-step`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question,
        currentStep,
        stepAnswer,
        userProfile,
        isSkippingSteps
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server error: ${response.status}`);
    }

    const data = await response.json();
    if (!data.stepCheck) {
      throw new Error('Invalid response format from server');
    }

    return data;
  } catch (error) {
    console.error('Step check error:', error);
    return {
      error: error instanceof Error ? error.message : 'Failed to check step'
    };
  }
}