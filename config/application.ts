import env from 'env-var';

export default {
  port: env.get('PORT').asInt(),
}
