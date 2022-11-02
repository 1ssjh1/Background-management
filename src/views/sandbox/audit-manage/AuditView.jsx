import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, notification } from "antd";
import { useNavigate } from "react-router-dom";

export default function AuditView() {
  const navigate = useNavigate();

  const [dataSource, setdataSource] = useState([]);
  const { roleId, region, username } = JSON.parse(
    localStorage.getItem("token")
  );
  useEffect(() => {
    const roleObj = {
      1: "superadmin",
      2: "admin",
      3: "editor",
    };
    axios.get(`/news?auditState=1&_expand=category`).then((res) => {
      const list = res.data;
      setdataSource(
        roleObj[roleId] === "superadmin"
          ? list
          : [
              ...list.filter((item) => item.author === username),
              ...list.filter(
                (item) =>
                  item.region === region && roleObj[item.roleId] === "editor"
              ),
            ]
      );
    });
  }, [roleId, region, username]);

  const columns = [
    {
      title: "新闻标题",
      dataIndex: "title",
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>;
      },
    },
    {
      title: "作者",
      dataIndex: "author",
    },
    {
      title: "新闻分类",
      dataIndex: "category",
      render: (category, item) => {
        return <div>{item.categoryId}</div>;
      },
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Button type="primary" onClick={() => handleAudit(item, 2, 1)}>
              通过
            </Button>
            <Button danger onClick={() => handleAudit(item, 3, 0)}>
              驳回
            </Button>
          </div>
        );
      },
    },
  ];

  const handleAudit = (item, auditState, publishState) => {
    setdataSource(dataSource.filter((data) => data.id !== item.id));
    notification.info({
      message: `通知`,
      description: `您可以到[审核管理/审核列表]中查看您的新闻的审核状态`,
      placement: "bottomRight",
    });
    setTimeout(() => {
      axios
        .patch(`/news/${item.id}`, {
          auditState,
          publishState,
        })
        .then(() => {
          navigate("/audit-manage/list", { replace: true });
        });
    }, 2000);
  };
  return (
    <div>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: 5,
        }}
        rowKey={(item) => item.id}
      />
    </div>
  );
}
