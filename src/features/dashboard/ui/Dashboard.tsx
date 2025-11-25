import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Card, Statistic, List, Button, Tag, Space } from "antd";
import {
  UserOutlined,
  FileTextOutlined,
  WarningOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { message } from "antd";

import { getHiddenPosts } from "@/features/posts/api";
import type { HiddenPost } from "@/features/posts/model";

const Dashboard = () => {
  const navigate = useNavigate();
  const [recentReports, setRecentReports] = useState<HiddenPost[]>([]);
  const [totalReports, setTotalReports] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getHiddenPosts(1, 5);
        setRecentReports(response.response.hiddenPosts.list);
        setTotalReports(response.response.hiddenPosts.total);
      } catch (error) {
        message.error("데이터를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">대시보드</h1>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <Statistic
            title="신고된 게시글"
            value={totalReports}
            prefix={<WarningOutlined className="text-orange-500" />}
            styles={{
              content: { color: "#fa8c16" },
            }}
          />
          <Button
            type="link"
            className="p-0 mt-2"
            onClick={() => navigate("/posts/reported")}
          >
            관리하기 <ArrowRightOutlined />
          </Button>
        </Card>

        <Card>
          <Statistic
            title="유저 관리"
            prefix={<UserOutlined className="text-blue-500" />}
            styles={{
              content: { color: "#1890ff" },
            }}
          />
          <Button
            type="link"
            className="p-0 mt-2"
            onClick={() => navigate("/users")}
          >
            관리하기 <ArrowRightOutlined />
          </Button>
        </Card>

        <Card>
          <Statistic
            title="게시글 관리"
            prefix={<FileTextOutlined className="text-green-500" />}
            styles={{
              content: { color: "#52c41a" },
            }}
          />
          <Button
            type="link"
            className="p-0 mt-2"
            onClick={() => navigate("/posts")}
          >
            관리하기 <ArrowRightOutlined />
          </Button>
        </Card>
      </div>

      {/* 최근 신고된 게시글 */}
      <Card
        title="최근 신고된 게시글"
        extra={
          <Button type="link" onClick={() => navigate("/posts/reported")}>
            전체 보기 <ArrowRightOutlined />
          </Button>
        }
        loading={loading}
      >
        {recentReports.length > 0 ? (
          <List
            dataSource={recentReports}
            renderItem={(post) => (
              <List.Item
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => navigate(`/posts/reported`)}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <span>{post.title}</span>
                      <Tag color="blue">{post.categoryName}</Tag>
                    </Space>
                  }
                  description={
                    <Space split="|">
                      <span>작성자: {post.author}</span>
                      <span>조회수: {post.viewCount}</span>
                      <span>추천수: {post.likedNum}</span>
                      <span>{post.timeSincePostedText}</span>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <div className="text-center py-8 text-gray-400">
            신고된 게시글이 없습니다.
          </div>
        )}
      </Card>

      {/* 빠른 액션 */}
      <Card title="빠른 액션">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            type="default"
            block
            size="large"
            icon={<WarningOutlined />}
            onClick={() => navigate("/posts/reported")}
          >
            신고된 게시글 관리
          </Button>
          <Button
            type="default"
            block
            size="large"
            icon={<UserOutlined />}
            onClick={() => navigate("/users")}
          >
            유저 관리
          </Button>
          <Button
            type="default"
            block
            size="large"
            icon={<FileTextOutlined />}
            onClick={() => navigate("/notices")}
          >
            공지사항 관리
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
