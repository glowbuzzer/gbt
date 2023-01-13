/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import styled from "styled-components"
import * as React from "react"
import { Tooltip } from "antd"

export type CustomIconProps = {
    name?: string
    Icon
    onClick?(): void
    button?: boolean
    hidden?: boolean
    disabled?: boolean
    checked?: boolean
    title?: string // tooltip text
}

export function custom_icon_classes(props: CustomIconProps, ...classes: string[]): string {
    return [
        // "icon",
        props.button && "button",
        props.hidden && "hidden",
        props.disabled && "disabled",
        props.checked && "checked",
        ...classes
    ]
        .filter(s => s)
        .join(" ")
}

export const StyledIcon = styled.span`
    padding: 2px;
    user-select: none;

    svg {
        width: 1.5em;
        height: 1.5em;
    }

    &.button {
        cursor: pointer;
        opacity: 0.7;
        border-radius: 3px;

        :hover {
            opacity: 1;
            outline: 1px solid rgba(0, 0, 0, 0.2);
        }
    }

    &.hidden {
        display: none;
    }

    &.checked {
        background: rgba(173, 216, 230, 0.38);
    }

    &.disabled {
        opacity: 0.3 !important;
        cursor: default;
    }
`

/** @ignore */
export const GlowbuzzerIcon = (props: CustomIconProps) => {
    const { name, Icon, title, disabled } = props
    const classes = custom_icon_classes(props, name, "anticon")
    const el = (
        <StyledIcon
            className={classes}
            onClick={disabled ? undefined : props.onClick}
            onMouseDown={e => (props.onClick ? e.stopPropagation() : undefined)}
        >
            <Icon viewBox="0 0 48 48" />
        </StyledIcon>
    )
    return title ? (
        <Tooltip title={title} placement={"bottomLeft"} arrowPointAtCenter={true}>
            {el}
        </Tooltip>
    ) : (
        el
    )
}
