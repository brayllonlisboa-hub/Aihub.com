import { ResolutionResult, SolutionFeedback, Language } from '../types';

const STORAGE_KEY = 'resolveai_saved_resolutions_v1';
const LANG_KEY = 'resolveai_language';

export function getSavedResolutions(): ResolutionResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load saved resolutions', e);
    return [];
  }
}

export function saveResolution(result: ResolutionResult): void {
  try {
    const current = getSavedResolutions();
    const existingIndex = current.findIndex((item) => item.id === result.id);
    let updated: ResolutionResult[];
    if (existingIndex >= 0) {
      updated = [...current];
      // Keep existing feedbacks if incoming doesn't have them
      if (!result.feedbacks && current[existingIndex].feedbacks) {
        result.feedbacks = current[existingIndex].feedbacks;
      }
      updated[existingIndex] = result;
    } else {
      updated = [result, ...current];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 50)));
  } catch (e) {
    console.error('Failed to save resolution', e);
  }
}

export function deleteResolution(id: string): ResolutionResult[] {
  try {
    const current = getSavedResolutions();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete resolution', e);
    return [];
  }
}

export function saveFeedbackToResolution(
  resolutionId: string,
  feedback: SolutionFeedback
): ResolutionResult[] {
  try {
    const current = getSavedResolutions();
    const targetIdx = current.findIndex((item) => item.id === resolutionId);
    if (targetIdx >= 0) {
      const target = current[targetIdx];
      const existingFeedbacks = target.feedbacks || [];
      const fbIdx = existingFeedbacks.findIndex((f) => f.solutionId === feedback.solutionId);

      let updatedFbs: SolutionFeedback[];
      if (fbIdx >= 0) {
        updatedFbs = [...existingFeedbacks];
        updatedFbs[fbIdx] = feedback;
      } else {
        updatedFbs = [...existingFeedbacks, feedback];
      }

      target.feedbacks = updatedFbs;
      current[targetIdx] = { ...target };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    }
    return current;
  } catch (e) {
    console.error('Failed to save feedback to resolution', e);
    return getSavedResolutions();
  }
}

/**
 * Extracts recent learnings (positive and negative) from user feedbacks to send
 * to the AI recommendation prompt for personalization and continuous refinement.
 */
export function getAllFeedbackLearnings(): Array<{
  rating: number;
  whatWorked: string;
  whatDidntWork: string;
  generalComment: string;
}> {
  try {
    const resolutions = getSavedResolutions();
    const learnings: Array<{
      rating: number;
      whatWorked: string;
      whatDidntWork: string;
      generalComment: string;
    }> = [];

    for (const res of resolutions) {
      if (res.feedbacks && res.feedbacks.length > 0) {
        for (const fb of res.feedbacks) {
          if (fb.whatWorked || fb.whatDidntWork || fb.generalComment) {
            learnings.push({
              rating: fb.rating,
              whatWorked: fb.whatWorked,
              whatDidntWork: fb.whatDidntWork,
              generalComment: fb.generalComment,
            });
          }
        }
      }
    }

    return learnings.slice(0, 10);
  } catch (e) {
    return [];
  }
}
