export interface ProjectInput {
  projectName: string;
  teamName?: string;
  members: string[];
  supervisor: string;
  email: string;
}

export interface ProjectRecord {
  id: number;
  projectName: string;
  teamName: string;
  members: string;
  supervisor: string;
  email: string;
  createdAt: string;
}
