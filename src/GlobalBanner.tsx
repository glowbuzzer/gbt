import * as React from "react"
import { ReactComponent as GlowbuzzerLogo } from "./img/small-logo.svg"
import styled from "styled-components"
import { Dropdown, MenuProps, Select, Space } from "antd"
import { DownOutlined, GithubOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router"
import { ExternalPageLink } from "./ExternalPageLink"

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
        display: flex;
        align-items: center;
        gap: 12px;

        .github {
            border: 1px dotted rgba(0, 0, 0, 0.1);
            padding: 4px 12px;
        }

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

    const all_items = [
        { key: "kinviz", label: "Kinematics Visualizer", onClick: go },
        { key: "rotationconverter", label: "3D Rotation Converter", onClick: go }
    ]
    const items: MenuProps["items"] = all_items.filter(item => item.key !== id)

    return (
        <StyledDiv>
            <div className="title">{title}</div>
            {all_items.some(item => item.key === id) && (
                <Dropdown menu={{ items }} className="more-tools">
                    <a onClick={e => e.preventDefault()}>
                        <Space>
                            More Tools
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            )}
            <div className="glowbuzzer-link">
                <ExternalPageLink
                    to={"https://www.github.com/glowbuzzer/gbt"}
                    className="github"
                    event="exit_github"
                >
                    <span
                        data-title="Suggestions?"
                        data-intro="We welcome your feedback if you find a bug or have a feature request!"
                        data-step={1000}
                    >
                        <Space>
                            <div>
                                View on
                                <br />
                                GitHub
                            </div>
                            <GithubOutlined style={{ fontSize: "24px", color: "#9254de" }} />
                        </Space>
                    </span>
                </ExternalPageLink>
                <ExternalPageLink to="https://www.glowbuzzer.com" event="exit_website">
                    <header>Brought to you by</header>
                    <GlowbuzzerLogo width={200} />
                </ExternalPageLink>
            </div>
        </StyledDiv>
    )
}
