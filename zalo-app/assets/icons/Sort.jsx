import * as React from "react"
import Svg, { Path } from "react-native-svg";

const Sort = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color="#4a90e2" fill="none" {...props}>
    <Path d="M15 19L15 6.65856C15 5.65277 15 5.14987 15.3087 5.02472C15.6173 4.89956 15.9806 5.25517 16.7071 5.96637L19 8.21091" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 5L9 17.3414C9 18.3472 9 18.8501 8.69134 18.9753C8.38268 19.1004 8.01942 18.7448 7.29289 18.0336L5 15.7891" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default Sort;
