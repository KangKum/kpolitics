// 게시글 인터페이스
export interface Post {
  _id: string;
  title: string;
  content: string;
  nickname: string;
  viewCount: number;
  createdAt: string;
  updatedAt?: string;
  commentCount?: number; // 목록 조회 시에만 포함
}

// 댓글 인터페이스
export interface Comment {
  _id: string;
  postId: string;
  content: string;
  nickname: string;
  createdAt: string;
  updatedAt?: string;
}

// 페이지네이션 인터페이스
export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalPosts: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// 게시글 목록 응답 인터페이스
export interface PostsResponse {
  posts: Post[];
  pagination: Pagination;
}

// 게시글 상세 응답 인터페이스
export interface PostDetailResponse {
  post: Post;
}

// 댓글 목록 응답 인터페이스
export interface CommentsResponse {
  comments: Comment[];
  count: number;
}

// 게시글 작성 폼 데이터
export interface PostFormData {
  title: string;
  content: string;
  nickname: string;
  password: string;
}

// 댓글 작성 폼 데이터
export interface CommentFormData {
  content: string;
  nickname: string;
  password: string;
}
