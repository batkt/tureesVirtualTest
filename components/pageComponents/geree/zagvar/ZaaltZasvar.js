import React from "react";
import SunEditor, { buttonList } from "suneditor-react";
import _ from "lodash";
import { customPlugin } from "./ZaaltOruulakh";

function ZaaltZasvar({ songolt, destroy, value, change }, ref) {
  const editorRef = React.useRef();
  const [sunValue, setValue] = React.useState(value);

  React.useImperativeHandle(
    ref,
    () => ({
      khadgalya() {
        change(sunValue);
        destroy();
      },
      khaaya() {
        destroy();
      },
    }),
    [sunValue]
  );

  const custom = React.useMemo(() => {
    return customPlugin(songolt);
  }, [songolt]);

  return (
    <SunEditor
      onChange={setValue}
      defaultValue={sunValue}
      setOptions={{
        plugins: [custom],
        height: 200,
        buttonList: [...buttonList.formatting, ["custom_example"]],
      }}
      showToolbar={true}
      ref={editorRef}
    />
  );
}

export default React.forwardRef(ZaaltZasvar);
