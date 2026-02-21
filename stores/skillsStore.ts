import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Skill {
  name: string;
  active: boolean;
  progress?: number; // 0-100% Beispiel
}

interface SkillsStore {
  skills: Skill[];
  activateSkill: (name: string) => void;
  deactivateSkill: (name: string) => void;
  setProgress: (name: string, progress: number) => void;
}

export const useSkillsStore = create<SkillsStore>()(
  persist(
    (set) => ({
      skills: [
        { name: 'Twitter Agent', active: true, progress: 65 },
        { name: 'GitHub Skill', active: true, progress: 85 },
        { name: 'Email Handler', active: false, progress: 30 },
        { name: 'Browserless Integration', active: true, progress: 90 },
      ],
      activateSkill: (name) => set((state) => ({
        skills: state.skills.map((skill) =>
          skill.name === name ? { ...skill, active: true } : skill
        ),
      })),
      deactivateSkill: (name) => set((state) => ({
        skills: state.skills.map((skill) =>
          skill.name === name ? { ...skill, active: false } : skill
        ),
      })),
      setProgress: (name, progress) =>
        set((state) => ({
          skills: state.skills.map((skill) =>
            skill.name === name ? { ...skill, progress } : skill
          ),
        })),
    }),
    { name: 'skills-storage' }
  )
);
