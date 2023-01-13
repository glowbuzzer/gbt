import styled from "styled-components"

export const GlobalLayout = styled.div`
    padding: 10px;
    display: flex;
    gap: 10px;
    position: absolute;
    flex-direction: column;
    justify-content: stretch;
    height: 100vh;
    width: 100vw;

    .flexlayout__layout {
        position: relative;
        flex-grow: 1;
        border: 1px solid rgba(128, 128, 128, 0.27);
    }

    .flexlayout__tab_button--selected {
        background: none;
        border-bottom: 1px solid #1890ff;
    }

    .help-popover {
        visibility: hidden;
    }

    .flexlayout__tabset-selected {
        .flexlayout__tab_button--selected {
            background-color: var(--color-tab-selected-background);
            border-bottom: none;
        }

        .help-popover {
            visibility: visible;
        }
    }
`
