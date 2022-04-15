export default interface FetchPostsOutput {
  id: string;
  author: string;
  createdAt: Date;
  originalPost: FetchPostsOutput;
  content?: string;
  position: number;
}
