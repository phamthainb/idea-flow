import type { Idea } from './types';
import fs from 'node:fs';
import path from 'node:path';

const dataDirPath = path.join(process.cwd(), 'src', 'lib', 'data');

function getDataFilePath(userId: string): string {
  if (!fs.existsSync(dataDirPath)) {
    fs.mkdirSync(dataDirPath, { recursive: true });
  }
  return path.join(dataDirPath, `ideas_${userId}.json`);
}

function readIdeas(userId: string): Idea[] {
  try {
    const dataFilePath = getDataFilePath(userId);
    if (fs.existsSync(dataFilePath)) {
      const jsonData = fs.readFileSync(dataFilePath, 'utf-8');
      return JSON.parse(jsonData);
    }
    return [];
  } catch (error) {
    console.error('Error reading ideas data, returning empty array:', error);
    return [];
  }
}

function writeIdeas(userId: string, ideas: Idea[]): void {
  try {
    const dataFilePath = getDataFilePath(userId);
    const jsonData = JSON.stringify(ideas, null, 2);
    fs.writeFileSync(dataFilePath, jsonData, 'utf-8');
  } catch (error)
  {
    console.error('Error writing ideas data:', error);
  }
}

export function getIdeas(userId: string, sort: string | null): Idea[] {
  const ideas = readIdeas(userId);
  
  const sortedIdeas = ideas.sort((a, b) => {
    const aScore = a.scores.reduce((acc, s) => acc + s.score, 0) / (a.scores.length || 1);
    const bScore = b.scores.reduce((acc, s) => acc + s.score, 0) / (b.scores.length || 1);

    switch (sort) {
      case 'score_desc':
        return bScore - aScore;
      case 'score_asc':
        return aScore - bScore;
      case 'date_asc':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'date_desc':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return sortedIdeas;
}

export function getIdeaById(userId: string, id: string): Idea | undefined {
  return readIdeas(userId).find(idea => idea.id === id);
}

export function addIdea(userId: string, idea: Omit<Idea, 'id' | 'createdAt' | 'userId'>): Idea {
  const ideas = readIdeas(userId);
  const newIdea: Idea = {
    ...idea,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    userId: userId,
  };
  writeIdeas(userId, [...ideas, newIdea]);
  return newIdea;
}

export function updateIdea(userId: string, id: string, updatedIdea: Partial<Omit<Idea, 'id'|'createdAt'>>): Idea | undefined {
  const ideas = readIdeas(userId);
  const index = ideas.findIndex(idea => idea.id === id);
  if (index !== -1) {
    ideas[index] = { ...ideas[index], ...updatedIdea };
    writeIdeas(userId, ideas);
    return ideas[index];
  }
  return undefined;
}

export function deleteIdea(userId: string, id: string): boolean {
  let ideas = readIdeas(userId);
  const newIdeas = ideas.filter(idea => idea.id !== id);
  if (newIdeas.length < ideas.length) {
    writeIdeas(userId, newIdeas);
    return true;
  }
  return false;
}
