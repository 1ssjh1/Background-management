import React, { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { convertToRaw, EditorState, ContentState } from "draft-js";

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from "draftjs-to-html";
import { useEffect } from "react";
import htmlToDraft from "html-to-draftjs";

export default function NewsEditor(props) {
  // 受控组件的 文本编辑器 内容
  const [editorState, setEditorState] = useState("");
  useEffect(() => {
    // console.log(props.content)
    // html-===> draft,

    // 固定格式 html 转为draft
    const html = props.content;
    // 没有就算了
    if (html === undefined) return;
    const contentBlock = htmlToDraft(html);
    // 有就存入contentBlock
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      // 存入state 受控组件触发
      setEditorState(editorState);
    }
  }, [props.content]);

  //   只有调用 onchange的方法 内容才汇编 如果写入的时候 不改变内容 ，则这个不会变化
  return (
    <div>
      <Editor
        editorState={editorState}
        toolbarClassName="欧派吉安市哦回复"
        wrapperClassName="亏钱给我瑞秋我和肉"
        editorClassName="ccccc"
        onEditorStateChange={(editorState) => setEditorState(editorState)}
        onBlur={() => {
          props.getContent(
            draftToHtml(convertToRaw(editorState.getCurrentContent()))
          );
        }}
      />
    </div>
  );
  // 每一次状态更新的时候  会调用这个方法去跟新
  // 这里面的 editorState 只能是 Editor识别的配置
  // 可以调用特别的方法 转为html 片段
}
