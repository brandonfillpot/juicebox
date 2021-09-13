const { 
  client,
  getAllUsers,
  createUser,
  updateUser,
  createPost,
  updatePost,
  getAllPosts,
  getPostsByUserId,
  getUserById
} = require('./index')


const dropTables = async () => {
  try {
    await client.query(`
      DROP TABLE IF EXISTS post_tags;
      DROP TABLE IF EXISTS tags;
      DROP TABLE IF EXISTS posts;
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
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        active BOOLEAN DEFAULT true
      );
      CREATE TABLE posts (
        id SERIAL PRIMARY KEY,
        "authorId" INTEGER REFERENCES users(id) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        active BOOLEAN DEFAULT true
      );
      CREATE TABLE tags (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL
      );
      CREATE TABLE post_tags (
        "postId" INTEGER REFERENCES posts(id) UNIQUE NOT NULL,
        "tagId" INTEGER REFERENCES tags(id) UNIQUE NOT NULL
      );
    `);
  } catch (error) {
    throw error;
  }
}

 const createInitUser = async () => {
   try {

     const frank = await createUser({
       username: 'frank', 
       password: 'FrankyDoodleDandy', 
       name: 'Frankenstein', 
       location: 'Transelvania'
      });
     const sandra = await createUser({
       username: 'sandra', 
       password: 'RandySandy', 
       name: 'Sandra Bollock', 
       location: 'Bollywood, USA'
      });
     const glamgal = await createUser({
       username: 'glamgal', 
       password: 'MrsStealYourMan', 
       name: 'Betty White', 
       location: 'Kalamazoo'
      });

   } catch (error) {
     console.error('error creating users');
     throw error;
   }
 }

 const createInitposts = async () => {

  try {
    const [frank, sandra, glamgal] = await getAllUsers();

    await createPost({
      authorId: frank.id,
      title: 'My milkshakes',
      content: 'They bring all the boys to the yard'
    });

    await createPost({
      authorId: sandra.id,
      title: "How does this work?",
      content: "Seriously, does this even do anything?"
    });

    await createPost({
      authorId: glamgal.id,
      title: "Living the Glam Life",
      content: "Do you even? I swear that half of you are posing."
    });
  } catch (error) {
      throw error
  }
 }

const rebuildDb = async () => {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitUser();
    await createInitposts();
  } catch (error) {
    throw error;
  } 
}

const testDB = async () => {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("Result:", users);

    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      name: "Newname Sogood",
      location: "Lesterville, KY"
    });
    console.log("Result:", updateUserResult);

    console.log("Calling getAllPosts");
    const posts = await getAllPosts();
    console.log("Result:", posts);

    console.log("Calling updatePost on posts[0]");
    const updatePostResult = await updatePost(posts[0].authorId, {
      title: "New Title",
      content: "Updated Content"
    });
    console.log("Result:", updatePostResult);

    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    console.log("Result:", albert);

    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }
}


 rebuildDb()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());