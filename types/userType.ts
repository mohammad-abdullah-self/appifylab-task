export type UserType = {
  id: number;
  firstName: string;
  lastName: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthorType = UserType;
