import * as React from "react"
import Svg, { G, Path } from "react-native-svg"

export function CustomCalenderIcon({ color }) {
    return (
        <Svg
            width={20}
            height={20}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M2.577 7.837H17.43M13.701 11.091h.008M10.004 11.091h.008M6.298 11.091h.008M13.701 14.33h.008M10.004 14.33h.008M6.298 14.33h.008M13.37 1.667v2.742M6.638 1.667v2.742"
                stroke={color ? color : '#000929'}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                clipRule="evenodd"
                d="M13.532 2.983H6.476c-2.447 0-3.976 1.364-3.976 3.87v7.541c0 2.545 1.529 3.94 3.976 3.94h7.048c2.455 0 3.976-1.371 3.976-3.877V6.853c.008-2.506-1.513-3.87-3.968-3.87z"
                stroke={color ? color : '#000929'}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}
