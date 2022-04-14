import sendHttpRequest from '../helpers/send-http-request';

describe('POST /posts', () => {
  it('responds with 201 and the new post', async () => {
    const response = await sendHttpRequest({
      url: 'http://127.0.0.1:1337/posts',
      method: 'POST',
      data: {
        content: 'Hello World!',
      }
    });

    expect(response.status).toBe(201);
    expect(response.data).toEqual({
      id: expect.any(String),
      author: 'supermax',
      createdAt: expect.any(String),
      content: 'Hello World!',
    });
  });
});
