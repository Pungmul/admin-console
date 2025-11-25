export interface Thumbnail {
  id: number;
  originalFilename: string;
  convertedFileName: string;
  fullFilePath: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

export interface HiddenPost {
  postId: number;
  title: string;
  content: string;
  thumbnail: Thumbnail | null;
  viewCount: number;
  likedNum: number;
  imageNum: number;
  commentNum: number;
  timeSincePosted: number;
  timeSincePostedText: string;
  categoryId: number;
  categoryName: string;
  author: string;
  authorUsername: string;
}

export interface HiddenPostsPagination {
  total: number;
  list: HiddenPost[];
  pageNum: number;
  pageSize: number;
  size: number;
  startRow: number;
  endRow: number;
  pages: number;
  prePage: number;
  nextPage: number;
  isFirstPage: boolean;
  isLastPage: boolean;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  navigatePages: number;
  navigatepageNums: number[];
  navigateFirstPage: number;
  navigateLastPage: number;
}

export interface HiddenPostsResponse {
  code: string;
  message: string;
  response: {
    hiddenPosts: HiddenPostsPagination;
  };
  isSuccess: boolean;
}

export interface Board {
  id: number;
  name: string;
}

export interface BoardsResponse {
  code: string;
  message: string;
  response: Board[];
  isSuccess: boolean;
}

export interface PostImage {
  id: number;
  originalFilename: string;
  convertedFileName: string;
  fullFilePath: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

export interface PostDetail {
  postId: number;
  title: string;
  content: string;
  imageList: PostImage[];
  viewCount: number;
  isLiked: boolean;
  isWriter: boolean;
  likedNum: number;
  timeSincePosted: number;
  timeSincePostedText: string;
  categoryId: number;
  author: string;
  authorUsername: string;
}

export interface PostDetailResponse {
  code: string;
  message: string;
  response: PostDetail;
  isSuccess: boolean;
}

export interface PostDetailModalProps {
  postId: number | null;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  getCategoryName: (categoryId: number) => string;
}

