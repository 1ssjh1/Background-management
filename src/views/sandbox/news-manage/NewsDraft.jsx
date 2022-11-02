import React, { useState, useEffect } from "react";
import { Table, Button, Modal, notification } from "antd";
import axios from "axios";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { NavLink, useNavigate } from "react-router-dom";

const { confirm } = Modal;
export default function NewsDraft() {
  const [dataSource, setdataSource] = useState([]);
  const navigate = useNavigate();
  // 拿到 用户数据
  const { username } = JSON.parse(localStorage.getItem("token"));

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id) => {
        return <b>{id}</b>;
      },
    },
    {
      title: "新闻标题",
      dataIndex: "title",
      render: (title, item) => {
        return (
          <NavLink to={`/news-manage/preview/${item.id}`}>{title}</NavLink>
        );
      },
    },
    {
      title: "作者",
      dataIndex: "author",
      render: (item) => {
        return item;
      },
    },
    {
      title: "分类",
      dataIndex: "categoryId",
      render: (categoryId) => {
        return categoryId;
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
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => {
                navigate(`/news-manage/update/${item.id}`, { replace: false });
              }}
            />

            <Button
              type="primary"
              shape="circle"
              icon={
                <UploadOutlined
                  onClick={() => {
                    handleCheck(item);
                  }}
                />
              }
            />
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    axios
      .get(`/news?author=${username}&auditState=0&_expand=category`)
      .then((res) => {
        const list = res.data;
        setdataSource(list);
      });
  }, [username]);

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
    setdataSource(dataSource.filter((data) => data.id !== item.id));
    // axios.delete(`/news/${item.id}`);
  };

  // 传递到审核列表

  const handleCheck = ({ id }) => {
    axios
      .patch(`/news/${id}`, {
        auditState: 1,
      })
      .then((res) => {
        navigate("/audit-manage/list", { replace: true });

        notification.info({
          message: `通知`,
          description: `您可以到${"审核列表"}中查看您的新闻`,
          placement: "bottomRight",
        });
      });
  };
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey={(item) => item.id}
      ></Table>
    </div>
  );
}
