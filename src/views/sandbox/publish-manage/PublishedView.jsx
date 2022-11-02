import React from "react";
import { Button } from "antd";
import NewsPublish from "../../../components/publish-manage/NewsPublish";
import usePublish from "../../../components/publish-manage/usePublish";

export default function PublishedView() {
  const { dataSource, handleSunset } = usePublish({ type: 2 });
  return (
    // 通过插槽的方式传递组件进去
    <div>
      {dataSource && (
        <NewsPublish dataSource={dataSource}>
          {/* 此方法给插槽传参数 */}
          {(id) => (
            <Button
              type="primary"
              onClick={() => {
                handleSunset(id);
              }}
            >
              下线
            </Button>
          )}
        </NewsPublish>
      )}
    </div>
  );
}
