import React, { useState, useEffect } from "react";
import {
  PageHeader,
  Steps,
  Button,
  Form,
  Input,
  Checkbox,
  Select,
  message,
  notification,
} from "antd";
import style from "./index.module.css";
import axios from "axios";
import NewsEditor from "../../../components/news-manage/NewsEditor";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
const { Step } = Steps;
const { Option } = Select;
export default function NewsAdd() {
  // 路由跳转
  const navigate = useNavigate();
  // 存储 的数据 代表现在是添加文章的第几步
  const [current, setCurrent] = useState(0);
  //  存储的数据代表 文章的类别
  const [categoryList, setCategoryList] = useState([]);

  // 表单信息
  const [formInfo, setformInfo] = useState({});
  // 保存子组件传来的模板信息
  const [content, setContent] = useState("");

  // 创建第一步 中的两个表单的ref
  const NewForm = useRef();

  // 拿到用户信息
  const User = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    axios.get("/categories").then((res) => {
      setCategoryList(res.data);
    });
  }, []);

  // 点击下一步
  const handleNext = () => {
    if (current === 0) {
      NewForm.current
        .validateFields()
        .then((res) => {
          setCurrent(current + 1);
          setformInfo(res);
        })
        .catch((res) => {
          console.log(res);
        });
    } else {
      if (content === "<p></p>\n") {
        message.warning("This is a warning message");
        return 1;
      }
      setCurrent(current + 1);
    }
  };

  // 点击上一步
  const handlePrevious = () => {
    setCurrent(current - 1);
  };
  //  保存草稿箱     提交审核

  const handleSave = (auditState) => {
    console.log(formInfo, User);
    axios
      .post("/news", {
        ...formInfo,
        content: content,
        region: User.region ? User.region : "全球",
        author: User.username,
        roleId: User.roleId,
        // 0 草稿箱 1审核中 2审核通过  3审核拒绝
        auditState: auditState,
        // 0 未发布 1发布了
        publishState: 0,
        createTime: Date.now(),
        star: 0,
        view: 0,
        // "publishTime": 0
      })
      .then((res) => {
        notification.info({
          message: `通知`,
          description: `您可以到${
            auditState === 0 ? "草稿箱" : "审核列表"
          }中查看您的新闻`,
          placement: "bottomRight",
        });
        setTimeout(() => {
          navigate(
            auditState === 0 ? "/news-manage/draft" : "/audit-manage/list",
            {
              replace: true,
            }
          );
        }, 2000);
        // notification 提示框
      });
  };
  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => null}
        title="撰写新闻"
        subTitle="This is a subtitle"
      />
      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主体内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>

      {/* 每一步对应的 表单内容   用display 和hidden操作 */}

      <div style={{ marginTop: "50px" }}>
        <div className={current === 0 ? "" : style.active}>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
            initialValues={{ remember: true }}
            autoComplete="off"
            ref={NewForm}
          >
            <Form.Item
              label="新闻标题"
              name="title"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="新闻分类"
              name="categoryId"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Select>
                {categoryList.map((item) => {
                  return <Option key={item.value}>{item.value}</Option>;
                })}
              </Select>
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 17, span: 5 }}
            >
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
          </Form>
        </div>
        <div className={current === 1 ? "" : style.active}>
          {/* 子组件翻译出来的 html结构 用getContent 接收子组件的消息 */}
          <NewsEditor
            getContent={(value) => {
              setContent(value);
            }}
          ></NewsEditor>
        </div>
        <div className={current === 2 ? "" : style.active}>123</div>
      </div>

      {/* 下面的 草稿箱 上一步 下一步 根据不同的currten进行选择 */}
      <div style={{ marginTop: "50px" }}>
        {current === 2 && (
          <span>
            <Button type="primary" onClick={() => handleSave(0)}>
              保存草稿箱
            </Button>
            <Button danger onClick={() => handleSave(1)}>
              提交审核
            </Button>
          </span>
        )}
        {current < 2 && (
          <Button type="primary" onClick={handleNext}>
            下一步
          </Button>
        )}
        {current > 0 && <Button onClick={handlePrevious}>上一步</Button>}
      </div>
    </div>
  );
}
