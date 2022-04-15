import { FastifyReply, FastifyRequest } from 'fastify';

export default function authorization(
  request: FastifyRequest,
  reply: FastifyReply,
  done
) {
  if (request.headers.authorization) {
    request.username = request.headers.authorization;
  }

  done();
};
