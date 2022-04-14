import { StatusCodes } from 'http-status-codes';
import container from '../../src/infrastructure/container';
import { buildServer } from '../../src/server/server';
import sendHttpRequest from '../helpers/send-http-request';

describe('POST /posts', () => {
  let server;

  beforeAll(async () => {
    server = await buildServer(container);
    await server.listen(1337);
  });

  afterAll(() => server.close());

  it('responds with 201 and the new post', async () => {
    const response = await sendHttpRequest({
      url: 'http://localhost:1337/posts',
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
      url: 'http://localhost:1337/posts',
      method: 'POST',
      data: {
        content: 'A'.repeat(778),
      }
    });

    expect(response.status).toBe(StatusCodes.BAD_REQUEST);
  });
});
