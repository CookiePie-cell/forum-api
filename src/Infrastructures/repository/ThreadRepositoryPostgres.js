const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');
const AddedThread = require('../../Domains/threads/entities/AddedThread');
const DetailThread = require('../../Domains/threads/entities/DetailThread');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(thread) {
    const { title, body, owner } = thread;
    const id = `thread-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads VALUES($1, $2, $3, $4, $5) RETURNING id, title, owner',
      values: [id, title, body, createdAt, owner],
    };

    const result = await this._pool.query(query);

    return new AddedThread({ ...result.rows[0] });
  }

  async checkAvailabilityThread(thread) {
    const query = {
      text: 'SELECT * FROM threads WHERE id = $1',
      values: [thread],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
  }

  async getDetailThread(thread) {
    const query = {
      text: `SELECT threads.id, title, body, created_at as date, users.username FROM threads
             INNER JOIN users ON users.id = threads.owner WHERE threads.id = $1`,
      values: [thread],
    };

    const result = await this._pool.query(query);
    return new DetailThread(result.rows[0]);
  }
}

module.exports = ThreadRepositoryPostgres;
