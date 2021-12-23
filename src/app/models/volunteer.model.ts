import { User } from '.';

export class Volunteer {
  users?: User;
  address: string;
  birthdate: Date;
  dni: string;
  email: string;
  phone: string;
  status: boolean;
  volunteersSkills?: [
    {
      skills: VolunteerSkills;
    }
  ];

  constructor(_volunteersSkills: {}, _users: User) {
    this.users = _users;
    this.volunteersSkills = [{ skills: null }];
  }
}

export class VolunteerSkills {
  skillName: string;

  constructor(_skillName: string) {
    this.skillName = _skillName;
  }
}
