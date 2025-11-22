export interface LoginResponse {
  code: string;
  message: string;
  response: {
    memberResponseDTO: {
      username: string;
      name: string;
      clubName: string;
      groupName: string;
      phoneNumber: string;
      clubAge: number | null;
      email: string;
      profile: {
        id: number;
        originalFilename: string;
        convertedFileName: string;
        fullFilePath: string;
        fileType: string;
        fileSize: number;
        createdAt: string;
      };
      userRole: string;
      instrumentStatusDTOList: Array<{
        instrument: string;
        instrumentAbility: string;
        major: boolean;
      }>;
    };
    tokenType: string;
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
    refreshTokenExpiresIn: number;
  };
  isSuccess: boolean;
}

export interface LoginFormData {
  username: string;
  password: string;
}

