export interface Player {
  id: number;
  nickname: string;
  country: 'PT' | 'ES';
  avatar: string;
  style: string;
  faceitLevel: number;
  elo: number;
  modality: string;
  status: 'Disponível' | 'Busy';
}

export interface Team {
  id: number;
  name: string;
  logo: string;
  country: 'PT' | 'ES' | 'PT/ES';
  modality: string;
  lookingFor: string;
  eloRange: string;
  accepting: boolean;
} 