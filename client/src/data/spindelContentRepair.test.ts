import { describe, expect, it } from 'vitest';
import { getSpindelLesson, getSpindelQuiz, spindelOnboardingModules } from './spindelOnboarding';

describe('Spindel clinical lesson wiring', () => {
  it('returns clinical lessons for clinical module titles', () => {
    const expectedTopics = [[1, /cornea/i], [2, /refract|light/i], [3, /pupil/i], [4, /lensometry/i], [5, /Goldmann/i], [6, /OCT/i], [7, /contact.lens/i]] as const;
    for (const [day, topic] of expectedTopics) {
      expect(JSON.stringify(getSpindelLesson(day)?.sections)).toMatch(topic);
      expect(spindelOnboardingModules.find(m => m.day === day)?.objectives.length).toBeGreaterThanOrEqual(3);
      expect(getSpindelQuiz(day)?.questions.length).toBeGreaterThanOrEqual(3);
    }
  });
  it('includes every required doctor in the appropriate workup lesson and assessment', () => {
    for (const [day, doctors] of [[8, ['Spindel','Vazan','Guenena','Slentz','Farahani']], [9, ['Wood', "O'Block", 'Nguyen','Leo','Noall']]] as const) {
      for (const doctor of doctors) {
        expect(JSON.stringify(getSpindelLesson(day))).toContain(doctor);
        expect(JSON.stringify(getSpindelQuiz(day))).toContain(doctor);
      }
    }
  });
});
