import React, { useState, useEffect, useRef } from "react";
import { Table, Button, Modal, Switch } from "antd";
import axios from "axios";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import UserForm from "../../../components/user-manage/UserForm";
const { confirm } = Modal;

export default function RoleList() {
  // 存储当前选中的用户
  const [current, setcurrent] = useState(null);
  // 用户跟新
  const [isUpdateDisabled, setisUpdateDisabled] = useState(false);
  // 跟新用户模态框
  const [isUpdateVisible, setisUpdateVisible] = useState(false);
  // user列表信息
  const [dataSource, setdataSource] = useState([]);
  // 对话框状态
  const [confirmLoading] = useState(false);
  const [open, setOpen] = useState(false);
  // 角色信息和起源信息
  const [roleList, setroleList] = useState([]);
  const [regionList, setregionList] = useState([]);
  // 穿透 ref拿到数据
  const addForm = useRef(null);
  // 穿透 ref拿到 更新model的数据
  const updateForm = useRef(null);
  // 显示model 状态

  const columns = [
    {
      title: "区域",
      dataIndex: "region",
      filters: [
        ...regionList.map(({ title, value }) => {
          return {
            text: title,
            value,
          };
        }),
        {
          text: "全球",
          value: "全球",
        },
      ],
      onFilter: (value, record) => record.region === value,
      sorter: (a, b) => {
        return a.role.id - b.role.id;
      },
      sortDirections: ["descend"],
      render: (id) => {
        return <b>{id ? id : "全球"}</b>;
      },
    },
    {
      title: "角色名称",
      dataIndex: "role",
      render: (role) => role.roleName,
    },
    {
      title: "用户名",
      dataIndex: "username",
    },
    {
      title: "用户状态",
      dataIndex: "roleState",

      render: (roleState, item) => {
        return (
          <Switch
            checked={roleState}
            disabled={item.default}
            onClick={() => {
              changeState(item);
            }}
          ></Switch>
        );
      },
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
              onClick={() => {
                confirmMethod(item);
              }}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => handleUpdate(item)}
            />
          </div>
        );
      },
    },
  ];
  // 获取token中的信息
  const {
    region,
    role: { roleType },
  } = JSON.parse(localStorage.getItem("token"));

  // 判断用户类型 显示不同的角色  条件1  根据 role type 监测 权限，只能显示地区

  // axios 请求 信息
  useEffect(() => {
    axios.get("/users?_expand=role").then(({ data }) => {
      if (region === "全球") {
        setdataSource(data);
      } else {
        setdataSource(
          data.filter(({ role: { roleType: number }, region: area }) => {
            return number >= roleType && area === region;
          })
        );
      }

      console.log(data);
    });
  }, [region, roleType]);
  //
  useEffect(() => {
    axios.get("/regions").then((res) => {
      const list = res.data;
      setregionList(list);
    });
  }, []);
  // 角色信息
  useEffect(() => {
    axios.get("/roles").then((res) => {
      const list = res.data;
      setroleList(list);
    });
  }, []);

  // 模态框 的ok  收集表单信息
  const handleOk = () => {
    setOpen(!open);

    addForm.current
      .validateFields()
      .then((value) => {
        //post到后端，生成id，再设置 datasource, 方便后面的删除和更新
        // 充值表单数据
        addForm.current.resetFields();

        axios
          .post(`/users`, {
            ...value,
            roleState: true,
            default: value.roleId === 1 ? true : false,
          })
          .then((res) => {
            setdataSource([
              ...dataSource,
              {
                ...res.data,
                role: roleList.filter((item) => item.id === value.roleId)[0],
              },
            ]);
          });
      })
      .catch(({ errorFields }) => {
        console.log(errorFields);
      });
  };
  // ok后添加 新成员
  // 模态框 的取消
  const handleCancel = () => {
    setOpen(!open);
  };

  // 确认删除
  const confirmMethod = (item) => {
    confirm({
      title: "你确定要删除?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        deleteMethod(item);
        console.log(item);
      },
      onCancel() {
        //   console.log('Cancel');
      },
    });
  };

  //删除
  const deleteMethod = (item) => {
    setdataSource(dataSource.filter((data) => data.id !== item.id));

    axios.delete(`/users/${item.id}`);
  };
  // 改变用户状态
  const changeState = (item) => {
    item.roleState = !item.roleState;
    setdataSource([...dataSource]);
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState,
    });
  };

  // 模态框取消
  const updataCancel = () => {
    setisUpdateVisible(false);
    setisUpdateDisabled(!isUpdateDisabled);
  };
  // 点击修改 按钮
  const handleUpdate = (item) => {
    // updateForm.current.setFieldsValue(item);
    // 这里必须加一个 异步 不然 状态还未跟新 会找不到ref的值
    // 这里的item 会有过多的属性 不过 他会之使用能匹配的item
    // 保持 跟新完全之后 在进行  赋值
    (async () => {
      await setisUpdateVisible(true);
      await updateForm.current.setFieldsValue(item);
      if (item.roleId === 1) {
        //禁用
        setisUpdateDisabled(true);
      } else {
        //取消禁用
        setisUpdateDisabled(false);
      }
    })();
    setcurrent(item.id);
  };

  // 跟新模态框ok
  const updateFormOK = () => {
    updateForm.current.validateFields().then((value) => {
      // console.log(value)
      setisUpdateVisible(false);

      setdataSource(
        dataSource.map((item) => {
          if (item.id === current) {
            return {
              ...item,
              ...value,
              role: roleList.filter((data) => data.id === value.roleId)[0],
            };
          }
          return item;
        })
      );

      axios.patch(`/users/${current}`, value);
      setisUpdateDisabled(!isUpdateDisabled);
    });
  };

  return (
    <div>
      <Button
        onClick={() => {
          setOpen(!open);
        }}
        type="primary"
        size="large"
        icon={<ExclamationCircleOutlined />}
      >
        添加用户
      </Button>
      {/* 添加用户模态框 */}
      <Modal
        title="添加用户"
        okText="确定"
        cancelText="取消"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <UserForm
          regionList={regionList}
          roleList={roleList}
          // 这个 高阶的ref 会到 form里面
          ref={addForm}
        ></UserForm>
      </Modal>
      <Modal
        open={isUpdateVisible}
        title="更新用户"
        okText="更新"
        cancelText="取消"
        onCancel={() => {
          updataCancel();
        }}
        onOk={() => updateFormOK()}
      >
        <UserForm
          regionList={regionList}
          roleList={roleList}
          ref={updateForm}
          isUpdateDisabled={isUpdateDisabled}
          isUpdate={true}
        ></UserForm>
      </Modal>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item.id}
      ></Table>
    </div>
  );
}
