import React, { useEffect, useRef, useState } from "react";
import Muya, { IOption } from "../muya/lib";
import "../muya/lib/assets/styles/index.css";
import "../muya/lib/assets/theme/default.less";
import { MUYA_DEFAULT_OPTION } from "../muya/lib/config";
import CodePicker from "../muya/lib/ui/codePicker";
import EmojiPicker from "../muya/lib/ui/emojiPicker";
import FootnoteTool from "../muya/lib/ui/footnoteTool";
import FormatPicker from "../muya/lib/ui/formatPicker";
import FrontMenu from "../muya/lib/ui/frontMenu";
import ImagePathPicker from "../muya/lib/ui/imagePicker";
import ImageSelector from "../muya/lib/ui/imageSelector";
import ImageToolbar from "../muya/lib/ui/imageToolbar";
import LinkTools from "../muya/lib/ui/linkTools";
import QuickInsert from "../muya/lib/ui/quickInsert";
import TablePicker from "../muya/lib/ui/tablePicker";
import TableBarTools from "../muya/lib/ui/tableTools";
import Transformer from "../muya/lib/ui/transformer";

Muya.use(TablePicker);
Muya.use(QuickInsert);
Muya.use(CodePicker);
Muya.use(EmojiPicker);
Muya.use(ImagePathPicker);
Muya.use<{ unsplashAccessKey: string }>(ImageSelector, {
  unsplashAccessKey: "-sVvwopZmrqHDmfY6ccXUXmMz6w4YWAmHZw9dRPVcAU",
});
Muya.use(Transformer);
Muya.use(ImageToolbar);
Muya.use(FormatPicker);
Muya.use(LinkTools);
Muya.use(FootnoteTool);
Muya.use(TableBarTools);
Muya.use(FrontMenu);

const Editor = () => {
  const [showEditor, setShowEditor] = useState<boolean>(true);

  const toggle = () => {
    setShowEditor(!showEditor);
  };

  const editorRef = useRef<HTMLDivElement>(null);

  let option: IOption = Object.assign(
    {},
    MUYA_DEFAULT_OPTION
  ) as any as IOption;

  useEffect(() => {
    const editor = new Muya(editorRef.current!, option);
  });

  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        transition: "0.3s",
        background: "pink",
        transform: showEditor
          ? "translate3D(0, 0, 0)"
          : "translate3D(100%, 0, 0)",
      }}
    >
      <button onClick={toggle}>切换</button>
      <div
        style={{ height: "100vh", margin: "20px 30px" }}
        ref={editorRef}
      ></div>
    </div>
  );
};

export default Editor;
