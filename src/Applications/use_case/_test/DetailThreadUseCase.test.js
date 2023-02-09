const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DetailThreadUseCase = require('../DetailThreadUseCase');

describe('DetailThreadUseCase', () => {
  /**
   * Menguji apakah use case mampu mengoskestrasikan langkah demi langkah dengan benar.
   */
  it('should orchestrating the detail thread action correctly', async () => {
    // Arrange
    const threadId = 'thread-123';

    const expectedThread = new DetailThread({
      id: threadId,
      title: 'Alo thread',
      body: 'Ini thread alo',
      date: new Date().toISOString(),
      username: 'alo123',
    });

    const expectedThreadComments = [
      {
        id: 'comment-123',
        username: 'alo',
        date: '2023-02-06T15:04:40.970Z',
        content: 'hallo alo jago',
        isDelete: false,
      },
    ];

    /** creating dependency of use case */
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockThreadRepository.checkAvailabilityThread = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockThreadRepository.getDetailThread = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedThread));
    mockCommentRepository.getCommentsByThread = jest.fn()
      .mockImplementation(() => Promise.resolve([
        {
          id: 'comment-123',
          username: 'alo',
          date: '2023-02-06T15:04:40.970Z',
          content: 'hallo alo jago',
          is_delete: false,
        },
      ]));

    /** creating use case instance */
    const detailThreadUseCase = new DetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
    });

    // Action
    const getDetailThread = await detailThreadUseCase.execute(threadId);

    // Assert
    expect(getDetailThread).toStrictEqual({ ...expectedThread, comments: expectedThreadComments });
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(threadId);
    expect(mockThreadRepository.getDetailThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThread).toBeCalledWith(threadId);
  });
});
