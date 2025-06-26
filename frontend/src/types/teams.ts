export type Modality = 'CS2';

export interface TeamMember {
  id: string;
  nickname: string;
  role: 'Entry Fragger' | 'AWPer' | 'IGL' | 'Support' | 'Rifler';
  elo: number;
  avatar: string;
}

export interface StaffMember {
  id: string;
  nickname: string;
  role: 'Treinador' | 'Manager';
  avatar: string;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  banner?: string;
  country: 'PT' | 'ES' | 'AD';
  description: string;
  fullDescription: string;
  modalities: Modality[];
  recruiting: boolean;
  averageElo: number;
  socials?: {
    twitter?: string;
    // podemos adicionar outros no futuro
  };
  mainLineup: TeamMember[];
  substitutes: TeamMember[];
  staff: StaffMember[];
  competitions?: string[];
  // Network posts system
  hasActivePost?: boolean;
  postDate?: string;
  postContent?: string;
  lookingForRoles?: string[];
  requirements?: string;
  lastActiveDate?: string;
} 