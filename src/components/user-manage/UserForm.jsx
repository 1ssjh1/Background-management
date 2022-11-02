import React, { forwardRef, useState } from "react";
import { Select, Form, Input } from "antd";
import { useEffect } from "react";

const { Option } = Select;
const UserForm = (
  { roleList, regionList, isUpdateDisabled, isUpdate },
  ref
) => {
  // 是否禁用
  const [isDisabled, setisDisabled] = useState(false);
  // 用户token信息
  const { region } = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    setisDisabled(isUpdateDisabled);
  }, [isUpdateDisabled]);

  // 表单的提交
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  // 表单的未提交

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // 切换管理员角色
  const changeUser = (value) => {
    if (value === 1) {
      setisDisabled(true);

      ref.current.setFieldsValue({
        region: "全球",
      });
    } else {
      setisDisabled(false);
    }
  };

  //  因为公用一个组件所需要判断传入的 是更新 还是创建
  // 判断 区域禁用

  const checkRegionDisabled = (id, value) => {
    if (region === "全球") {
      return false;
    } else {
      return isUpdate ? true : region !== value;
    }
  };
  // 判断用户类型禁用
  const checkRoleDisabled = (id) => (region === "全球" ? false : id !== 3);

  return (
    <Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      ref={ref}
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: "Please input the title of collection!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: "Please input the title of collection!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="region" label="区域">
        <Select disabled={isDisabled}>
          {regionList.map(({ id, value }) => (
            <Option
              value={value}
              key={id}
              title={value}
              disabled={checkRegionDisabled(id, value)}
            >
              {value}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[
          {
            required: true,
            message: "Please input the title of collection!",
          },
        ]}
      >
        <Select onChange={changeUser}>
          {roleList.map(({ id, roleName }) => (
            <Option
              value={id}
              key={id}
              disabled={checkRoleDisabled(id, roleName)}
            >
              {roleName}
            </Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};
export default forwardRef(UserForm);
