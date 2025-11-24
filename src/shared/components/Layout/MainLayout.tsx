import { Layout } from "antd";
import { useState } from "react";
import Sidebar from "./Sidebar";

const { Content } = Layout;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <main className="flex flex-row">
      <Sidebar collapsed={collapsed} onCollapse={setCollapsed} />
      <Layout
        style={{
          marginLeft: collapsed ? 80 : 250,
          minHeight: "100dvh",
          transition: "margin-left 0.2s",
          width: "100%",
        }}
      >
        <Content
          className="relative max-w-[1200px] w-full mx-auto"
          style={{
            padding: 24,
          }}
        >
          {children}
        </Content>
      </Layout>
    </main>
  );
};

export default MainLayout;

