import React, { useEffect, useState } from "react";
import axios from "axios";
import { Spin } from "antd";
import NoperMission from "../views/sandbox/nopermission/NoperMission";
import HomeView from "../views/sandbox/home/HomeView";
import RightList from "../views/sandbox/right-manage/RightList";
import RoleList from "../views/sandbox/right-manage//RoleList";
import UserList from "../views/sandbox/user-manage/UserList";
import NewsAdd from "../views/sandbox/news-manage/NewsAdd";
import NewsDraft from "../views/sandbox/news-manage/NewsDraft";
import NewsCategory from "../views/sandbox/news-manage/NewsCategory";
import AuditList from "../views/sandbox/audit-manage/AuditList";
import AuditView from "../views/sandbox/audit-manage//AuditView";
import Unpublished from "../views/sandbox/publish-manage/Unpublished";
import PublishedView from "../views/sandbox/publish-manage/PublishedView";
import SunsetView from "../views/sandbox/publish-manage/SunsetView";
import NewsPreview from "../views/sandbox/news-manage/NewsPreview";
import NewsUpdate from "../views/sandbox/news-manage/NewsUpdate";
import { useRoutes } from "react-router-dom";
import { connect } from "react-redux";
// 设置本地路由表 根据本地映射来渲染
const LocalRouterMap = {
  "/home": <HomeView></HomeView>,
  "/user-manage/list": <UserList></UserList>,
  "/right-manage/role/list": <RoleList></RoleList>,
  "/right-manage/right/list": <RightList></RightList>,
  "/news-manage/add": <NewsAdd></NewsAdd>,
  "/news-manage/draft": <NewsDraft></NewsDraft>,
  "/news-manage/category": <NewsCategory></NewsCategory>,
  "/news-manage/preview/:id": <NewsPreview></NewsPreview>,
  "/news-manage/update/:id": <NewsUpdate></NewsUpdate>,
  "/audit-manage/audit": <AuditView></AuditView>,
  "/audit-manage/list": <AuditList></AuditList>,
  "/publish-manage/unpublished": <Unpublished></Unpublished>,
  "/publish-manage/published": <PublishedView></PublishedView>,
  "/publish-manage/sunset": <SunsetView></SunsetView>,
};

// const routers = [
//   { path: "/home", element: <HomeView></HomeView> },
//   { path: "/user-manage/list", element: <UserList></UserList> },
//   { path: "/right-manage/role/list", element: <RoleList></RoleList> },
//   { path: "/right-manage/right/list", element: <RightList></RightList> },
//   { path: "", element: <Navigate to="/home" /> },
//   { path: "*", element: <NoperMission></NoperMission> },
// ];

const NewRouter = ({ isLoading }) => {
  // 请求回来的动态路由 数据
  const [BackRouteList, setBackRouteList] = useState([]);

  useEffect(() => {
    Promise.all([axios.get("/rights"), axios.get("/children")]).then((res) => {
      setBackRouteList([...res[0].data, ...res[1].data]);
    });
  }, []);
  // 结构用户的权限
  const {
    role: { rights },
  } = JSON.parse(localStorage.getItem("token"));

  // 两个检查路由函数
  const checkRoute = (item) => {
    // console.log(item.pagepermisson);
    // console.log();/
    return (
      LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    );
  };
  const checkUserPermission = (item) => {
    return rights.includes(item.key);
  };

  // 动态渲染出数据
  //  利用  checkRoute 检查侧边连是否有权限左  用checkuser检查 是否能通过路由进入
  return (
    <Spin size="large" spinning={isLoading}>
      {useRoutes([
        ...BackRouteList.filter((item) => {
          if (checkRoute(item) && checkUserPermission(item)) return true;
          return false;
        }).map(({ key }) => {
          return {
            path: key,
            element: LocalRouterMap[key],
          };
        }),
        { path: "", element: <HomeView></HomeView> },

        { path: "*", element: <NoperMission></NoperMission> },
      ])}
    </Spin>
  );
};

const mapStateToProps = ({ LoadingReducer: { isLoading } }) => {
  return { isLoading };
};

export default connect(mapStateToProps)(NewRouter);
