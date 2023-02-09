const DetailComment = require('../../Domains/comments/entities/DetailComment');

class DetailThreadUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    await this._threadRepository.checkAvailabilityThread(useCasePayload);
    const thread = await this._threadRepository.getDetailThread(useCasePayload);
    const comments = await this._commentRepository.getCommentsByThread(useCasePayload);
    const mappedComment = comments.map((comment) => ({ ...new DetailComment(comment) }));

    return {
      ...thread,
      comments: mappedComment,
      // comments,
    };
  }
}

module.exports = DetailThreadUseCase;
