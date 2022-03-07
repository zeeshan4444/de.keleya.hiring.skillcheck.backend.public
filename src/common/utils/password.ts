//Todo: bcrypt package doesnot work will look into later
//import * as bcrypt from 'bcrypt';

import * as bcrypt from 'bcryptjs';

const saltOrRounds = 10;
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(saltOrRounds);
  return bcrypt.hash(password, salt);
};

export const hashPasswordSync = (password: string): string => {
  // const salt = await bcrypt.genSalt(saltOrRounds);
  // return bcrypt.hashSync(password, salt);
  return;
};

export const matchHashedPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compareSync(password, hash);
};
