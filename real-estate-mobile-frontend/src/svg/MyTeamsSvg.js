
import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

export const CrossIcon = ({ color, number }) => {
    return (
        <Svg
            width={number ? number : 18}
            height={number ? number : 18}
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <G
                clipPath="url(#clip0_2839_20857)"
                stroke={color ? color : "#2A85FF"}
                strokeWidth={color ? 2 : 1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <Path d="M13.5 4.5l-9 9M4.5 4.5l9 9" />
            </G>
            <Defs>
                <ClipPath id="clip0_2839_20857">
                    <Path fill="#fff" d="M0 0H18V18H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    )
}