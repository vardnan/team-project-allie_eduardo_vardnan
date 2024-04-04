const toggleHideModel = require('../models/toggleHide/toggleHide');
const { MongoClient, ObjectId } = require('mongodb');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod;
let client;
let db;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  process.env.MONGO_URI = uri;
  client = new MongoClient(uri);
  await client.connect();
  db = client.db('pennstagram');
});

afterAll(async () => {
  await client.close();
  await mongod.stop();
  delete process.env.MONGO_URI;
});

describe('toggleHideModel', () => {
  let postId;

  beforeEach(async () => {
    await db.collection('posts').deleteMany({});
    const post = await db.collection('posts').insertOne({
      content: 'Sample post content',
      hiddenBy: [],
    });
    postId = post.insertedId.toString();
  });

  test('successfully hides a post', async () => {
    const username = 'alice';
    const hide = true;

    const result = await toggleHideModel(postId, username, hide);

    const updatedPost = await db
      .collection('posts')
      .findOne({ _id: new ObjectId(postId) });

    expect(result.success).toBe(true);
    expect(updatedPost.hiddenBy).toContain(username);
  });

  test('successfully unhides a post', async () => {
    const username = 'alice';
    // First hide the post
    await db
      .collection('posts')
      .updateOne(
        { _id: new ObjectId(postId) },
        { $addToSet: { hiddenBy: username } }
      );

    const hide = false;

    const result = await toggleHideModel(postId, username, hide);

    const updatedPost = await db
      .collection('posts')
      .findOne({ _id: new ObjectId(postId) });

    expect(result.success).toBe(true);
    expect(updatedPost.hiddenBy).not.toContain(username);
  });

  test('returns false when post to hide is not found', async () => {
    const username = 'alice';
    const hide = true;
    const nonExistentPostId = new ObjectId();

    const result = await toggleHideModel(nonExistentPostId, username, hide);

    expect(result.success).toBe(false);
    expect(result.message).toBe('Post not found or update failed');
  });
});
