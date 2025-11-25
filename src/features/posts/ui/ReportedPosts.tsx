import { Table, Pagination, Card, Image, Tag, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useReportedPosts } from "../hooks/useReportedPosts";
import type { HiddenPost } from "../model";
import PostDetailModal from "./PostDetailModal";
import { useState, useMemo, useCallback } from "react";

const ReportedPosts = () => {
  const {
    posts,
    loading,
    total,
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    refresh,
    getCategoryName,
  } = useReportedPosts(1, 20);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const handleRowClick = useCallback((record: HiddenPost) => {
    setSelectedPostId(record.postId);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => setModalVisible(false), []);
  const handlePaginationChange = useCallback((page: number, size: number) => {
    if (size !== pageSize) {
      setPageSize(size);
    } else {
      setCurrentPage(page);
    }
  }, [pageSize, setPageSize, setCurrentPage]);

  const showTotal = useCallback((total: number, range: [number, number]) => 
    `${range[0]}-${range[1]} / 총 ${total}개`
  , []);

  const columns: ColumnsType<HiddenPost> = useMemo(
    () => [
      {
        title: "ID",
        dataIndex: "postId",
        key: "postId",
        width: 80,
      },
      {
        title: "제목",
        dataIndex: "title",
        key: "title",
        width: 200,
        render: (title: string) => (
          <Tooltip title={title}>
            <span className="line-clamp-1">{title}</span>
          </Tooltip>
        ),
      },
      {
        title: "작성자",
        dataIndex: "author",
        key: "author",
        width: 120,
      },
      {
        title: "카테고리",
        dataIndex: "categoryName",
        key: "categoryName",
        width: 120,
        render: (categoryName: string) => (
          <Tag color="blue">{categoryName}</Tag>
        ),
      },
      {
        title: "썸네일",
        dataIndex: "thumbnail",
        key: "thumbnail",
        width: 100,
        render: (thumbnail: HiddenPost["thumbnail"]) => {
          if (!thumbnail) return "-";
          return (
            <Image
              src={thumbnail.fullFilePath}
              alt={thumbnail.originalFilename}
              width={60}
              height={60}
              style={{ objectFit: "cover" }}
              preview
            />
          );
        },
      },
      {
        title: "조회수",
        dataIndex: "viewCount",
        key: "viewCount",
        width: 80,
        align: "right",
      },
      {
        title: "좋아요",
        dataIndex: "likedNum",
        key: "likedNum",
        width: 80,
        align: "right",
      },
      {
        title: "댓글",
        dataIndex: "commentNum",
        key: "commentNum",
        width: 80,
        align: "right",
      },
      {
        title: "작성일",
        dataIndex: "timeSincePostedText",
        key: "timeSincePostedText",
        width: 100,
      },
    ],
    []
  );

  return (
    <div className="w-full">
      <Card title="신고 누적 게시물" className="mb-4">
        <Table
          columns={columns}
          dataSource={posts}
          rowKey="postId"
          loading={loading}
          pagination={false}
          scroll={{ x: 'max-content' }}
          onRow={useCallback(
            (record: HiddenPost) => ({
              onClick: () => handleRowClick(record),
              style: { cursor: "pointer" },
            }),
            [handleRowClick]
          )}
        />
        <div className="mt-4 flex justify-end">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            showSizeChanger
            showTotal={showTotal}
            onChange={handlePaginationChange}
            pageSizeOptions={["10", "20", "50", "100"]}
          />
        </div>
      </Card>

      <PostDetailModal
        postId={selectedPostId}
        visible={modalVisible}
        onClose={handleCloseModal}
        onSuccess={refresh}
        getCategoryName={getCategoryName}
      />
    </div>
  );
};

export default ReportedPosts;
