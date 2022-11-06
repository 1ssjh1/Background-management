import React, { useEffect } from "react";
// 各个组件
import SandBox from "../views/sandbox/SandBox";
import LoginView from "../views/login/LoginView";

// 分理出需要动态渲染的 路由
import NewRouter from "./NewsRouter";
import { Route, Routes, useNavigate, useRoutes } from "react-router-dom";

// export default function IndexRouter() {
//   return useRoutes([
//     {
//       path: "/",
//       element: (
//         <AuthComponent>
//           <SandBox></SandBox>
//         </AuthComponent>
//       ),
//       children: routers,
//     },
//     {
//       path: "/login",
//       element: <LoginView />,
//     },
//   ]);
// }
// //判断是否有token组件
// function AuthComponent({ children }) {
//   return localStorage.getItem("token") ? children : <Redirect to="/login" />;
// }

// export default function IndexRouter() {
//   return useRoutes([
//     {
//       path: "/",
//       element: <NewRouter />,
//     },
//     {
//       path: "/login",
//       element: <LoginView />,
//     },
//   ]);
// }

function IndexRouter() {
  return (
    <Routes>
      <Route path="/*" element={<BaseRoute></BaseRoute>}></Route>
    </Routes>
  );
}
// { path: "*", element: <NoperMission></NoperMission> },

const BaseRoute = () => {
  return useRoutes([
    {
      path: "/*",
      element: (
        <AuthComponent>
          <SandBox></SandBox>
        </AuthComponent>
      ),
      children: [{ path: "*", element: <NewRouter></NewRouter> }],
    },
    {
      path: "/login",
      element: <LoginView />,
    },
  ]);
};

function AuthComponent({ children }) {
  return localStorage.getItem("token") ? children : <Redirect to="/login" />;
}

function Redirect({ to }) {
  const navigate = useNavigate();
  useEffect(() => {
    navigate(to, { replace: true });
  });
  return null;
}

export default IndexRouter;
// export default function IndexRouter() {
//   return (
//     <Routes>
//       {/* 😊film占位 */}
//       <Route path="/films" element={LazyLoad("Film")}>
//         {/* 指定默认路由 */}
//         <Route index element={<Navigate to="/films/NowPlaying" />} />
//         <Route
//           path="/films/NowPlaying"
//           element={LazyLoad("films/NowPlaying")}
//         />
//         {/* 相对路径也管用 */}
//         <Route path="ComingSoon" element={LazyLoad("films/NowPlaying")} />
//       </Route>
//       <Route path="/cinemas" element={LazyLoad("Cinema")} />

//       {/*  判断是否登录 */}
//       <Route
//         path="/center"
//         element={
//           <AuthComponent>
//             <Center></Center>
//           </AuthComponent>
//         }
//       />
//       <Route path="/detail/:myId" element={LazyLoad("Detail")} />

//       {/* 登录界面 */}
//       {/* 静态路由  */}
//       {/* <Route path="/detail" element={<Detail />} /> */}
//       {/* 动态路由  */}
//       <Route path="/login" element={LazyLoad("Login")} />

//       <Route path="/" element={<Redirect to="/films" />} />
//       <Route path="*" element={<NotFound />} />
//       {/* <Route path="*"element={<Navigate to="/films"/>} /> */}
//     </Routes>
//   );
// }

//判断是否有token组件

// 重定向组件

// const GetAllRoutes = () => {
//   return useRoutes([
//     { path: "/home", element: <HomeView></HomeView> },
//     { path: "/user-manage/list", element: <UserList></UserList> },
//     { path: "/right-manage/role/list", element: <RoleList></RoleList> },
//     { path: "/right-manage/right/list", element: <RightList></RightList> },
//     { path: "/", element: <Navigate to="/home" /> },
//     { path: "*", element: <NoperMission></NoperMission> },
//   ]);
// };

// console.log(GetAllRoutes);
// return useRoutes([
//   {
//     path: "/",
//     element: (
//       <AuthComponent>
//         <SandBox></SandBox>
//       </AuthComponent>
//     ),
//     children: [
//       { path: "/home", element: <HomeView></HomeView> },
//       { path: "/user-manage/list", element: <UserList></UserList> },
//       { path: "/right-manage/role/list", element: <RoleList></RoleList> },
//       { path: "/right-manage/right/list", element: <RightList></RightList> },
//       { path: "/", element: <Navigate to="/home" /> },
//       { path: "*", element: <NoperMission></NoperMission> },
//     ],
//   },
//   {
//     path: "/login",
//     element: <LoginView />,
//   },
// ]);
