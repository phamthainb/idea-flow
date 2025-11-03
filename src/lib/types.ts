export type Criterion = {
  id: string;
  name: string;
  description: string;
  placeholder: string[];
};

export type Score = {
  criterionName: string;
  score: number;
  justification: string;
};

export type Idea = {
  id: string;
  name: string;
  description: string;
  tags: string[];
  criteria: Criterion[];
  scores: Score[];
  createdAt: string; // ISO string
  userId: string;
};
