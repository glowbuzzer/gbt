import * as React from "react"
import { ReactComponent as GlowbuzzerLogo } from "./img/small-logo.svg"
import styled from "styled-components"
import { Dropdown, MenuProps, Select, Space } from "antd"
import { DownOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router"

const StyledDiv = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;

    .title {
        font-size: 1.5rem;
    }

    .more-tools {
        border: 1px solid rgba(0, 0, 0, 0.1);
        padding: 4px 12px;
        cursor: pointer;
    }

    .glowbuzzer-link {
        a {
            display: flex;
            align-items: center;
            gap: 12px;
            text-decoration: none;
        }
    }
`

export const GlobalBanner = ({ title, id }) => {
    const navigate = useNavigate()

    function go(item) {
        navigate("/" + item.key)
    }

    const items: MenuProps["items"] = [
        { key: "kinviz", label: "Kinematics Visualizer", onClick: go },
        { key: "trconv", label: "Transformation Converter", onClick: go }
    ].filter(item => item.key !== id)

    return (
        <StyledDiv>
            <div className="title">{title}</div>
            <Dropdown menu={{ items }} className="more-tools">
                <a onClick={e => e.preventDefault()}>
                    <Space>
                        More Tools
                        <DownOutlined />
                    </Space>
                </a>
            </Dropdown>
            <div className="glowbuzzer-link">
                <a href="https://www.glowbuzzer.com">
                    <header>Brought to you by</header>
                    <GlowbuzzerLogo width={200} />
                </a>
            </div>
        </StyledDiv>
    )
}
