import * as React from "react"
import Svg, { Path, Circle } from "react-native-svg";

const AlarmClock = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color={"#000000"} fill={"none"} {...props}>
        <Circle cx="12" cy="13" r="9" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
        <Path d="M5 19L3 21M19 19L21 21" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M19 3.5697L19.5955 3.27195C20.4408 2.84932 20.7583 2.89769 21.4303 3.5697C22.1023 4.2417 22.1507 4.55924 21.728 5.4045L21.4303 6M5 3.5697L4.4045 3.27195C3.55924 2.84932 3.2417 2.89769 2.5697 3.5697C1.89769 4.2417 1.84932 4.55924 2.27195 5.4045L2.5697 6" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
        <Path d="M12 9.5V13.5L14 15.5" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12 3.5V2" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M10 2H14" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
);

export default AlarmClock;