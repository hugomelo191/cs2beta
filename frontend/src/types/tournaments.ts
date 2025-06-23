export type Modality = 'CS2' | 'EA FC Pro Clubs' | 'Free Fire';
export type TournamentFormat = 'Eliminação Simples' | 'Eliminação Dupla' | 'Fase de Grupos + Playoffs' | 'Round-Robin' | 'Suíço';
export type TournamentStatus = 'Inscrições Abertas' | 'A Decorrer' | 'Finalizado' | 'Cancelado';

export interface Tournament {
  id: string;
  name: string;
  modality: Modality;
  format: TournamentFormat;
  organizer: string;
  organizerLogo?: string;
  startDate: string;
  endDate: string;
  status: TournamentStatus;
  participants: { id: string; name: string; logo: string }[];
  rulesUrl: string;
  prizePool?: string;
  bannerUrl: string;
  isFeatured?: boolean;
}

// Por agora, as Ligas podem usar a mesma estrutura, mas podemos especializá-la no futuro
export interface League extends Omit<Tournament, 'format'> {
  format: 'Liga Round-Robin';
  ranking: { teamId: string; points: number; position: number }[];
} 