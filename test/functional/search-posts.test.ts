
import { StatusCodes } from 'http-status-codes';
import sendHttpRequest from '../helpers/send-http-request';
import startServer from '../helpers/start-server';

const createPost = (basePath, content) => sendHttpRequest({
  url: `${basePath}/posts`,
  method: 'POST',
  data: { content }
});

describe('Search posts', () => {
  let server;
  let basePath;

  beforeAll(async () => {
    server = await startServer();
    basePath = `http://localhost:${server.server.address().port}`;
  });

  afterAll(() => server.close());

  it('return posts that match the search query', async () => {
    await createPost(basePath, 'Hello World!');
    await createPost(basePath, 'Don\'t return this post');

    const response = await sendHttpRequest({
      url: `${basePath}/posts?search=hello`,
      method: 'GET',
    });

    expect(response.status).toBe(StatusCodes.OK);
    expect(response.data).toHaveLength(1);
    expect(response.data).toEqual([{
      id: expect.any(String),
      author: 'supermax',
      createdAt: expect.any(String),
      content: 'Hello World!',
      position: expect.any(Number),
    }]);
  });
});
