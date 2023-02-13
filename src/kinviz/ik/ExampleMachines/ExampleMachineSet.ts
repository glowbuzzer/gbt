/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

import * as NMATH from "../NMATH"
import { staubliTx40Classic } from "./StaubliTx40Classic"
import { staubliTx40Modified } from "./StaubliTx40Modified"
import { adeptCobra600Classic } from "./AdeptCobra600Classic"
import { abbIrb140Classic } from "./AbbIrb140Classic"
import { abbIrb140Modified } from "./AbbIrb140Modified"
import { puma560Classic } from "./Puma560Classic"
import { twoLinksPlanarClassic } from "./TwoLinkPlanarClassic"
import { threeLinksPlanarClassic } from "./ThreeLinkPlanarClassic"

export const ExampleMachineSet: NMATH.GenericSerial[] = [
    staubliTx40Classic,
    staubliTx40Modified,
    adeptCobra600Classic,
    abbIrb140Classic,
    abbIrb140Modified,
    puma560Classic,
    twoLinksPlanarClassic,
    threeLinksPlanarClassic
]
