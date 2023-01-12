/*
 * Copyright (c) 2022. Glowbuzzer. All rights reserved
 */

import React, { FC } from "react"
import styled, { css } from "styled-components"

const StyledDockToolbar = styled.div`
    font-size: 12px;
    padding: 4px 5px;
    width: 100%;

    div:hover > & {
        visibility: visible;
    }

    border-bottom: 1px solid rgb(227, 227, 227);
`

export const DockToolbarButtonGroup = styled.span`
    &:first-child {
        margin-left: 0;
    }

    &:first-child:before,
    :after {
        content: "";
        display: inline-block;
        height: 14px;
        margin: 0 4px;
        border-left: 1px solid rgb(227, 227, 227);
    }

    .anticon {
        display: inline-block;
        margin-right: 3px;

        &:last-child {
            margin-right: 0;
        }
    }
`

/**
 * The toolbar for a tile. This is a simple container for buttons and other controls. You can group buttons using the `DockToolbarButtonGroup` component.
 */
export const DockToolbar: FC<{ children }> = ({ children }: { children }) => {
    return <StyledDockToolbar>{children}</StyledDockToolbar>
}
