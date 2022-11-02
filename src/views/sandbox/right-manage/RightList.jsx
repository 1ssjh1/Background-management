import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Tag, Popover, Switch } from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import axios from "axios";
// 结构出确认框
const { confirm } = Modal;

export default function RightList() {
  const [dataSource, setdataSource] = useState([]);
  // 改变状态框
  //  为啥 结构赋值 之后就不行
  const switchMethod = (item) => {
    //pagepermisson = !pagepermisson;
    item.pagepermisson = Boolean(item.pagepermisson) ? 0 : 1;
    setdataSource([...dataSource]);
    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`, {
        pagepermisson: item.pagepermisson,
      });
    } else {
      axios.patch(`/children/${item.id}`, {
        pagepermisson: item.pagepermisson,
      });
    }
  };

  // 删除提示框
  const showConfirm = (item) => {
    confirm({
      title: "你确定要删除",
      icon: <ExclamationCircleOutlined />,
      content: "Some descriptions",
      onOk() {
        // 删除本地 +删除后端
        let key = [item.key];
        setdataSource(deleteMethod(key, dataSource));
      },
      onCancel() {
        alert("好自为之");
      },
    });
  };
  // 删除函数
  const deleteMethod = (code, dataSource) => {
    return dataSource
      .filter((item) => code.indexOf(item.key) === -1)
      .map((item) => {
        item.children = item.children
          ? deleteMethod(code, item.children)
          : null;

        return item;
      });
  };
  // const filterMenu = (menuList, menuCode) => {
  //   return menuList
  //     .filter((item) => {
  //       return menuCode.indexOf(item.key) === -1;
  //     })
  //     .map((item) => {
  //       // item = Object.assign({}, item);
  //       if (item.children) {
  //         item.children = filterMenu(item.children, menuCode);
  //       }
  //       return item;
  //     });
  // };

  // 指定表格规则
  // 通过render 属性 返沪i一个 函数 去定制效果
  // text, record, index 返回 dataindex  和本身数据 和索引
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "权限名称",
      dataIndex: "title",
    },
    {
      title: "权限路径",
      dataIndex: "key",
      render: (key) => <Tag color="orange">{key}</Tag>,
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Button
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => showConfirm(item)}
            />

            <Popover
              content={
                <div style={{ textAlign: "center" }}>
                  <Switch
                    checked={item.pagepermisson}
                    onChange={() => switchMethod(item)}
                  ></Switch>
                </div>
              }
              title="页面配置项"
              trigger={item.pagepermisson === undefined ? "" : "click"}
            >
              <Button
                type="primary"
                shape="circle"
                icon={<EditOutlined />}
                disabled={item.pagepermisson === undefined}
              />
            </Popover>
          </div>
        );
      },
    },
  ];

  // 拿回用户列表的 数据
  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      const list = res.data;
      list.forEach((item) => {
        if (item.children.length === 0) {
          item.children = "";
        }
      });
      console.log(list);
      setdataSource(list);
    });
  }, []);
  // useEffect(() => {
  //   axios.get("/rights?_embed=children").then((res) => {
  //     const list = res.data;
  //     list.forEach((item) => {
  //       if (item.children.length === 0) {
  //         item.children = "";
  //       }
  //     });
  //     setdataSource(list);
  //   });
  // }, []);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 4 }}
        indentSize={25}
      />
    </div>
  );
}

// 菜单列表
// const menuList = [
//   {
//     name: "系统管理",
//     code: "system_manage",
//     children: [
//       {
//         name: "用户管理",
//         code: "user_manage",
//         children: [
//           {
//             name: "添加用户",
//             code: "add_user",
//           },
//           {
//             name: "编辑用户",
//             code: "edit_user",
//           },
//           {
//             name: "删除用户",
//             code: "del_user",
//           },
//         ],
//       },
//       {
//         name: "角色管理",
//         code: "role_manage",
//         children: [
//           {
//             name: "添加角色",
//             code: "add_role",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     name: "业务管理",
//     code: "bus_manage",
//     children: [
//       {
//         name: "流程管理",
//         code: "process_manage",
//       },
//     ],
//   },
//   {
//     name: "订单管理",
//     code: "order_manage",
//   },
// ];

// // 权限列表
// const myMenuCode = ["system_manage", "user_manage", "add_user", "order_manage"];

// const filterMenu = (menuList, menuCode) => {
//   return menuList
//     .filter((item) => {
//       return menuCode.indexOf(item.code) > -1;
//     })
//     .map((item) => {
//       // item = Object.assign({}, item);
//       if (item.children) {
//         item.children = filterMenu(item.children, menuCode);
//       }
//       return item;
//     });
// };

// // 过滤后的菜单
// const myMenu = filterMenu(menuList, myMenuCode);

// console.log(myMenu);

//改变 状态函数
