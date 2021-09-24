import { User } from '.';

export class Volunteer {
  users: User;
  volunteersSkills: [
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
