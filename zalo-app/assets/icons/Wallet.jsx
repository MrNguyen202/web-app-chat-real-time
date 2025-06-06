import * as React from "react"
import Svg, { Path } from "react-native-svg";

const Wallet = (props) => (
  <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width={24} height={24} color="#4a90e2" fill="none" {...props}>
    <Path d="M16 14C16 14.8284 16.6716 15.5 17.5 15.5C18.3284 15.5 19 14.8284 19 14C19 13.1716 18.3284 12.5 17.5 12.5C16.6716 12.5 16 13.1716 16 14Z" stroke="currentColor" strokeWidth={props.strokeWidth} />
    <Path d="M10 7H16C18.8284 7 20.2426 7 21.1213 7.87868C22 8.75736 22 10.1716 22 13V15C22 17.8284 22 19.2426 21.1213 20.1213C20.2426 21 18.8284 21 16 21H10C6.22876 21 4.34315 21 3.17157 19.8284C2 18.6569 2 16.7712 2 13V11C2 7.22876 2 5.34315 3.17157 4.17157C4.34315 3 6.22876 3 10 3H14C14.93 3 15.395 3 15.7765 3.10222C16.8117 3.37962 17.6204 4.18827 17.8978 5.22354C18 5.60504 18 6.07003 18 7" stroke="currentColor" strokeWidth={props.strokeWidth} strokeLinecap="round" />
  </Svg>
);

export default Wallet;
