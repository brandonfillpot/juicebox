const { 
  client,
  getAllUsers,
  createUser 
} = require('./index')


const dropTables = async () => {
  try {
    await client.query(`
      DROP TABLE IF EXISTS users;
    `);
  } catch (error) {
    throw error;
  }
}

const createTables = async () => {
  try {
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username varchar(255) UNIQUE NOT NULL,
        password varchar(255) NOT NULL
      );
    `);
  } catch (error) {
    throw error;
  }
}
 const createInitUser = async () => {
   try {
     console.log('starting to create user...')

     const frank = await createUser({username: 'frank', password: 'FrankyDoodleDandy'});
     const sandra = await createUser({username: 'sandra', password: 'RandySandy'});
     const glamgal = await createUser({username: 'glamgal', password: 'MrsStealYourMan'});

     console.log(frank);
     console.log('finsished creating users');
   } catch (error) {
     console.error('error creating users');
     throw error;
   }
 }

const rebuildDb = async () => {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitUser();  
  } catch (error) {
    throw error;
  } 
}

const testDB = async () => {
  try {
    console.log("Starting to test database...");

    const users = await getAllUsers();
    console.log("getAllUsers:", users);

    console.log("Finished database tests!");
  } catch (error) {
    console.error("Error testing database!");
    throw error;
  }
}


 rebuildDb()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());