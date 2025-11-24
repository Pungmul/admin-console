import { Layout, Menu, Button } from "antd";
import type { MenuProps } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { useAuth } from "@/features/auth/hooks/useAuth";
import "./Sidebar.css";
import { useCallback } from "react";

const { Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

interface SidebarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const menuItems: MenuItem[] = [
  {
    key: "/",
    label: "대시보드",
  },
  {
    key: "user-management",
    label: "유저 관리",
    children: [
      {
        key: "/users",
        label: "가입 유저 목록",
      },
      {
        key: "/users/sanctions",
        label: "유저 제재 관리",
      },
    ],
  },
  {
    key: "post-management",
    label: "게시글 관리",
    children: [
      {
        key: "/posts/reported",
        label: "신고 누적 게시물",
      },
      {
        key: "/posts",
        label: "일반 게시글 조회",
      },
    ],
  },
  {
    key: "/notices",
    label: "공지사항",
  },
];

const Sidebar = ({ collapsed, onCollapse }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    navigate(e.key as string);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 현재 경로에 맞는 selectedKeys와 openKeys 설정
  const getSelectedKeys = useCallback(() => {
    const path = location.pathname;
    const keys: string[] = [];

    // 직접 매칭되는 키 찾기
    menuItems.forEach((item) => {
      if (!item) return;
      if ("children" in item && item.children) {
        item.children.forEach((child) => {
          if (
            child &&
            typeof child === "object" &&
            "key" in child &&
            child.key === path
          ) {
            keys.push(child.key as string);
          }
        });
      } else if (
        typeof item === "object" &&
        "key" in item &&
        item.key === path
      ) {
        keys.push(item.key as string);
      }
    });

    return keys.length > 0 ? keys : ["/"];
  }, [location.pathname]);

  const getOpenKeys = useCallback(() => {
    const path = location.pathname;
    const openKeys: string[] = [];

    if (path.startsWith("/users")) {
      openKeys.push("user-management");
    } else if (path.startsWith("/posts")) {
      openKeys.push("post-management");
    }

    return openKeys;
  }, [location.pathname]);

  return (
    <Sider
      collapsed={collapsed}
      width={250}
      collapsedWidth={80}
      className="bg-gray-100!"
      style={{
        overflow: "auto",
        height: "100dvh",
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        transition: "width 0.2s",
      }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div
          className={`font-bold text-gray-500 ${
            collapsed ? "hidden" : "block"
          }`}
        >
          풍덩 관리자 콘솔
        </div>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => onCollapse(!collapsed)}
          className="text-gray-500 hover:bg-gray-100"
        />
      </div>
      <Menu
        classNames={{
          item: "hover:bg-blue-200! active:bg-blue-200!",
          itemTitle: "hover:bg-blue-200! active:bg-blue-200!",
          subMenu: {
            list: "bg-gray-100!",
            item: "hover:bg-blue-200! active:bg-blue-200!",
            itemTitle: "hover:bg-blue-200! active:bg-blue-200!",
          },
        }}
        mode="inline"
        selectedKeys={getSelectedKeys()}
        defaultOpenKeys={getOpenKeys()}
        items={menuItems}
        onClick={handleMenuClick}
        className="bg-gray-100! border-none!"
      />

      <div className="m-1 mt-4">
        <Button
          type="primary"
          danger
          block
          onClick={handleLogout}
          className="bg-red-300 text-red-900 border-red-300 hover:bg-red-400 hover:border-red-400 p-5!"
        >
          로그아웃
        </Button>
      </div>
    </Sider>
  );
};

export default Sidebar;
