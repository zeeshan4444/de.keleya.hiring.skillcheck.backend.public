import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Todo: Can create multiple user but for now only creating super admin
  return prisma.user.upsert({
    where: {
      email: 'dummy@gmail.com',
    },
    update: {},
    create: {
      name: 'admin',
      email: 'dummy@gmail.com',
      is_admin: true,
      email_confirmed: true,
      credential: {
        create: {
          hash: '$2a$10$VmWT/.3mAFV0jbmCFgQ/Muu/Kg2GixqpREKJSmZUWnhUAKjep4sJq',
        },
      },
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
