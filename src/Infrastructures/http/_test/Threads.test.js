const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const createServer = require('../createServer');
const container = require('../../container');

describe('/threads endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads', () => {
    it('should response 201 and persisted thread', async () => {
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'alo',
          password: 'alo123',
          fullname: 'alo jago',
        },
      });

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'alo',
          password: 'alo123',
        },
      });

      const { accessToken } = JSON.parse(auth.payload).data;

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'alo berkelana',
          body: 'alo suka sekali berkelana',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedThread).toBeDefined();
    });

    it('should response 401 when request payload not contain access token', async () => {
      const server = await createServer(container);

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'alo',
          body: 'alo berkelana',
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(401);
      expect(responseJson.error).toEqual('Unauthorized');
      expect(responseJson.message).toEqual('Missing authentication');
    });

    it('should response 400 when request payload not contain needed property', async () => {
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'alo',
          password: 'alo123',
          fullname: 'alo jago',
        },
      });

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'alo',
          password: 'alo123',
        },
      });

      const { accessToken } = JSON.parse(auth.payload).data;

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'alo berkelana',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Data yang anda masukkan tidak lengkap');
    });

    it('should response 400 when request payload not meet data type specification', async () => {
      const server = await createServer(container);

      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'alo',
          password: 'alo123',
          fullname: 'alo jago',
        },
      });

      const auth = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'alo',
          password: 'alo123',
        },
      });

      const { accessToken } = JSON.parse(auth.payload).data;

      const response = await server.inject({
        method: 'POST',
        url: '/threads',
        payload: {
          title: 'alo berkelana',
          body: 123,
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('Data yang anda masukkan kurang tepat');
    });
  });

  describe('when GET /threads/{threadId}', () => {
    it('should response 200 and return detailed thread', async () => {
      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      const server = await createServer(container);

      const response = await server.inject({
        method: 'GET',
        url: '/threads/thread-123',
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.data).toBeDefined();
      expect(responseJson.data.thread).toBeDefined();
    });
  });
});
