import { Layout, Menu } from "antd";
import React, { useState } from "react";
import {
  UserOutlined,
  AppstoreOutlined,
  // CalendarOutlined,
  // LinkOutlined,
  // MailOutlined,
  // SettingOutlined,
} from "@ant-design/icons";
import "./sandBox.module.min.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
const { Sider } = Layout;
const iconList = {
  "/home": <UserOutlined />,
  "/user-manage": <UserOutlined />,
  "/user-manage/list": <UserOutlined />,
  "/right-manage": <UserOutlined />,
  "/right-manage/role/list": <UserOutlined />,
  "/right-manage/right/list": <UserOutlined />,
  //.......
};

// const ListName = [
//   { "/home": { title: "首页" } },
//   {
//     "/user-manage": {
//       title: "用户管理",
//       children: [
//         {
//           "/user-manage/list": { title: "用户列表" },
//         },
//       ],
//     },
//   },
//   {
//     "/right-manage": {
//       title: "权限管理",
//       children: [
//         { "/right-manage/role/list": { title: "角色列表" } },
//         { "/right-manage/right/list": { title: "权限列表" } },
//       ],
//     },
//   },
// ];

export default function SideMenu({ isCollapsed }) {
  // 获取路由参数钩子
  const { pathname } = useLocation();
  // 默认 的展开项
  const openKeys = ["/" + pathname.split("/")[1]];

  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);

  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem("token"));
  useEffect(() => {
    axios.get("/rights?_embed=children").then(({ data }) => {
      setMenu(data);
    });
  }, []);
  // 负责检查权限 问题
  // 下面的权限可以提取出来
  // render 函数 负责渲染列表  根据不同的用户权限渲染 不同的列表
  const renderMenu = (menuList) => {
    return menuList.map(({ children, key, title, pagepermisson }) => {
      if (pagepermisson === 0 || !pagepermisson || !rights.includes(key))
        return null;

      return {
        key: key,
        label: title,
        icon: iconList[key] || <AppstoreOutlined></AppstoreOutlined>,
        children: Boolean(children?.length > 0) ? renderMenu(children) : null,
      };
    });
  };
  //
  return (
    <Sider trigger={null} collapsible collapsed={isCollapsed}>
      <div style={{ display: "flex", height: "100%", flexDirection: "column" }}>
        <div className="logo">全球新闻管理系统</div>
        <div style={{ flex: 1, overflow: "auto" }}>
          <Menu
            mode="inline"
            theme="dark"
            items={renderMenu(menu)}
            selectedKeys={pathname}
            defaultOpenKeys={openKeys}
            // openKeys={openKeys}
            // 跳转 理由 点击事件

            onClick={({ key }) => {
              navigate(key, { replace: true });
            }}
          />
        </div>
      </div>
    </Sider>
  );
}
