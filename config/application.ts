import env from 'env-var';

export default {
  port: env.get('PORT').asInt(),
  homepagePostsLimit: env.get('HOMEPAGE_POSTS_LIMIT').asInt(),
  profilePagePostsLimit: env.get('PROFILE_PAGE_POSTS_LIMIT').asInt(),
}
