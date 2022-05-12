import React, { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import MathView, { MathViewProps, MathViewRef, MathFieldChangeEvent } from "@edpi/react-math-view";

import { HIGH_SCHOOL_KEYBOARD_LAYER, HIGH_SCHOOL_KEYBOARD } from './config';

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0px 8px;
  border: 1px solid #1990ff;
  .my-mathview {
    flex: 1;
    padding: 8px;
  }
  span {
    width: 36px;
    display: flex;
    margin-left: 6px;
    color: #1990ff;
    cursor: pointer;
    transition: color 0.2s;
    &:hover {
      color: #002766;
    }
  }
`;
const MathWithKeyboardButton = React.memo((props: MathViewProps) => {
  const ref = useRef<MathViewRef>(null);
  // const [value, setValue] = useState(props.value || "");

  const onChange = useCallback(
    (e: React.SyntheticEvent<HTMLInputElement, MathFieldChangeEvent>) => {
      props.onChange?.(e);
    },
    [props.onChange]
  );

  return (
    <Container>
      <MathView
        value={props.value ?? ''}
        onChange={onChange}
        className="my-mathview"
        ref={ref}
        customVirtualKeyboardLayers={HIGH_SCHOOL_KEYBOARD_LAYER}
        customVirtualKeyboards={HIGH_SCHOOL_KEYBOARD}
        virtualKeyboards={"high-school-keyboard"}
        virtualKeyboardMode="manual"
        {...props}
      />
      {/* <span
        onClick={() => ref.current?.executeCommand("showVirtualKeyboard")}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path
            fill="currentColor"
            d="M192 288H32c-18 0-32 14-32 32v160c0 18 14 32 32 32h160c18 0 32-14 32-32V320c0-18-14-32-32-32zm-29 140c3 3 3 8 0 12l-11 11c-4 3-9 3-12 0l-28-28-28 28c-3 3-8 3-12 0l-11-11c-3-4-3-9 0-12l28-28-28-28c-3-3-3-8 0-12l11-11c4-3 9-3 12 0l28 28 28-28c3-3 8-3 12 0l11 11c3 4 3 9 0 12l-28 28 28 28zM480 0H320c-18 0-32 14-32 32v160c0 18 14 32 32 32h160c18 0 32-14 32-32V32c0-18-14-32-32-32zm-16 120c0 4-4 8-8 8h-40v40c0 4-4 8-8 8h-16c-4 0-8-4-8-8v-40h-40c-4 0-8-4-8-8v-16c0-4 4-8 8-8h40V56c0-4 4-8 8-8h16c4 0 8 4 8 8v40h40c4 0 8 4 8 8v16zm16 168H320c-18 0-32 14-32 32v160c0 18 14 32 32 32h160c18 0 32-14 32-32V320c0-18-14-32-32-32zm-16 152c0 4-4 8-8 8H344c-4 0-8-4-8-8v-16c0-4 4-8 8-8h112c4 0 8 4 8 8v16zm0-64c0 4-4 8-8 8H344c-4 0-8-4-8-8v-16c0-4 4-8 8-8h112c4 0 8 4 8 8v16zM192 0H32C14 0 0 14 0 32v160c0 18 14 32 32 32h160c18 0 32-14 32-32V32c0-18-14-32-32-32zm-16 120c0 4-4 8-8 8H56c-4 0-8-4-8-8v-16c0-4 4-8 8-8h112c4 0 8 4 8 8v16z"
          />
        </svg>
      </span> */}
    </Container>
  );
});

export default MathWithKeyboardButton;
