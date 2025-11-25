import { Modal, Spin, Descriptions, Tag, Avatar } from 'antd';
import { useState, useEffect } from 'react';
import { getUserInfo } from '../api';
import type { UserInfo, UserDetailModalProps } from '../model';

const UserDetailModal = ({ username, visible, onClose }: UserDetailModalProps) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && username) {
      setLoading(true);
      getUserInfo(username)
        .then((response) => {
          setUserInfo(response.response);
        })
        .catch((error) => {
          console.error('회원 정보를 불러오는데 실패했습니다.', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setUserInfo(null);
    }
  }, [visible, username]);

  return (
    <Modal
      title="회원 상세 정보"
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      transitionName=""
      maskTransitionName=""
    >
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Spin size="large" />
        </div>
      ) : userInfo ? (
        <div>
          <div className="flex items-center gap-4 mb-6">
            {userInfo.profile ? (
              <Avatar
                src={userInfo.profile.fullFilePath}
                size={80}
                className="shrink-0 object-cover"
              />
            ) : (
              <Avatar size={80} className="shrink-0 object-cover">
                {userInfo.username[0].toUpperCase()}
              </Avatar>
            )}
            <div>
              <div className="text-xl font-bold">{userInfo.username}</div>
              <Tag color={userInfo.userRole === 'ROLE_ADMIN' ? 'red' : 'blue'}>
                {userInfo.userRole === 'ROLE_ADMIN' ? '관리자' : '일반 사용자'}
              </Tag>
            </div>
          </div>

          <Descriptions bordered column={1}>
            <Descriptions.Item label="이메일">{userInfo.email}</Descriptions.Item>
            <Descriptions.Item label="패명">{userInfo.clubName}</Descriptions.Item>
            {userInfo.clubInfo && (
              <>
                <Descriptions.Item label="학교">{userInfo.clubInfo.school}</Descriptions.Item>
                <Descriptions.Item label="동아리">{userInfo.clubInfo.groupName}</Descriptions.Item>
              </>
            )}
            {userInfo.clubAge !== null && (
              <Descriptions.Item label="동아리 경력">{userInfo.clubAge}년</Descriptions.Item>
            )}
            <Descriptions.Item label="악기">
              {userInfo.instrumentList && userInfo.instrumentList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userInfo.instrumentList.map((instrument, index) => (
                    <Tag key={index} color="cyan">
                      {instrument}
                    </Tag>
                  ))}
                </div>
              ) : (
                '-'
              )}
            </Descriptions.Item>
          </Descriptions>
        </div>
      ) : null}
    </Modal>
  );
};

export default UserDetailModal;

