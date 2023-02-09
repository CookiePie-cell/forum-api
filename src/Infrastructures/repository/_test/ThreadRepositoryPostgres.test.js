const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist thread and return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'alo' });
      const addThread = new AddThread({
        title: 'hallo alo',
        body: 'alo apa kabar',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      await threadRepositoryPostgres.addThread(addThread);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return added thread correctly', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'alo' });
      const addThread = new AddThread({
        title: 'hallo alo',
        body: 'alo apa kabar',
        owner: 'user-123',
      });

      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(addThread);
      // console.log(addedThread);
      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'hallo alo',
        owner: 'user-123',
      }));
    });
  });

  describe('checkAvailabilityThread function', () => {
    it('should throw NotFoundError when thread does not exist', async () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.checkAvailabilityThread('thread-123')).rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when thread exist', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'alo',
        password: 'secret',
        fullname: 'alo jago',
      });

      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'hello alo',
        body: 'alo bin ajaib',
        createdAt: '023-02-03T12:40:59.181Z',
        owner: 'user-123',
      });

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action and Assert
      await expect(threadRepositoryPostgres.checkAvailabilityThread('thread-123')).resolves.not.toThrowError();
    });
  });

  describe('getDetailThread function', () => {
    it('should return detail thread correctly', async () => {
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'alo',
        password: 'secret',
        fullname: 'alo jago',
      });
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'hi alo',
        body: 'alo yang paling jago',
        createdAt: '2023-02-03T12:40:59.181Z',
        owner: 'user-123',
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const {
        id,
        title,
        body,
        date,
        username,
      } = await threadRepositoryPostgres.getDetailThread('thread-123');

      // Assert
      expect(id).toEqual('thread-123');
      expect(title).toEqual('hi alo');
      expect(body).toEqual('alo yang paling jago');
      expect(date).toEqual('2023-02-03T12:40:59.181Z');
      expect(username).toEqual('alo');
    });
  });
});
