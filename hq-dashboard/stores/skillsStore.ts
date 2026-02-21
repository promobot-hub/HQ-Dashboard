import create from 'zustand';

export interface Skill {
  id: string;
  name: string;
  active: boolean;
  progress: number;
}

interface SkillsState {
  skills: Skill[];
  addSkill: (skill: Skill) => void;
  toggleSkill: (id: string) => void;
  setProgress: (id: string, progress: number) => void;
}

export const useSkillsStore = create<SkillsState>((set) => ({
  skills: [],

  addSkill: (skill) => set((state) => ({ skills: [...state.skills, skill] })),

  toggleSkill: (id) =>
    set((state) => ({
      skills: state.skills.map((skill) =>
        skill.id === id ? { ...skill, active: !skill.active } : skill
      ),
    })),

  setProgress: (id, progress) =>
    set((state) => ({
      skills: state.skills.map((skill) =>
        skill.id === id ? { ...skill, progress } : skill
      ),
    })),
}));
