import { User } from '.';

export class Volunteer {
  users?: User;
  address: string;
  birthdate: string;
  dni: string;
  email: string;
  phone: string;
  status: boolean;
  volunteersSkills?: [
    {
      id: number,
      skills: VolunteerSkills,
      volunteersSkillsFormationEstates: {
      formationEstates: formationEstates,
    }
    }
  ];

  constructor(_volunteersSkills: {}, _users: User) {
    this.users = _users;
  }
}

export interface VolunteerSkills {
  skillName: string;
  }
  export interface formationEstates {
    formationEstateName: string,
    formationsDates: {
      date: string;
      id: number;
    }

    }

