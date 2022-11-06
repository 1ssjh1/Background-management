import React from "react";
import SideMenu from "../../components/sandbox/SideMenu";
import TopHeader from "../../components/sandbox/TopHeader";
import { Outlet } from "react-router-dom";
import { Layout } from "antd";

import NProgress from "nprogress";
// 要引入css
import "nprogress/nprogress.css";

import "./sandBox.scss";
import { useEffect } from "react";
import { connect } from "react-redux";
import changeCollApsed from "../../redux/action-saga/TableIsCollApsed";
const { Content } = Layout;

function SandBox({ isCollapsed }) {
  // 一进来就加载
  // 挂载完毕之后 就停止
  NProgress.start();
  useEffect(() => {
    NProgress.done();
  });
  return (
    <Layout className="sandBox">
      <SideMenu isCollapsed={isCollapsed}></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content
          className="site-layout-background"
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            overflow: "auto",
          }}
        >
          <Outlet></Outlet>
        </Content>
      </Layout>

      {/* 设置占位 容器 相当于 v5里面的写switch 去匹配每个 路由 */}
    </Layout>
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
export default connect(mapStateToProps, mapDispatchToProps)(SandBox);
