import * as React from "react"
import Svg, { Circle, Path } from "react-native-svg";

const Timeline = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color="#4a90e2" fill="none" {...props}>
    <Circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={props.strokeWidth} />
    <Path d="M12 8V12L14 14" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default Timeline;
