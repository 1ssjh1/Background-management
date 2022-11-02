import { useEffect, useState } from "react";
import axios from "axios";
// import { useMemo } from "react";
import { notification } from "antd";

function usePublish(props) {
  const { username } = JSON.parse(localStorage.getItem("token"));
  // 对象作为引用 用useMemo解决一直跟新问题  会确保每次的引用不会改变
  //   const obj = useMemo(() => props, [props.type]);
  const [dataSource, setdataSource] = useState([]);
  useEffect(() => {
    axios(
      `/news?author=${username}&publishState=${props.type}&_expand=category`
    ).then((res) => {
      setdataSource(res.data);
    });
  }, [username, props.type]);

  const handlePublish = (id) => {
    setdataSource(dataSource.filter((item) => item.id !== id));
    notification.info({
      message: `通知`,
      description: `您可以到【发布管理/已经发布】中查看您的新闻`,
      placement: "bottomRight",
    });
    setTimeout(() => {
      axios.patch(`/news/${id}`, {
        publishState: 2,
        publishTime: Date.now(),
      });
    }, 2000);
  };

  const handleSunset = (id) => {
    setdataSource(dataSource.filter((item) => item.id !== id));
    notification.info({
      message: `通知`,
      description: `您可以到【发布管理/已下线】中查看您的新闻`,
      placement: "bottomRight",
    });
    setTimeout(() => {
      axios.patch(`/news/${id}`, {
        publishState: 3,
      });
    }, 2000);
  };

  const handleDelete = (id) => {
    setdataSource(dataSource.filter((item) => item.id !== id));
    notification.info({
      message: `通知`,
      description: `您已经删除了已下线的新闻`,
      placement: "bottomRight",
    });
    setTimeout(() => {
      axios.delete(`/news/${id}`);
    }, 2000);
  };

  return {
    dataSource,
    handlePublish,
    handleSunset,
    handleDelete,
  };
}

export default usePublish;
