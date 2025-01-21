import * as React from "react"
import Svg, { G, Path, Defs, ClipPath } from "react-native-svg"

export const DashboardLabelSvg = ({ color }) => {
    return (
        <Svg
            width={color ? 21 : 25}
            height={25}
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M11 20.4V4.6c0-1.5-.64-2.1-2.23-2.1H4.73c-1.59 0-2.23.6-2.23 2.1v15.8c0 1.5.64 2.1 2.23 2.1h4.04c1.59 0 2.23-.6 2.23-2.1zM22.5 9.02V4.48c0-1.41-.64-1.98-2.23-1.98h-4.04c-1.59 0-2.23.57-2.23 1.98v4.53c0 1.42.64 1.98 2.23 1.98h4.04c1.59.01 2.23-.56 2.23-1.97zM22.5 20.27v-4.04c0-1.59-.64-2.23-2.23-2.23h-4.04c-1.59 0-2.23.64-2.23 2.23v4.04c0 1.59.64 2.23 2.23 2.23h4.04c1.59 0 2.23-.64 2.23-2.23z"
                stroke={color ? color : "#9B97C1"}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}

export const MyTeamsLabelSvg = ({ color }) => {
    return (
        <Svg
            width={25}
            height={24}
            viewBox="0 0 25 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M18.75 7.16a.605.605 0 00-.19 0 2.573 2.573 0 01-2.48-2.58c0-1.43 1.15-2.58 2.58-2.58a2.58 2.58 0 012.58 2.58 2.589 2.589 0 01-2.49 2.58zM17.72 14.44c1.37.23 2.88-.01 3.94-.72 1.41-.94 1.41-2.48 0-3.42-1.07-.71-2.6-.95-3.97-.71M6.72 7.16c.06-.01.13-.01.19 0a2.573 2.573 0 002.48-2.58C9.39 3.15 8.24 2 6.81 2a2.58 2.58 0 00-2.58 2.58c.01 1.4 1.11 2.53 2.49 2.58zM7.75 14.44c-1.37.23-2.88-.01-3.94-.72-1.41-.94-1.41-2.48 0-3.42 1.07-.71 2.6-.95 3.97-.71M12.75 14.63a.605.605 0 00-.19 0 2.573 2.573 0 01-2.48-2.58c0-1.43 1.15-2.58 2.58-2.58a2.58 2.58 0 012.58 2.58c-.01 1.4-1.11 2.54-2.49 2.58zM9.84 17.78c-1.41.94-1.41 2.48 0 3.42 1.6 1.07 4.22 1.07 5.82 0 1.41-.94 1.41-2.48 0-3.42-1.59-1.06-4.22-1.06-5.82 0z"
                stroke={color ? color : "#9B97C1"}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}

export const PropertiesLabelSvg = ({ color }) => {
    return (
        <Svg
            width={color ? 21 : 25}
            height={25}
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M2.5 22.5h20"
                stroke={color ? color : "#9B97C1"}
                strokeWidth={2}
                strokeMiterlimit={10}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M3.45 22.5l.05-12.03c0-.61.29-1.19.77-1.57l7-5.45c.72-.56 1.73-.56 2.46 0l7 5.44c.49.38.77.96.77 1.58V22.5"
                stroke={color ? color : "#9B97C1"}
                strokeWidth={2}
                strokeMiterlimit={10}
                strokeLinejoin="round"
            />
            <Path
                d="M16 11.5H9c-.83 0-1.5.67-1.5 1.5v9.5h10V13c0-.83-.67-1.5-1.5-1.5zM10.5 16.75v1.5"
                stroke={color ? color : "#9B97C1"}
                strokeWidth={2}
                strokeMiterlimit={10}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}

export const InspectionLabelSvg = ({ color }) => {
    return (
        <Svg
            width={color ? 21 : 25}
            height={25}
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <G
                clipPath="url(#clip0_917_12307)"
                stroke={color ? color : "#9B97C1"}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <Path d="M9.5 6.5h11M9.5 12.5h11M9.5 18.5h11M5.5 6.5v.01M5.5 12.5v.01M5.5 18.5v.01" />
            </G>
            <Defs>
                <ClipPath id="clip0_917_12307">
                    <Path fill="#fff" transform="translate(.5 .5)" d="M0 0H24V24H0z" />
                </ClipPath>
            </Defs>
        </Svg>
    )
}

export const ReportLabelSvg = ({ color }) => {
    return (
        <Svg
            width={color ? 21 : 25}
            height={25}
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M21.5 7.5v10c0 3-1.5 5-5 5h-8c-3.5 0-5-2-5-5v-10c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5z"
                stroke={color ? color : "#9B97C1"}
                strokeWidth={2}
                strokeMiterlimit={10}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M15 5v2c0 1.1.9 2 2 2h2M8.5 13.5h4M8.5 17.5h8"
                stroke={color ? color : "#9B97C1"}
                strokeWidth={2}
                strokeMiterlimit={10}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}

export const TemplateLabelSvg = ({ color }) => {
    return (
        <Svg
            width={color ? 21 : 25}
            height={25}
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <Path
                d="M7.2 18.5H4.65c-1.43 0-2.15-.72-2.15-2.15V4.65c0-1.43.72-2.15 2.15-2.15h4.3c1.43 0 2.15.72 2.15 2.15V6.5"
                stroke={color ? color : "#9B97C1"}
                strokeWidth={2}
                strokeMiterlimit={10}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M17.87 8.92v11.16c0 1.61-.8 2.42-2.41 2.42H9.62c-1.61 0-2.42-.81-2.42-2.42V8.92c0-1.61.81-2.42 2.42-2.42h5.84c1.61 0 2.41.81 2.41 2.42z"
                stroke={color ? color : "#9B97C1"}
                strokeWidth={2}
                strokeMiterlimit={10}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M13.9 6.5V4.65c0-1.43.72-2.15 2.15-2.15h4.3c1.43 0 2.15.72 2.15 2.15v11.7c0 1.43-.72 2.15-2.15 2.15h-2.48M10.5 11.5h4M10.5 14.5h4M12.5 22.5v-3"
                stroke={color ? color : "#9B97C1"}
                strokeWidth={2}
                strokeMiterlimit={10}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    )
}
