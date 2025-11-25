export interface UserProfile {
  id: number;
  originalFilename: string;
  convertedFileName: string;
  fullFilePath: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

export interface ClubInfo {
  clubId: number;
  school: string;
  groupName: string;
}

export interface UserInfo {
  username: string;
  clubName: string;
  clubInfo: ClubInfo;
  groupName: string;
  email: string;
  clubAge: number | null;
  userRole: string;
  instrumentList: string[];
  profile: UserProfile;
}

export interface UserInfoResponse {
  code: string;
  message: string;
  response: UserInfo;
  isSuccess: boolean;
}

export interface BanUserRequest {
  username: string;
  banReason: string;
  banUntil: string;
}

export interface BanUserResponse {
  code: string;
  message: string;
  isSuccess: boolean;
}

export interface UserDetailModalProps {
  username: string | null;
  visible: boolean;
  onClose: () => void;
}

export interface BanUserModalProps {
  username: string | null;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

