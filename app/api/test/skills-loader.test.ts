import { describe, it, expect } from 'vitest';
import { selectSkillsForTask } from '../ai/skills/loader.js';

describe('skills loader (Swimlane C — agent wiring)', () => {
  it('job_match includes Swimlane B skill ids', () => {
    const ids = selectSkillsForTask('job_match').map((s) => s.id);
    expect(ids).toContain('search-jobs');
    expect(ids).toContain('draft-cover-letter');
  });

  it('cv_extract includes tailor-cv', () => {
    const ids = selectSkillsForTask('cv_extract').map((s) => s.id);
    expect(ids).toContain('tailor-cv');
    expect(ids).toContain('cv-extraction');
  });
});
