import React, { useContext, useEffect, useRef, useState } from "react";
import { Modal, Button, Form, Input, Table } from "antd";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

import axios from "axios";
// 结构出确认框
const { confirm } = Modal;
const EditableContext = React.createContext(null);

export default function NewsCategory() {
  const [dataSource, setdataSource] = useState([]);

  // 拿回 新闻分类的数据
  useEffect(() => {
    axios.get("/categories").then((res) => {
      const list = res.data;
      // list.forEach((item) => {
      //   if (item.children.length === 0) {
      //     item.children = "";
      //   }
      // });
      setdataSource(list);
    });
  }, []);
  // 改变状态框

  // 删除提示框

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
    setdataSource(dataSource.filter((data) => data.id !== item.id));
    // axios.delete(`/categories/${item.id}`);
  };
  // handleSave 处理
  const handleSave = ({ id, title }) => {
    // 遍历数据 修改对应的 value

    setdataSource(
      dataSource.map((item) => {
        if (item.id === id) {
          return {
            id: id,
            title,
            value: title,
          };
        }
        return item;
      })
    );
    axios.patch(`/categories/${id}`, {
      title: title,
      value: title,
    });
  };
  // 渲染列表   加入 editable 列表
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
    },
    {
      title: "权限名称",
      dataIndex: "title",
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: "title",
        title: "权限名称",
        handleSave,
      }),
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
          </div>
        );
      },
    },
  ];

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    // console.log(restProps);
    // console.log(record);
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();

        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log("Save failed:", errInfo);
      }
    };
    let childNode = children;
    // 创建子节点
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      pagination={{ pageSize: 4 }}
      indentSize={25}
      // 配置 组件条件
      components={components}
      rowKey={(item) => item.id}
    />
  );
}
