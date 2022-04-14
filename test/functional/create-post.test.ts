import { StatusCodes } from 'http-status-codes';
import sendHttpRequest from '../helpers/send-http-request';
import startServer from '../helpers/start-server';

describe('POST /posts', () => {
  let server;
  let basePath;

  beforeAll(async () => {
    server = await startServer();
    basePath = `http://localhost:${server.server.address().port}`;
  });

  afterAll(() => server.close());

  it('responds with 201 and the new post', async () => {
    const response = await sendHttpRequest({
      url: `${basePath}/posts`,
      method: 'POST',
      data: {
        content: 'Hello World!',
      }
    });

    expect(response.status).toBe(StatusCodes.CREATED);
    expect(response.data).toEqual({
      id: expect.any(String),
      author: 'supermax',
      createdAt: expect.any(String),
      content: 'Hello World!',
    });
  });

  it('responds with 400 when trying to create a post with more than 777 characters', async () => {
    const response = await sendHttpRequest({
      url: `${basePath}/posts`,
      method: 'POST',
      data: {
        content: 'A'.repeat(778),
      }
    });

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });
});
