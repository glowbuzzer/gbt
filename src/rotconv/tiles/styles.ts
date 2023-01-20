import styled from "styled-components"

export const StyledTile = styled.div`
    padding: 10px;

    .input-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(4, fit-content(100%));
        gap: 10px;

        &.col3 {
            grid-template-columns: repeat(3, fit-content(100%));
        }

        .shadow {
            padding: 4px 8px;
            font-size: 12px;
            color: rgba(0, 0, 0, 0.5);
        }
    }
`
