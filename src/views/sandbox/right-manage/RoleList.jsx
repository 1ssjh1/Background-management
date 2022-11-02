import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Tree } from "antd";
import axios from "axios";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
const { confirm } = Modal;
export default function RoleList() {
  const [dataSource, setdataSource] = useState([]);
  // rightlist  树形结构的总信息
  const [rightList, setRightList] = useState([]);
  // currentRights ,每种用户对应的权限信息
  const [currentRights, setcurrentRights] = useState([]);
  // 存储选中id
  const [currentId, setcurrentId] = useState(0);

  // 显示model 状态
  const [isModalVisible, setisModalVisible] = useState(false);
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => {
        return <b>{id}</b>;
      },
    },
    {
      title: "角色名称",
      dataIndex: "roleName",
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
              onClick={() => confirmMethod(item)}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                setisModalVisible(true);
                setcurrentRights(item.rights);
                setcurrentId(item.id);
              }}
            />
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    axios.get("/roles").then((res) => {
      // console.log(res.data)
      setdataSource(res.data);
    });
  }, []);
  // rightlist数据
  useEffect(() => {
    axios.get("/rights?_embed=children").then((res) => {
      // console.log(res.data)
      setRightList(res.data);
    });
  }, []);

  // 确认删除
  const confirmMethod = (item) => {
    confirm({
      title: "你确定要删除?",
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      onOk() {
        //   console.log('OK');
        deleteMethod(item);
      },
      onCancel() {
        //   console.log('Cancel');
      },
    });
  };
  //删除
  const deleteMethod = (item) => {
    // console.log(item)
    setdataSource(dataSource.filter((data) => data.id !== item.id));
    // axios.delete(`/roles/${item.id}`);
  };
  // module canle函数
  const handleCancel = () => {
    setisModalVisible(false);
  };
  // module  ok 函数
  const handleOk = () => {
    // setdataSource(
    //   dataSource.map((item) => {
    //     if (item.id === currentId) {
    //       console.log(item.rights);
    //       item.rights = currentRights;

    //       return item;
    //     }
    //     return item;
    //   })
    // );
    // 别去给原数据改了

    setdataSource(
      dataSource.map((item) =>
        item.id === currentId
          ? {
              ...item,
              rights: currentRights,
            }
          : item
      )
    );

    axios.patch(`/roles/${currentId}`, {
      rights: currentRights,
    });
    setisModalVisible(false);
  };

  // 树状结构展开和 选择

  const onSelect = (selectedKeys, info) => {
    console.log("selected", selectedKeys, info);
  };
  const onCheck = ({ checked }) => {
    // checkedKeys 会返回点击后剩余的 权限
    // console.log("onCheck", checkedKeys, info);
    setcurrentRights(checked);
    console.log(dataSource);
  };
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item.id}
      ></Table>
      <Modal
        title="权限分配"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Tree
          checkable
          // 第一个是默认选择 ，第二个是默认展开 ，第三个是默认高亮
          // default 非受控的会出事
          // defaultCheckedKeys={currentRights}
          checkedKeys={currentRights}
          defaultExpandedKeys={["/right-manage"]}
          defaultSelectedKeys={["/user-manage/update"]}
          onSelect={onSelect}
          onCheck={onCheck}
          // 取消关联属性  不然当一级路径选择时候  二级会自动全选  例：区域编辑的全选会出问题
          checkStrictly={true}
          // onExpand={onExpand}
          // expandedKeys={expandedKeys}
          // autoExpandParent={autoExpandParent}
          // onCheck={onCheck}
          // checkedKeys={checkedKeys}
          // onSelect={onSelect}
          // selectedKeys={selectedKeys}
          treeData={rightList}
        />
      </Modal>
    </div>
  );
}
