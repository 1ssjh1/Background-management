import React from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Dropdown, Menu, Space, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import { connect } from "react-redux";

import changeCollApsed from "../../redux/action-saga/TableIsCollApsed";
const { Header } = Layout;
function TopHeader({ isCollapsed, changeCollApsed }) {
  // 跳转
  const navigate = useNavigate();
  // 右上角头像显示
  const menu = (
    <Menu
      items={[
        {
          key: "1",
          label: <div>1st menu item</div>,
        },

        {
          key: "2",
          danger: true,
          label: (
            <div
              onClick={(item) => {
                // localStorage.removeItem("token");
                navigate("/login", { replace: true });
              }}
            >
              退出登录
            </div>
          ),
        },
      ]}
    />
  );
  const { username } = JSON.parse(localStorage.getItem("token"));

  return (
    <Header
      className="site-layout-background"
      style={{
        padding: " 0 24px",
      }}
    >
      {/* 创建dom方式 */}
      {React.createElement(
        isCollapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
        {
          className: "trigger",
          onClick: () => changeCollApsed(),
        }
      )}
      <div style={{ float: "right" }}>
        <span>
          欢迎 <span style={{ color: "#1890ff" }}> {username} </span> 回来
        </span>
        <Dropdown menu={menu}>
          <a onClick={(e) => e.preventDefault()} href="void(0)">
            <Space>
              <Avatar size={32} icon={<UserOutlined />} />
            </Space>
          </a>
        </Dropdown>
      </div>
    </Header>
  );
}
const mapStateToProps = ({ CollApsedReducer: { isCollapsed } }) => {
  return {
    isCollapsed,
  };
};

const mapDispatchToProps = {
  changeCollApsed,
};

export default connect(mapStateToProps, mapDispatchToProps)(TopHeader);
