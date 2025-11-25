import {
  Modal,
  Button,
  Spin,
  Descriptions,
  Tag,
  Image,
  message,
  Dropdown,
} from "antd";
import { useState, useEffect, useCallback, useMemo } from "react";
import { MoreOutlined } from "@ant-design/icons";
import {
  getPostDetail,
  restorePost,
  deletePost,
} from "../api";
import type { PostDetail, PostDetailModalProps } from "../model";
import UserDetailModal from "@/features/users/ui/UserDetailModal";
import BanUserModal from "@/features/users/ui/BanUserModal";

const PostDetailModal = ({
  postId,
  visible,
  onClose,
  onSuccess,
  getCategoryName,
}: PostDetailModalProps) => {
  const [postDetail, setPostDetail] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [userDetailVisible, setUserDetailVisible] = useState(false);
  const [banUserVisible, setBanUserVisible] = useState(false);

  useEffect(() => {
    if (visible && postId) {
      setLoading(true);
      getPostDetail(postId)
        .then((response) => {
          setPostDetail(response.response);
        })
        .catch((error) => {
          message.error(
            error instanceof Error
              ? error.message
              : "게시글을 불러오는데 실패했습니다."
          );
          onClose();
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setPostDetail(null);
    }
  }, [visible, postId, onClose]);

  const handleRestore = useCallback(async () => {
    if (!postId) return;

    try {
      await restorePost(postId);
      message.success("게시글이 복구되었습니다.");
      onClose();
      onSuccess();
    } catch (error) {
      message.error(
        error instanceof Error ? error.message : "게시글 복구에 실패했습니다."
      );
    }
  }, [postId, onClose, onSuccess]);

  const handleDelete = useCallback(async () => {
    if (!postId) return;

    Modal.confirm({
      title: "게시글 삭제",
      content: "정말로 이 게시글을 삭제하시겠습니까?",
      okText: "삭제",
      okType: "danger",
      cancelText: "취소",
      transitionName: "",
      maskTransitionName: "",
      onOk: async () => {
        try {
          await deletePost(postId);
          message.success("게시글이 삭제되었습니다.");
          onClose();
          onSuccess();
        } catch (error) {
          message.error(
            error instanceof Error
              ? error.message
              : "게시글 삭제에 실패했습니다."
          );
        }
      },
    });
  }, [postId, onClose, onSuccess]);

  const dropdownMenuItems = useMemo(
    () => [
      {
        key: "detail",
        label: "회원 상세 정보",
        onClick: () => setUserDetailVisible(true),
      },
      {
        key: "ban",
        label: "회원 정지",
        danger: true,
        onClick: () => setBanUserVisible(true),
      },
    ],
    []
  );


  const footer = useMemo(
    () => [
      <Button key="restore" type="primary" onClick={handleRestore}>
        복구
      </Button>,
      <Button key="delete" danger onClick={handleDelete}>
        삭제
      </Button>,
    ],
    [handleRestore, handleDelete]
  );

  return (
    <Modal
      title="게시글 상세"
      open={visible}
      onCancel={onClose}
      footer={footer}
      width={800}
      transitionName=""
      maskTransitionName=""
    >
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <Spin size="large" />
        </div>
      ) : postDetail ? (
        <div>
          <Descriptions bordered column={1} className="mb-4">
            <Descriptions.Item label="카테고리">
              <Tag color="blue">{getCategoryName(postDetail.categoryId)}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="제목">
              {postDetail.title}
            </Descriptions.Item>
            <Descriptions.Item label="작성자" className="w-[120px]!">
              <div className="flex items-center justify-between">
                <span>{postDetail.author}</span>
                {postDetail.authorUsername && (
                  <Dropdown
                    menu={{ items: dropdownMenuItems }}
                    trigger={["click"]}
                    placement="bottomRight"
                  >
                    <Button
                      type="text"
                      icon={<MoreOutlined />}
                      className="ml-2"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </Dropdown>
                )}
              </div>
            </Descriptions.Item>
            <Descriptions.Item label="게시날짜">
              {postDetail.timeSincePostedText}
            </Descriptions.Item>
            <Descriptions.Item label="추천수">
              {postDetail.likedNum}
            </Descriptions.Item>
          </Descriptions>

          <div className="mb-4">
            <div className="font-semibold mb-2">게시글 내용</div>
            <div className="whitespace-pre-wrap border p-4 rounded bg-gray-50 min-h-[200px]">
              {postDetail.content}
            </div>
          </div>

          {postDetail.imageList && postDetail.imageList.length > 0 && (
            <div>
              <div className="font-semibold mb-2">이미지</div>
              <Image.PreviewGroup>
                <div className="grid grid-cols-3 gap-4">
                  {postDetail.imageList.map((image) => (
                    <Image
                      translate="no"
                      key={image.id}
                      src={image.fullFilePath}
                      alt={image.originalFilename}
                      className="rounded"
                    />
                  ))}
                </div>
              </Image.PreviewGroup>
            </div>
          )}
        </div>
      ) : null}

      <UserDetailModal
        username={postDetail?.authorUsername || null}
        visible={userDetailVisible}
        onClose={() => setUserDetailVisible(false)}
      />

      <BanUserModal
        username={postDetail?.authorUsername || null}
        visible={banUserVisible}
        onClose={() => setBanUserVisible(false)}
        onSuccess={() => {
          setBanUserVisible(false);
          onSuccess();
        }}
      />
    </Modal>
  );
};

export default PostDetailModal;
