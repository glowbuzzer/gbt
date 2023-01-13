import styled from "styled-components"

export const StyledTile = styled.div`
    padding: 10px;

    .grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;

        &.col3 {
            grid-template-columns: 1fr 1fr 1fr;
        }

        .shadow {
            padding: 4px 8px;
            font-size: 12px;
            color: rgba(0, 0, 0, 0.5);
        }
    }
`
