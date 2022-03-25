export interface IBusinessEntity {
  id: number;
  name: string;
}

export interface IAllProjects {
  businessEntity: null;
  client: null;
  id: number;
  name: string;
  pm: null;
  status: null;
}

export interface ISpecialization {
  id: number;
  moodleId: number;
  name: string;
}

export interface IProjectRoles {
  description: string;
  id: number;
  name: string;
}

export interface IProjectClients {
  id: number;
  name: string;
}
