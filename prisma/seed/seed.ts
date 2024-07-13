import { createSeedClient, Store } from "@snaplet/seed";
import { faker } from "@faker-js/faker";
import { getHashedPassword } from "../../src/lib/utils";
const generateUniqueUsername = (store: Store) => {
  let username: string;
  do {
    username = faker.internet.userName();
  } while (store.user.find((user) => user.username === username));

  return username;
};

const genereatePayAtDate = () => {
  return faker.date.between({ from: "2024-01-01T00:00:00.000Z", to: new Date() }).toLocaleDateString();
};

const main = async () => {
  const defaultPassword = await getHashedPassword("12345678");
  const seed = await createSeedClient({
    models: {
      user: {
        data: {
          username: (ctx) => generateUniqueUsername(ctx.$store),
          password: defaultPassword,
        },
      },
      expense: {
        data: {
          pay_at: () => genereatePayAtDate(),
        },
      },
    },
  });

  await seed.$resetDatabase();

  await seed.user((x) => x(100));

  await seed.expense((x) => x(1000), { connect: true });

  process.exit();
};

main();
