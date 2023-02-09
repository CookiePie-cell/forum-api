/* eslint-disable camelcase */
const DetailComment = require('../DetailComment');

describe('a DetailComments entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Assert
    const payload = {
      id: 'user-123',
      content: 'abc',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: {},
      username: [],
      date: '123',
      content: 12,
      is_delete: 'true',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create DetailComment entities correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: '123',
      content: 'abc',
      is_delete: false,
    };

    // Action
    const {
      id,
      username,
      date,
      content,
      isDelete,
    } = new DetailComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual(payload.content);
    expect(isDelete).toEqual(payload.is_delete);
  });

  it('should create DetailComment entities correctly when is_delete is true', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'user-123',
      date: '123',
      content: 'abc',
      is_delete: true,
    };

    // Action
    const {
      id,
      username,
      date,
      content,
      is_delete,
    } = new DetailComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(content).toEqual('**komentar telah dihapus**');
    expect(is_delete).toEqual(payload.isDelete);
  });
});
