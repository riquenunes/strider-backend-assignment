import { FastifyReply, FastifyRequest } from 'fastify';
import { StatusCodes } from 'http-status-codes';
import DailyPostCreationLimitReached from '../../domain/errors/DailyPostCreationLimitReached';
import PostContentSizeLimitReached from '../../domain/errors/PostContentSizeLimitReached';
import PostNotFound from '../../domain/errors/PostNotFound';
import ProfileNotFound from '../../domain/errors/ProfileNotFound';
import UnableToFollowSelf from '../../domain/errors/UnableToFollowSelf';
import UnableToUnfollowSelf from '../../domain/errors/UnableToUnfollowSelf';

const errorMap = {
  [DailyPostCreationLimitReached.name]: StatusCodes.BAD_REQUEST,
  [PostContentSizeLimitReached.name]: StatusCodes.BAD_REQUEST,
  [PostNotFound.name]: StatusCodes.NOT_FOUND,
  [ProfileNotFound.name]: StatusCodes.NOT_FOUND,
  [UnableToFollowSelf.name]: StatusCodes.BAD_REQUEST,
  [UnableToUnfollowSelf.name]: StatusCodes.BAD_REQUEST,
};

export default async function errorHandler(
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const statusCode = errorMap[error.constructor.name] || StatusCodes.INTERNAL_SERVER_ERROR;

  return reply.status(statusCode).send({
    message: error.message
  });
};
