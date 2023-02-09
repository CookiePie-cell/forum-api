const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const createServer = require('../createServer');
const container = require('../../container');

describe('/comments endpoint', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('when POST /threads/{threadId}/comments', () => {
    it('should return 201 and persisted comment', async () => {
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

      // Add thread
      const threadResponse = await server.inject({
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

      const threadResponseJson = JSON.parse(threadResponse.payload);
      const threadId = threadResponseJson.data.addedThread.id;

      // Add Comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'ini adalah komen',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const commentResponseJson = JSON.parse(commentResponse.payload);
      expect(commentResponse.statusCode).toEqual(201);
      expect(commentResponseJson.status).toEqual('success');
      expect(commentResponseJson.data.addedComment).toBeDefined();
    });

    it('should return 404 if thread not exist', async () => {
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

      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'alo',
          password: 'alo123',
        },
      });

      const { accessToken } = JSON.parse(authResponse.payload).data;

      const commentResponse = await server.inject({
        method: 'POST',
        url: '/threads/tes123/comments',
        payload: {
          content: 'ini komen',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const commentResponseJson = JSON.parse(commentResponse.payload);
      expect(commentResponse.statusCode).toEqual(404);
      expect(commentResponseJson.status).toEqual('fail');
      expect(commentResponseJson.message).toEqual('Thread tidak ditemukan');
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

      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'alo',
          password: 'alo123',
        },
      });

      const { accessToken } = JSON.parse(authResponse.payload).data;

      // Add thread
      const threadResponse = await server.inject({
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

      const threadResponseJson = JSON.parse(threadResponse.payload);
      const threadId = threadResponseJson.data.addedThread.id;

      // Add Comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {},
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const commentResponseJson = JSON.parse(commentResponse.payload);
      expect(commentResponse.statusCode).toEqual(400);
      expect(commentResponseJson.status).toEqual('fail');
      expect(commentResponseJson.message).toEqual('Masukkan isi komentar terlebih dahulu');
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

      const authResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'alo',
          password: 'alo123',
        },
      });

      const { accessToken } = JSON.parse(authResponse.payload).data;

      // Add thread
      const threadResponse = await server.inject({
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

      const threadResponseJson = JSON.parse(threadResponse.payload);
      const threadId = threadResponseJson.data.addedThread.id;

      // Add Comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: [],
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const commentResponseJson = JSON.parse(commentResponse.payload);
      expect(commentResponse.statusCode).toEqual(400);
      expect(commentResponseJson.status).toEqual('fail');
      expect(commentResponseJson.message).toEqual('Masukkan isi komentar dengan benar');
    });
  });

  describe('when DELETE /threads/{threadId}/comments/{commentId}', () => {
    it('should response 401 when request payload not contain access token', async () => {
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

      // Add thread
      const threadResponse = await server.inject({
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

      const threadResponseJson = JSON.parse(threadResponse.payload);
      const threadId = threadResponseJson.data.addedThread.id;

      // Add Comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'ini adalah komen',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const commentResponseJson = JSON.parse(commentResponse.payload);
      const commentId = commentResponseJson.data.addedComment.id;

      // Delete Comment
      const deleteCommentResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
      });

      // Assert
      const deleteCommentResponseJson = JSON.parse(deleteCommentResponse.payload);
      expect(deleteCommentResponse.statusCode).toEqual(401);
      expect(deleteCommentResponseJson.error).toEqual('Unauthorized');
      expect(deleteCommentResponseJson.message).toEqual('Missing authentication');
    });

    it('should response 403 when try to delete other users comment', async () => {
      const server = await createServer(container);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', thread: 'thread-123', owner: 'user-123' });

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

      // Delete Comment
      const deleteCommentResponse = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const deleteCommentResponseJson = JSON.parse(deleteCommentResponse.payload);
      expect(deleteCommentResponse.statusCode).toEqual(403);
      expect(deleteCommentResponseJson.status).toEqual('fail');
      expect(deleteCommentResponseJson.message).toEqual('Gagal menghapus komentar, komentar bukan milik anda');
    });

    it('should response 404 when try to delete comment on not existing thread', async () => {
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

      // Delete Comment
      const deleteCommentResponse = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const deleteCommentResponseJson = JSON.parse(deleteCommentResponse.payload);
      expect(deleteCommentResponse.statusCode).toEqual(404);
      expect(deleteCommentResponseJson.status).toEqual('fail');
      expect(deleteCommentResponseJson.message).toEqual('Thread tidak ditemukan');
    });

    it('should response 404 when try to delete non existing comment', async () => {
      const server = await createServer(container);

      await UsersTableTestHelper.addUser({ id: 'user-123' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
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

      // Delete Comment
      const deleteCommentResponse = await server.inject({
        method: 'DELETE',
        url: '/threads/thread-123/comments/comment-123',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const deleteCommentResponseJson = JSON.parse(deleteCommentResponse.payload);
      expect(deleteCommentResponse.statusCode).toEqual(404);
      expect(deleteCommentResponseJson.status).toEqual('fail');
      expect(deleteCommentResponseJson.message).toEqual('Gagal menghapus komentar, komentar tidak ditemukan');
    });

    it('should delete comment successfully', async () => {
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

      // Add thread
      const threadResponse = await server.inject({
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

      const threadResponseJson = JSON.parse(threadResponse.payload);
      const threadId = threadResponseJson.data.addedThread.id;

      // Add Comment
      const commentResponse = await server.inject({
        method: 'POST',
        url: `/threads/${threadId}/comments`,
        payload: {
          content: 'ini adalah komen',
        },
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const commentResponseJson = JSON.parse(commentResponse.payload);
      const commentId = commentResponseJson.data.addedComment.id;

      // Delete Comment
      const deleteCommentResponse = await server.inject({
        method: 'DELETE',
        url: `/threads/${threadId}/comments/${commentId}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Assert
      const deleteCommentResponseJson = JSON.parse(deleteCommentResponse.payload);
      expect(deleteCommentResponse.statusCode).toEqual(200);
      expect(deleteCommentResponseJson.status).toEqual('success');
    });
  });
});
