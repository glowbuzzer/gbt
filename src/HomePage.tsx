import * as React from "react"
import { GlobalBanner } from "./GlobalBanner"
import styled from "styled-components"
import { Link } from "react-router-dom"
import { ArrowRightOutlined } from "@ant-design/icons"
import { useNavigate } from "react-router"

const StyledDiv = styled.div`
    width: 100%;
    max-width: 800px;
    margin: 0 auto;

    section {
        cursor: pointer;
        padding: 10px;
        margin: 10px -10px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 12px;

        &:hover {
            background: #f5f5f5;
        }

        title {
            margin-top: 10px;
            display: block;
            font-size: 1.1rem;
            font-weight: bold;
        }

        > div {
            margin: 10px 0;
        }

        a {
            display: block;
            margin-top: 10px;
            text-align: right;
            text-decoration: none;
            font-weight: bold;
            float: right;
        }
    }
`

export const HomePage = () => {
    const navigate = useNavigate()

    return (
        <StyledDiv>
            <GlobalBanner title={"Glowbuzzer Tools"} id="home" />
            <section onClick={() => navigate("/rotationconverter")}>
                <Link to="/rotationconverter">
                    Go <ArrowRightOutlined />
                </Link>
                <title>Rotation Converter</title>
                <div>
                    Comprehensive rotation and transformation converter. Copy and paste from other
                    formats including three.js. Visualise transformations. Covers: Matrix4/3,
                    Quaternion, Euler Angles, Axis Angle, Rodrigues.
                </div>
            </section>
            <section onClick={() => navigate("/kinviz")}>
                <Link to="/kinviz">
                    Go <ArrowRightOutlined />
                </Link>
                <title>Kinematics Visualizer</title>
                <div>
                    Define a DH (Denavit–Hartenberg) matrix and visualize the kinematics of a robot.
                    Calculates the kinematics structure's Jacobian and its inverse. Performs the
                    forward and inverse kinematics for arbitrary kinematics chains.
                </div>
            </section>
        </StyledDiv>
    )
}
