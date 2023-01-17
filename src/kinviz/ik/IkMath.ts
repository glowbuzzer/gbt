/*
 * Copyright (c) 2023. Glowbuzzer. All rights reserved
 */

// namespace IkMath{}

function go_sq(x) {
    return x * x
}

function go_cub(x) {
    return x * x * x
}

function go_quad(x) {
    return x * x * x * x
}

interface Igo_cart {
    x: number
    y: number
    z: number
}

export class go_cart implements Igo_cart {
    x: number
    y: number
    z: number

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x
        this.y = y
        this.z = z
    }
}

interface Igo_screw {
    v: go_cart
    w: go_cart
}

/*
  A go_screw represents the linear- and angular velocity vectors
  of a frame. v is the Cartesian linear velocity vector.
  w is the Cartesian angular velocity vector, the instantaneous
  vector about which the frame is rotating.
*/
export class go_screw implements Igo_screw {
    v: go_cart
    w: go_cart

    constructor(v: go_cart = { x: 0, y: 0, z: 0 }, w: go_cart = { x: 0, y: 0, z: 0 }) {
        this.v = v
        this.w = w
    }
}

interface Igo_quat {
    s: number
    x: number
    y: number
    z: number
}

// const go_quat = function(x: number, y: number, z: number, s: number): Tgo_quat{
//     return {x: x, y: y, z: z, s: s};
// };

export class go_quat implements Igo_quat {
    s: number
    x: number
    y: number
    z: number

    constructor(s: number = 1, x: number = 0, y: number = 0, z: number = 0) {
        this.s = s
        this.x = x
        this.y = y
        this.z = z
    }
}

interface Igo_rvec {
    x: number
    y: number
    z: number
}

export class go_rvec implements Igo_rvec {
    x: number
    y: number
    z: number

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x
        this.y = y
        this.z = z
    }
}

// type go_vector:number[]

export class go_vector extends Array<number> {
    constructor(...args: number[]) {
        super(...args)
    }
}

interface Igo_hom {
    tran: go_cart
    rot: go_mat
}

class go_hom implements Igo_hom {
    tran: go_cart
    rot: go_mat

    constructor(
        go_cart: go_cart = { x: 0, y: 0, z: 0 },
        go_mat: go_mat = {
            x: { x: 0, y: 0, z: 0 },
            y: { x: 0, y: 0, z: 0 },
            z: { x: 0, y: 0, z: 0 }
        }
    ) {
        this.tran = go_cart
        this.rot = go_mat
    }
}

// typedef struct {
//     go_real a;			/*< a[i-1] */
//     go_real alpha;		/*< alpha[i-1] */
//     /* either d or theta are the free variable, depending on quantity */
//     go_real d;			/*< d[i] */
//     go_real theta;		/*< theta[i] */
// } go_dh;

/*!
    PK parameters are used for parallel kinematic mechanisms, and
represent the Cartesian positions of the ends of the link in the
stationary base frame and the moving platform frame. Currently this
only supports prismatic links.
*/
interface Igo_pk {
    base: go_cart /*!< position of fixed end in base frame */
    platform: go_cart /*!< position of moving end in platform frame  */
    d: number /*!< the length of the link */
}

class go_pk implements Igo_pk {
    base: go_cart /*!< position of fixed end in base frame */
    platform: go_cart /*!< position of moving end in platform frame  */
    d: number /*!< the length of the link */
    constructor(
        base: go_cart = { x: 0, y: 0, z: 0 },
        platform: go_cart = { x: 0, y: 0, z: 0 },
        d: number = 0
    ) {
        this.base = base
        this.platform = platform
        this.d = d
    }
}

/*!
  PP parameters represent the pose of the link with respect to the
  previous link. Revolute joints rotate about the Z axis, prismatic
  joints slide along the Z axis.
 */
interface Igo_pp {
    pose: go_pose /*!< the pose of the link wrt to the previous link */
}

class go_pp implements Igo_pp {
    pose: go_pose /*!< the pose of the link wrt to the previous link */
    constructor(pose: go_pose = { tran: { x: 0, y: 0, z: 0 }, rot: { s: 1, x: 0, y: 0, z: 0 } }) {
        this.pose = pose
    }
}

/*!
  URDF parameters represent the pose of the link with respect to the
  previous link. Revolute joints rotate about the axis specified, prismatic
  joints slide along the axis specified.
 */
interface Igo_urdf {
    pose: go_pose /*!< the pose of the link wrt to the previous link */
    axis: go_cart /*!< the axis of rotation or translation */
}

class go_urdf implements Igo_urdf {
    pose: go_pose /*!< the pose of the link wrt to the previous link */
    axis: go_cart /*!< the axis of rotation or translation */
    constructor(
        pose: go_pose = { tran: { x: 0, y: 0, z: 0 }, rot: { s: 1, x: 0, y: 0, z: 0 } },
        axis: go_cart = {
            x: 0,
            y: 0,
            z: 0
        }
    ) {
        this.pose = pose
        this.axis = axis
    }
}

/*! Rigid body */
interface Igo_body {
    mass: number /*!< total mass of the rigid body */
    /*!
      The \a inertia matrix is the 3x3 matrix of moments of inertia with
      respect to the body's origin.
    */
    inertia: number[][]
}

class go_body implements Igo_body {
    mass: number /*!< total mass of the rigid body */
    /*!
        The \a inertia matrix is the 3x3 matrix of moments of inertia with
        respect to the body's origin.
     */
    inertia: number[][]

    constructor(
        mass: number = 0,
        inertia: number[][] = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ]
    ) {
        this.mass = mass
        this.inertia = inertia
    }
}

interface Igo_dh {
    a: number /*!< a[i-1] */
    alpha: number /*!< alpha[i-1] */
    d: number /*!< d[i] */
    theta: number
}

export class go_dh implements Igo_dh {
    a: number
    alpha: number
    d: number
    theta: number

    constructor(a: number = 0, alpha: number = 0, d: number = 0, theta: number = 0) {
        this.a = a
        this.alpha = alpha
        this.d = d
        this.theta = theta
    }
}

interface Igo_pose {
    tran: go_cart
    rot: go_quat
}

export class go_pose implements Igo_pose {
    tran: go_cart
    rot: go_quat

    constructor(tran: go_cart = { x: 0, y: 0, z: 0 }, rot: go_quat = { s: 1, x: 0, y: 0, z: 0 }) {
        this.tran = tran
        this.rot = rot
    }
}

interface Igo_mat {
    x: go_cart
    y: go_cart
    z: go_cart
}

class go_mat implements Igo_mat {
    x: go_cart
    y: go_cart
    z: go_cart

    constructor(
        x: go_cart = { x: 0, y: 0, z: 0 },
        y: go_cart = { x: 0, y: 0, z: 0 },
        z: go_cart = { x: 0, y: 0, z: 0 }
    ) {
        this.x = x
        this.y = y
        this.z = z
    }
}

interface Igo_rpy {
    r: number
    p: number
    y: number
}

export class go_rpy implements Igo_rpy {
    r: number
    p: number
    y: number

    constructor(r: number = 0, p: number = 0, y: number = 0) {
        this.r = r
        this.p = p
        this.y = y
    }
}

interface Igo_link {
    dh: go_dh /*!< if you have DH params and don't want to convert to PP */
    pk: go_pk /*!< if you have a parallel machine, e.g., hexapod or robot crane */
    pp: go_pp /*!< if you have a serial machine, e.g., an industrial robot  */
    urdf: go_urdf /*!< if you have URDF parameters for a serial robot  */
    body: go_body /*!< the link's rigid body parameters */
    type: LinkParamRepresentation /*!< one of GO_LINK_DH,PK,PP  */
    quantity: LinkQuantities /*!< one of GO_QUANTITY_LENGTH,ANGLE */
}

export class go_link implements Igo_link {
    dh: go_dh /*!< if you have DH params and don't want to convert to PP */
    pk: go_pk /*!< if you have a parallel machine, e.g., hexapod or robot crane */
    pp: go_pp /*!< if you have a serial machine, e.g., an industrial robot  */
    urdf: go_urdf /*!< if you have URDF parameters for a serial robot  */
    body: go_body /*!< the link's rigid body parameters */
    type: LinkParamRepresentation /*!< one of GO_LINK_DH,PK,PP  */
    quantity: LinkQuantities /*!< one of GO_QUANTITY_LENGTH,ANGLE */
    unrotate: number /*!< the unrotate for this link */
    constructor(
        dh: go_dh = { a: 0, alpha: 0, d: 0, theta: 0 },
        pk: go_pk = {
            base: { x: 0, y: 0, z: 0 },
            platform: { x: 0, y: 0, z: 0 },
            d: 0
        },
        pp: go_pp = {
            pose: {
                tran: { x: 0, y: 0, z: 0 },
                rot: { s: 1, x: 0, y: 0, z: 0 }
            }
        },
        urdf: go_urdf = {
            pose: { tran: { x: 0, y: 0, z: 0 }, rot: { s: 1, x: 0, y: 0, z: 0 } },
            axis: { x: 0, y: 0, z: 0 }
        },
        body: go_body = {
            mass: 0,
            inertia: [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ]
        },
        type: LinkParamRepresentation = LinkParamRepresentation.GO_LINK_DH,
        quantity: LinkQuantities = LinkQuantities.GO_QUANTITY_LENGTH,
        unrotate: number = 0
    ) {
        this.dh = dh
        this.pk = pk
        this.pp = pp
        this.urdf = urdf
        this.body = body
        this.type = type
        this.quantity = quantity
        this.unrotate = unrotate
    }
}

// #define GO_MATRIX_DECLARE(M,Mspace,_rows,_cols) \
// go_matrix M = {0, 0, 0, 0, 0, 0}; \
// struct { \
//   go_real * el[_rows]; \
//   go_real * elcpy[_rows]; \
//   go_real stg[_rows][_cols]; \
//   go_real stgcpy[_rows][_cols]; \
//   go_real v[_rows]; \
//   go_integer index[_rows]; \
// } Mspace
//
// #define go_matrix_init(M,Mspace,_rows,_cols) \
// M.el = Mspace.el;				    \
// M.elcpy = Mspace.elcpy;				    \
// for (M.rows = 0; M.rows < (_rows); M.rows++) { \
//   M.el[M.rows] = Mspace.stg[M.rows];	    \
//   M.elcpy[M.rows] = Mspace.stgcpy[M.rows];	    \
// } \
// M.rows = (_rows); \
// M.cols = (_cols); \
// M.v = Mspace.v; \
// M.index = Mspace.index

interface Igo_matrix {
    rows: number
    cols: number
    el: number[][]
    elcpy: number[][]
    v: number[]
    index: number[]
}

export class go_matrix implements Igo_matrix {
    rows: number
    cols: number
    el: number[][]
    elcpy: number[][]
    v: number[]
    index: number[]

    constructor(
        rows,
        cols,
        el: number[][] = [],
        elcpy: number[][] = [],
        v: number[] = [],
        index: number[] = []
    ) {
        this.rows = rows
        this.cols = cols
        this.el = el
        this.elcpy = el
        this.v = v
        this.index = index
    }

    identity() {
        for (let i = 0; i < this.rows; i++) {
            this.el[i] = []
            for (let j = 0; j < this.cols; j++) {
                if (i == j) {
                    this.el[i][j] = 1
                } else {
                    this.el[i][j] = 0
                }
            }
        }
        return this
    }
    multiplyMatrices(m1: go_matrix, m2: go_matrix) {
        const ae = m1.el
        const be = m2.el
        const te = this.el
        for (let i = 0; i < m1.rows; i++) {
            for (let j = 0; j < m2.cols; j++) {
                te[i][j] = 0
                for (let k = 0; k < m1.cols; k++) {
                    te[i][j] += ae[i][k] * be[k][j]
                }
            }
        }
        return this
    }
    multiply(m: go_matrix) {
        return this.multiplyMatrices(this, m)
    }
    preMultiply(m: go_matrix) {
        return this.multiplyMatrices(m, this)
    }
    multiplyScalar(s: number) {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.el[i][j] *= s
            }
        }
        return this
    }
    transpose() {
        const te = this.el
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                te[i][j] = te[j][i]
            }
        }
        return this
    }
    addMatrices(m1: go_matrix, m2: go_matrix) {
        const ae = m1.el
        const be = m2.el
        const te = this.el
        for (let i = 0; i < m1.rows; i++) {
            for (let j = 0; j < m1.cols; j++) {
                te[i][j] = ae[i][j] + be[i][j]
            }
        }
        return this
    }
    add(m: go_matrix) {
        return this.addMatrices(this, m)
    }
}

export enum retval {
    GO_RESULT_OK = 0,
    GO_RESULT_IGNORED = 1,
    GO_RESULT_BAD_ARGS = 2,
    GO_RESULT_RANGE_ERROR = 3,
    GO_RESULT_DOMAIN_ERROR = 4 /* resulting domain out of bounds */,
    GO_RESULT_ERROR = 5 /* action can't be done, a problem */,
    GO_RESULT_IMPL_ERROR = 6 /* function not implemented */,
    GO_RESULT_NORM_ERROR = 7 /* a value is expected to be normalized */,
    GO_RESULT_DIV_ERROR = 8 /* divide by zero */,
    GO_RESULT_SINGULAR = 10 /* a matrix is singular */,
    GO_RESULT_NO_SPACE = 11 /* no space for append operation */,
    GO_RESULT_EMPTY = 12 /* data structure is empty */,
    GO_RESULT_BUG = 13 /* a bug in Go, e.g., unknown case */
}

const GO_REAL_EPSILON = 1.0e-10
const GO_INF = Infinity

// #define GO_TRAN_CLOSE(x,y) (fabs((x)-(y)) < GO_REAL_EPSILON)
/*! How close translational quantities must be to be equal. */
function GO_TRAN_CLOSE(x: number, y: number): boolean {
    return Math.abs(x - y) < GO_REAL_EPSILON
}

/*! How small a translational quantity must be to be zero. */

// #define GO_TRAN_SMALL(x) (fabs(x) < GO_REAL_EPSILON)
function GO_TRAN_SMALL(x: number): boolean {
    return Math.abs(x) < GO_REAL_EPSILON
}

/*! How close rotational quantities must be to be equal. */

// #define GO_ROT_CLOSE(x,y) (fabs((x)-(y)) < GO_REAL_EPSILON)
function GO_ROT_CLOSE(x: number, y: number): boolean {
    return Math.abs(x - y) < GO_REAL_EPSILON
}

/*! How small a rotational quantity must be to be zero. */

// #define GO_ROT_SMALL(x) (fabs(x) < GO_REAL_EPSILON)
function GO_ROT_SMALL(x: number): boolean {
    return Math.abs(x) < GO_REAL_EPSILON
}

/*! How close general quantities must be to be equal. Use this when
  you have something other than translational or rotational quantities,
  otherwise use one of \a GO_TRAN,ROT_CLOSE. */

// #define GO_CLOSE(x,y) (fabs((x)-(y)) < GO_REAL_EPSILON)
function GO_CLOSE(x: number, y: number): boolean {
    return Math.abs(x - y) < GO_REAL_EPSILON
}

/*! How small a general quantity must be to be zero. Use this when
  you have something other than a translational or rotational quantity,
  otherwise use one of \a GO_TRAN,ROT_SMALL. */

// #define GO_SMALL(x) (fabs(x) < GO_REAL_EPSILON)
function GO_SMALL(x: number): boolean {
    return Math.abs(x) < GO_REAL_EPSILON
}

// void pm_sincos(double x, double *sx, double *cx)
// {
// *sx = sin(x);
// *cx = cos(x);
// }

function pm_sincos(x): [number, number] {
    return [Math.sin(x), Math.cos(x)]
}

// go_real go_cbrt(go_real x)
// {
//     if (x < 0.0) {
//         return (go_real) -pow((double) -x, 1.0/3.0);
//     }
//     return (go_real) pow((double) x, 1.0/3.0);
// }

function go_cbrt(x): number {
    if (x < 0.0) {
        return -Math.pow(-x, 1.0 / 3.0)
    }
    return Math.pow(x, 1.0 / 3.0)
}

/* rotation rep conversion functions */

// int go_rvec_quat_convert(const go_rvec * r, go_quat * q)
// {
//     go_cart vec;
//     go_cart uvec;
//     go_real mag;
//     go_real sh;
//
//     vec.x = r->x;
//     vec.y = r->y;
//     vec.z = r->z;
//
//     if (GO_RESULT_OK != go_cart_unit(&vec, &uvec)) {
//     /* a zero vector */
//     q->s = 1;
//     q->x = q->y = q->z = 0;
//     return GO_RESULT_OK;
// }
//
//     (void) go_cart_mag(&vec, &mag);
//
//     pm_sincos(0.5 * mag, &sh, &(q->s));
//
//     if (q->s >= 0) {
//         q->x = uvec.x * sh;
//         q->y = uvec.y * sh;
//         q->z = uvec.z * sh;
//     } else {
//         q->s = -q->s;
//         q->x = -uvec.x * sh;
//         q->y = -uvec.y * sh;
//         q->z = -uvec.z * sh;
//     }
//
//     return GO_RESULT_OK;
// }

function go_rvec_quat_convert(r: go_rvec): { ret: number; q: go_quat } {
    const vec = new go_cart(0, 0, 0)

    let sh: number
    const q = new go_quat()
    if (retval.GO_RESULT_OK != go_cart_unit(vec).ret) {
        q.s = 1
        q.x = q.y = q.z = 0
        return { ret: retval.GO_RESULT_OK, q: q }
    }
    const mag = go_cart_mag(vec).d

    ;[sh, q.s] = pm_sincos(0.5 * mag)
    if (q.s >= 0) {
        q.x = vec.x * sh
        q.y = vec.y * sh
        q.z = vec.z * sh
    } else {
        q.s = -q.s
        q.x = -vec.x * sh
        q.y = -vec.y * sh
        q.z = -vec.z * sh
    }
    return { ret: retval.GO_RESULT_OK, q: q }
}

// int go_quat_rvec_convert(const go_quat * q, go_rvec * r)
// {
//     go_real sh;
//     go_real mag;
//
//     sh = sqrt(go_sq(q->x) + go_sq(q->y) + go_sq(q->z));
//
//     if (GO_ROT_SMALL(sh)) {
//         r->x = 0;
//         r->y = 0;
//         r->z = 0;
//     } else {
//         mag = 2 * Math.atan2(sh, q->s) / sh;
//         r->x = mag * q->x;
//         r->y = mag * q->y;
//         r->z = mag * q->z;
//     }
//
//     return GO_RESULT_OK;
// }

function go_quat_rvec_convert(q: go_quat): { ret: number; r: go_rvec } {
    const r: go_rvec = new go_rvec()
    const sh = Math.sqrt(go_sq(q.x) + go_sq(q.y) + go_sq(q.z))
    if (GO_ROT_SMALL(sh)) {
        r.x = 0
        r.y = 0
        r.z = 0
    } else {
        const mag = (2 * Math.atan2(sh, q.s)) / sh
        r.x = mag * q.x
        r.y = mag * q.y
        r.z = mag * q.z
    }
    return { ret: retval.GO_RESULT_OK, r: r }
}

// int go_quat_mat_convert(const go_quat * q, go_mat * m)
// {
//     /* from space book where e1=q->x e2=q->y e3=q->z e4=q->s */
//     m->x.x = 1 - 2 * (go_sq(q->y) + go_sq(q->z));
//     m->y.x = 2 * (q->x * q->y - q->z * q->s);
//     m->z.x = 2 * (q->z * q->x + q->y * q->s);
//
//     m->x.y = 2 * (q->x * q->y + q->z * q->s);
//     m->y.y = 1 - 2 * (go_sq(q->z) + go_sq(q->x));
//     m->z.y = 2 * (q->y * q->z - q->x * q->s);
//
//     m->x.z = 2 * (q->z * q->x - q->y * q->s);
//     m->y.z = 2 * (q->y * q->z + q->x * q->s);
//     m->z.z = 1 - 2 * (go_sq(q->x) + go_sq(q->y));
//
//     return GO_RESULT_OK;
// }

function go_quat_mat_convert(q: go_quat): { ret: number; m: go_mat } {
    const m = new go_mat()

    m.x.x = 1 - 2 * (go_sq(q.y) + go_sq(q.z))
    m.y.x = 2 * (q.x * q.y - q.z * q.s)
    m.z.x = 2 * (q.z * q.x + q.y * q.s)

    m.x.y = 2 * (q.x * q.y + q.z * q.s)
    m.y.y = 1 - 2 * (go_sq(q.z) + go_sq(q.x))
    m.z.y = 2 * (q.y * q.z - q.x * q.s)

    m.x.z = 2 * (q.z * q.x - q.y * q.s)
    m.y.z = 2 * (q.y * q.z + q.x * q.s)
    m.z.z = 1 - 2 * (go_sq(q.x) + go_sq(q.y))

    return { ret: retval.GO_RESULT_OK, m: m }
}

// int go_quat_rpy_convert(const go_quat * q, go_rpy * rpy)
// {
//     go_mat m;
//     int retval;
//
//     retval = go_quat_mat_convert(q, &m);
//     if (GO_RESULT_OK != retval) return retval;
//     return go_mat_rpy_convert(&m, rpy);
// }
function go_quat_rpy_convert(q: go_quat): { ret: number; rpy: go_rpy } {
    const { ret, m } = go_quat_mat_convert(q)
    if (retval.GO_RESULT_OK != ret) return { ret: ret, rpy: undefined }
    return go_mat_rpy_convert(m)
}

/*
  from space book:

  e1 = (c32 - c23) / 4*e4
  e2 = (c13 - c31) / 4*e4
  e3 = (c21 - c12) / 4*e4
  e4 = sqrt(1 + c11 + c22 + c33) / 2

  if e4 == 0
  e1 = sqrt(1 + c11 - c33 - c22) / 2
  e2 = sqrt(1 + c22 - c33 - c11) / 2
  e3 = sqrt(1 + c33 - c11 - c22) / 2

  to determine whether to take the positive or negative sqrt value
  since e4 == 0 indicates a 180* rotation then (0 x y z) = (0 -x -y -z).
  Thus some generalities can be used:
  1) find which of e1, e2, or e3 has the largest magnitude and leave it pos
  2) if e1 is largest then
  if c21 < 0 then take the negative for e2
  if c31 < 0 then take the negative for e3
  3) else if e2 is largest then
  if c21 < 0 then take the negative for e1
  if c32 < 0 then take the negative for e3
  4) else if e3 is larger then
  if c31 < 0 then take the negative for e1
  if c32 < 0 then take the negative for e2

  Note: c21 in the space book is m.x.y in this C code
*/
// int go_mat_quat_convert(const go_mat * m, go_quat * q)
// {
//     go_real discr;
//     go_real a;
//
//     if (! go_mat_is_norm(m)) {
//         return GO_RESULT_NORM_ERROR;
//     }
//
//     discr = 1.0 + m->x.x + m->y.y + m->z.z;
//     if (discr < 0.0) discr = 0.0;	/* give sqrt some slack for tiny negs */
//
//     q->s = 0.5 * sqrt(discr);
//
//     if (GO_ROT_SMALL(q->s)) {
//         q->s = 0;
//         discr = 1.0 + m->x.x - m->y.y - m->z.z;
//         if (discr < 0.0) discr = 0.0;
//         q->x = sqrt(discr) / 2.0;
//         discr = 1.0 + m->y.y - m->x.x - m->z.z;
//         if (discr < 0.0) discr = 0.0;
//         q->y = sqrt(discr) / 2.0;
//         discr = 1.0 + m->z.z - m->y.y - m->x.x;
//         if (discr < 0.0) discr = 0.0;
//         q->z = sqrt(discr) / 2.0;
//
//         if (q->x > q->y && q->x > q->z) {
//             if (m->x.y < 0.0) {
//                 q->y *= -1;
//             }
//             if (m->x.z < 0.0) {
//                 q->z *= -1;
//             }
//         } else if (q->y > q->z) {
//             if (m->x.y < 0.0) {
//                 q->x *= -1;
//             }
//             if (m->y.z < 0.0) {
//                 q->z *= -1;
//             }
//         } else {
//             if (m->x.z < 0.0) {
//                 q->x *= -1;
//             }
//             if (m->y.z < 0.0) {
//                 q->y *= -1;
//             }
//         }
//     } else {
//         q->x = (m->y.z - m->z.y) / (a = 4 * q->s);
//         q->y = (m->z.x - m->x.z) / a;
//         q->z = (m->x.y - m->y.x) / a;
//     }
//
//     return go_quat_norm(q, q);
// }

export function go_mat_quat_convert(m: go_mat): { ret: number; qout: go_quat } {
    var discr = 1.0 + m.x.x + m.y.y + m.z.z
    if (discr < 0.0) discr = 0.0 /* give sqrt some slack for tiny negs */

    const q = new go_quat()
    q.s = 0.5 * Math.sqrt(discr)
    if (GO_ROT_SMALL(q.s)) {
        q.s = 0
        discr = 1.0 + m.x.x - m.y.y - m.z.z
        if (discr < 0.0) discr = 0.0
        q.x = Math.sqrt(discr) / 2.0
        discr = 1.0 + m.y.y - m.x.x - m.z.z
        if (discr < 0.0) discr = 0.0
        q.y = Math.sqrt(discr) / 2.0
        discr = 1.0 + m.z.z - m.y.y - m.x.x
        if (discr < 0.0) discr = 0.0
        q.z = Math.sqrt(discr) / 2.0
        if (q.x > q.y && q.x > q.z) {
            if (m.x.y < 0.0) {
                q.y *= -1
            }
            if (m.x.z < 0.0) {
                q.z *= -1
            }
        } else if (q.y > q.z) {
            if (m.x.y < 0.0) {
                q.x *= -1
            }
            if (m.y.z < 0.0) {
                q.z *= -1
            }
        } else {
            if (m.x.z < 0.0) {
                q.x *= -1
            }
            if (m.y.z < 0.0) {
                q.y *= -1
            }
        }
    } else {
        let a = 4 * q.s
        q.x = (m.y.z - m.z.y) / a
        q.y = (m.z.x - m.x.z) / a
        q.z = (m.x.y - m.y.x) / a
    }
    return go_quat_norm(q)
}

// int go_mat_rpy_convert(const go_mat * m, go_rpy * rpy)
// {
//     rpy->p = atan2(-m->x.z, sqrt(go_sq(m->x.x) + go_sq(m->x.y)));
//
//     if (GO_ROT_CLOSE(rpy->p, GO_PI_2)) {
//         rpy->r = Math.atan2(m->y.x, m->y.y);
//         rpy->p = GO_PI_2;		/* force it */
//         rpy->y = 0;
//     } else if (GO_ROT_CLOSE(rpy->p, GO_PI_2)) {
//         rpy->r = -atan2(m->y.z, m->y.y);
//         rpy->p = -GO_PI_2;		/* force it */
//         rpy->y = 0;
//     } else {
//         rpy->r = atan2(m->y.z, m->z.z);
//         rpy->y = atan2(m->x.y, m->x.x);
//     }
//
//     return GO_RESULT_OK;
// }

function go_mat_rpy_convert(m: go_mat): { ret: number; rpy: go_rpy } {
    const rpy = new go_rpy()
    rpy.p = Math.atan2(-m.x.z, Math.sqrt(go_sq(m.x.x) + go_sq(m.x.y)))

    if (GO_ROT_CLOSE(rpy.p, Math.PI / 2)) {
        rpy.r = Math.atan2(m.y.x, m.y.y)
        rpy.p = Math.PI / 2 /* force it */
        rpy.y = 0
    } else if (GO_ROT_CLOSE(rpy.p, Math.PI / 2)) {
        rpy.r = -Math.atan2(m.y.z, m.y.y)
        rpy.p = -Math.PI / 2 /* force it */
        rpy.y = 0
    } else {
        rpy.r = Math.atan2(m.y.z, m.z.z)
        rpy.y = Math.atan2(m.x.y, m.x.x)
    }

    return { ret: retval.GO_RESULT_OK, rpy: rpy }
}

// int go_rpy_quat_convert(const go_rpy * rpy, go_quat * quat)
// {
//     go_mat mat;
//     int retval;
//
//     retval = go_rpy_mat_convert(rpy, &mat);
//     if (GO_RESULT_OK != retval) return retval;
//     return go_mat_quat_convert(&mat, quat);
// }
export function go_rpy_quat_convert(rpy: go_rpy): { ret: number; qout: go_quat } {
    const { ret, mat } = go_rpy_mat_convert(rpy)

    if (retval.GO_RESULT_OK != ret) return { ret: ret, qout: null }

    return go_mat_quat_convert(mat)
}

// int go_rpy_mat_convert(const go_rpy * rpy, go_mat * m)
// {
//     go_real sa, sb, sg;
//     go_real ca, cb, cg;
//
//     sa = sin(rpy->y);
//     sb = sin(rpy->p);
//     sg = sin(rpy->r);
//
//     ca = cos(rpy->y);
//     cb = cos(rpy->p);
//     cg = cos(rpy->r);
//
//     m->x.x = ca * cb;
//     m->y.x = ca * sb * sg - sa * cg;
//     m->z.x = ca * sb * cg + sa * sg;
//
//     m->x.y = sa * cb;
//     m->y.y = sa * sb * sg + ca * cg;
//     m->z.y = sa * sb * cg - ca * sg;
//
//     m->x.z = -sb;
//     m->y.z = cb * sg;
//     m->z.z = cb * cg;
//
//     return GO_RESULT_OK;
// }

function go_rpy_mat_convert(rpy: go_rpy): { ret: number; mat: go_mat } {
    const m = new go_mat()
    const sa = Math.sin(rpy.y)
    const sb = Math.sin(rpy.p)
    const sg = Math.sin(rpy.r)

    const ca = Math.cos(rpy.y)
    const cb = Math.cos(rpy.p)
    const cg = Math.cos(rpy.r)

    m.x.x = ca * cb
    m.y.x = ca * sb * sg - sa * cg
    m.z.x = ca * sb * cg + sa * sg

    m.x.y = sa * cb
    m.y.y = sa * sb * sg + ca * cg
    m.z.y = sa * sb * cg - ca * sg

    m.x.z = -sb
    m.y.z = cb * sg
    m.z.z = cb * cg

    return { ret: retval.GO_RESULT_OK, mat: m }
}

// go_pose go_pose_identity(void)
// {
//     go_pose pose;
//
//     pose.tran.x = 0, pose.tran.y = 0, pose.tran.z = 0;
//     pose.rot.s = 1, pose.rot.x = 0, pose.rot.y = 0, pose.rot.z = 0;
//
//     return pose;
// }

function go_pose_identity(): go_pose {
    const pose = new go_pose()
    ;(pose.tran.x = 0), (pose.tran.y = 0), (pose.tran.z = 0)
    ;(pose.rot.s = 1), (pose.rot.x = 0), (pose.rot.y = 0), (pose.rot.z = 0)
    return pose
}

// int go_pose_hom_convert(const go_pose * p, go_hom * h)
// {
//     h->tran = p->tran;
//
//     return go_quat_mat_convert(&p->rot, &h->rot);
// }

function go_pose_hom_convert(p: go_pose): { ret: number; h: go_hom } {
    const h: go_hom = new go_hom()

    h.tran = p.tran

    const res = go_quat_mat_convert(p.rot)

    //todo - assignment?
    h.rot = res.m

    return { ret: res.ret, h: h }
}

// int go_hom_pose_convert(const go_hom * h, go_pose * p)
// {
//     p->tran = h->tran;
//
//     return go_mat_quat_convert(&h->rot, &p->rot);
// }

function go_hom_pose_convert(h: go_hom): { ret: number; pout: go_pose } {
    const p = new go_pose()
    p.tran = h.tran

    const res = go_mat_quat_convert(h.rot)
    p.rot = res.qout

    return { ret: res.ret, pout: p }
}

/* go_cart functions */

// int go_cart_cart_compare(const go_cart * v1, const go_cart * v2)
// {
//     if (GO_TRAN_CLOSE(v1->x, v2->x) &&
//         GO_TRAN_CLOSE(v1->y, v2->y) &&
//         GO_TRAN_CLOSE(v1->z, v2->z)) {
//         return 1;
//     }
//
//     return 0;
// }
function go_cart_cart_compare(v1: go_cart, v2: go_cart): number {
    if (GO_TRAN_CLOSE(v1.x, v2.x) && GO_TRAN_CLOSE(v1.y, v2.y) && GO_TRAN_CLOSE(v1.z, v2.z)) {
        return 1
    }

    return 0
}

// int go_cart_cart_cross(const go_cart * v1, const go_cart * v2,
// go_cart * vout)
// {
//     go_cart cp1, cp2;
//
//     cp1 = *v1;
//     cp2 = *v2;
//
//     vout->x = cp1.y * cp2.z - cp1.z * cp2.y;
//     vout->y = cp1.z * cp2.x - cp1.x * cp2.z;
//     vout->z = cp1.x * cp2.y - cp1.y * cp2.x;
//
//     return GO_RESULT_OK;
// }
function go_cart_cart_cross(v1: go_cart, v2: go_cart): { ret: number; vout: go_cart } {
    const cp1: go_cart = v1
    const cp2: go_cart = v2
    const vout: go_cart = {
        x: cp1.y * cp2.z - cp1.z * cp2.y,
        y: cp1.z * cp2.x - cp1.x * cp2.z,
        z: cp1.x * cp2.y - cp1.y * cp2.x
    }

    return { ret: retval.GO_RESULT_OK, vout: vout }
}

// int go_cart_mag(const go_cart * v, go_real * d)
// {
// *d = sqrt(go_sq(v->x) + go_sq(v->y) + go_sq(v->z));
//
//     return GO_RESULT_OK;
// }
function go_cart_mag(v: go_cart): { ret: number; d: number } {
    const d = Math.sqrt(go_sq(v.x) + go_sq(v.y) + go_sq(v.z))
    return { ret: retval.GO_RESULT_OK, d: d }
}

// int go_cart_cart_add(const go_cart * v1, const go_cart * v2,
// go_cart * vout)
// {
//     vout->x = v1->x + v2->x;
//     vout->y = v1->y + v2->y;
//     vout->z = v1->z + v2->z;
//
//     return GO_RESULT_OK;
// }
function go_cart_cart_add(v1, v2): { ret: number; vout: go_cart } {
    const vout: go_cart = { x: 0, y: 0, z: 0 }

    vout.x = v1.x + v2.x
    vout.y = v1.y + v2.y
    vout.z = v1.z + v2.z

    return { ret: retval.GO_RESULT_OK, vout: vout }
}

// int go_cart_unit(const go_cart * v, go_cart * vout)
// {
//     go_real size = sqrt(go_sq(v->x) + go_sq(v->y) + go_sq(v->z));
//
//     if (GO_TRAN_SMALL(size)) {
//         vout->x = GO_INF;
//         vout->y = GO_INF;
//         vout->z = GO_INF;
//
//         return GO_RESULT_NORM_ERROR;
//     }
//
//     size = 1.0 / size;
//
//     vout->x = v->x * size;
//     vout->y = v->y * size;
//     vout->z = v->z * size;
//
//     return GO_RESULT_OK;
// }
function go_cart_unit(v: go_cart): { ret: number; vout: go_cart } {
    var size = Math.sqrt(go_sq(v.x) + go_sq(v.y) + go_sq(v.z))
    const vout = new go_cart()

    if (GO_TRAN_SMALL(size)) {
        vout.x = GO_INF
        vout.y = GO_INF
        vout.z = GO_INF

        return { ret: retval.GO_RESULT_NORM_ERROR, vout: vout }
    }

    size = 1.0 / size

    vout.x = v.x * size
    vout.y = v.y * size
    vout.z = v.z * size

    return { ret: retval.GO_RESULT_OK, vout: vout }
}

// #define SIGN(a,b) ((b) >= 0.0 ? fabs(a) : -fabs(a))
// #define MAG2(a,b) sqrt((a)*(a)+(b)*(b))

function COL_IS_UNIT(r): boolean {
    return GO_TRAN_CLOSE(go_sq(r.x) + go_sq(r.y) + go_sq(r.z), 1.0)
}

// int go_mat_is_norm(const go_mat * m)
// {
//     go_cart u;
//
//     go_cart_cart_cross(&m->x, &m->y, &u);
//
//     #define COL_IS_UNIT(r) GO_TRAN_CLOSE(go_sq((r).x) + go_sq((r).y) + go_sq((r).z), 1)
//     return (COL_IS_UNIT(m->x) &&
//     COL_IS_UNIT(m->y) &&
//     COL_IS_UNIT(m->z) &&
//     go_cart_cart_compare(&u, &m->z));
//     #undef COL_IS_UNIT
// }

function go_mat_is_norm(m: go_mat): boolean {
    const { ret, vout } = go_cart_cart_cross(m.x, m.y)
    return (
        COL_IS_UNIT(m.x) &&
        COL_IS_UNIT(m.y) &&
        COL_IS_UNIT(m.z) &&
        Boolean(go_cart_cart_compare(vout, m.z))
    )
}

// int go_quat_norm(const go_quat * q1, go_quat * qout)
// {
//     go_real size;
//
//     size = sqrt(go_sq(q1->s) + go_sq(q1->x) + go_sq(q1->y) + go_sq(q1->z));
//
//     if (GO_ROT_SMALL(size)) {
//         qout->s = 1;
//         qout->x = 0;
//         qout->y = 0;
//         qout->z = 0;
//         return GO_RESULT_NORM_ERROR;
//     }
//     size = 1.0 / size;
//
//     if (q1->s >= 0) {
//         qout->s = q1->s * size;
//         qout->x = q1->x * size;
//         qout->y = q1->y * size;
//         qout->z = q1->z * size;
//
//         return GO_RESULT_OK;
//     } else {
//         qout->s = -q1->s * size;
//         qout->x = -q1->x * size;
//         qout->y = -q1->y * size;
//         qout->z = -q1->z * size;
//
//         return GO_RESULT_OK;
//     }
// }
function go_quat_norm(q1: go_quat): { ret: number; qout: go_quat } {
    const qout = new go_quat()
    var size

    size = Math.sqrt(go_sq(q1.s) + go_sq(q1.x) + go_sq(q1.y) + go_sq(q1.z))
    if (GO_ROT_SMALL(size)) {
        qout.s = 1
        qout.x = 0
        qout.y = 0
        qout.z = 0
        return { ret: retval.GO_RESULT_NORM_ERROR, qout: qout }
    }
    size = 1.0 / size
    if (q1.s >= 0) {
        qout.s = q1.s * size
        qout.x = q1.x * size
        qout.y = q1.y * size
        qout.z = q1.z * size
        return { ret: retval.GO_RESULT_OK, qout: qout }
    } else {
        qout.s = -q1.s * size
        qout.x = -q1.x * size
        qout.y = -q1.y * size
        qout.z = -q1.z * size
        return { ret: retval.GO_RESULT_OK, qout: qout }
    }
}

// int go_quat_inv(const go_quat * q1, go_quat * qout)
// {
//     qout->s = q1->s;
//     qout->x = -q1->x;
//     qout->y = -q1->y;
//     qout->z = -q1->z;
//
//     if (!go_quat_is_norm(q1)) {
//         return GO_RESULT_NORM_ERROR;
//     }
//
//     return GO_RESULT_OK;
// }

export function go_quat_inv(q1: go_quat): { ret: number; qout: go_quat } {
    const qout = new go_quat()

    qout.s = q1.s
    qout.x = -q1.x
    qout.y = -q1.y
    qout.z = -q1.z

    if (!go_quat_is_norm(q1)) {
        return { ret: retval.GO_RESULT_NORM_ERROR, qout: qout }
    }

    return { ret: retval.GO_RESULT_OK, qout: qout }
}

// int go_quat_is_norm(const go_quat * q1)
// {
//     return GO_TRAN_CLOSE(go_sq(q1->s) +
//         go_sq(q1->x) +
//         go_sq(q1->y) +
//         go_sq(q1->z), 1);
// }

function go_quat_is_norm(q1: go_quat): boolean {
    return GO_TRAN_CLOSE(go_sq(q1.s) + go_sq(q1.x) + go_sq(q1.y) + go_sq(q1.z), 1)
}

// int go_quat_quat_mult(const go_quat * q1, const go_quat * q2,
// go_quat * qout)
// {
//     go_quat cp1, cp2;
//
//     if (!go_quat_is_norm(q1) || !go_quat_is_norm(q2)) {
//         return GO_RESULT_NORM_ERROR;
//     }
//
//     cp1 = *q1;
//     cp2 = *q2;
//
//     qout->s = cp1.s * cp2.s - cp1.x * cp2.x - cp1.y * cp2.y - cp1.z * cp2.z;
//
//     if (qout->s >= 0) {
//         qout->x = cp1.s * cp2.x + cp1.x * cp2.s + cp1.y * cp2.z - cp1.z * cp2.y;
//         qout->y = cp1.s * cp2.y - cp1.x * cp2.z + cp1.y * cp2.s + cp1.z * cp2.x;
//         qout->z = cp1.s * cp2.z + cp1.x * cp2.y - cp1.y * cp2.x + cp1.z * cp2.s;
//     } else {
//         qout->s = -qout->s;
//         qout->x = -cp1.s * cp2.x - cp1.x * cp2.s - cp1.y * cp2.z + cp1.z * cp2.y;
//         qout->y = -cp1.s * cp2.y + cp1.x * cp2.z - cp1.y * cp2.s - cp1.z * cp2.x;
//         qout->z = -cp1.s * cp2.z - cp1.x * cp2.y + cp1.y * cp2.x - cp1.z * cp2.s;
//     }
//
//     return GO_RESULT_OK;
// }
function go_quat_quat_mult(q1: go_quat, q2: go_quat): { ret: number; qout: go_quat } {
    const qout = new go_quat()

    if (!go_quat_is_norm(q1) || !go_quat_is_norm(q2)) {
        return { ret: retval.GO_RESULT_NORM_ERROR, qout: qout }
    }

    const cp1: go_quat = q1
    const cp2: go_quat = q2

    qout.s = cp1.s * cp2.s - cp1.x * cp2.x - cp1.y * cp2.y - cp1.z * cp2.z

    if (qout.s >= 0) {
        qout.x = cp1.s * cp2.x + cp1.x * cp2.s + cp1.y * cp2.z - cp1.z * cp2.y
        qout.y = cp1.s * cp2.y - cp1.x * cp2.z + cp1.y * cp2.s + cp1.z * cp2.x
        qout.z = cp1.s * cp2.z + cp1.x * cp2.y - cp1.y * cp2.x + cp1.z * cp2.s
    } else {
        qout.s = -qout.s
        qout.x = -cp1.s * cp2.x - cp1.x * cp2.s - cp1.y * cp2.z + cp1.z * cp2.y
        qout.y = -cp1.s * cp2.y + cp1.x * cp2.z - cp1.y * cp2.s - cp1.z * cp2.x
        qout.z = -cp1.s * cp2.z - cp1.x * cp2.y + cp1.y * cp2.x - cp1.z * cp2.s
    }

    return { ret: retval.GO_RESULT_OK, qout: qout }
}

// int go_quat_cart_mult(const go_quat * q1, const go_cart * v2,
// go_cart * vout)
// {
//     go_cart c;
//
//     if (!go_quat_is_norm(q1)) {
//         return GO_RESULT_NORM_ERROR;
//     }
//
//     c.x = q1->y * v2->z - q1->z * v2->y;
//     c.y = q1->z * v2->x - q1->x * v2->z;
//     c.z = q1->x * v2->y - q1->y * v2->x;
//
//     vout->x = v2->x + 2 * (q1->s * c.x + q1->y * c.z - q1->z * c.y);
//     vout->y = v2->y + 2 * (q1->s * c.y + q1->z * c.x - q1->x * c.z);
//     vout->z = v2->z + 2 * (q1->s * c.z + q1->x * c.y - q1->y * c.x);
//
//     return GO_RESULT_OK;
// }

function go_quat_cart_mult(q1: go_quat, v2: go_cart): { ret: retval; vout: go_cart } {
    const c = new go_cart()
    const vout = new go_cart()

    if (!go_quat_is_norm(q1)) {
        return { ret: retval.GO_RESULT_NORM_ERROR, vout: vout }
    }

    c.x = q1.y * v2.z - q1.z * v2.y
    c.y = q1.z * v2.x - q1.x * v2.z
    c.z = q1.x * v2.y - q1.y * v2.x

    vout.x = v2.x + 2 * (q1.s * c.x + q1.y * c.z - q1.z * c.y)
    vout.y = v2.y + 2 * (q1.s * c.y + q1.z * c.x - q1.x * c.z)
    vout.z = v2.z + 2 * (q1.s * c.z + q1.x * c.y - q1.y * c.x)

    return { ret: retval.GO_RESULT_OK, vout: vout }
}

/* go_pose functions*/

// int go_pose_pose_mult(const go_pose * p1, const go_pose * p2, go_pose * pout)
// {
//     go_pose out;
//     int retval;
//
//     retval = go_quat_cart_mult(&p1->rot, &p2->tran, &out.tran);
//     if (GO_RESULT_OK != retval) return retval;
//
//     retval = go_cart_cart_add(&p1->tran, &out.tran, &out.tran);
//     if (GO_RESULT_OK != retval) return retval;
//
//     retval = go_quat_quat_mult(&p1->rot, &p2->rot, &out.rot);
//
// *pout = out;
//
//     return retval;
// }

export function go_pose_pose_mult(p1: go_pose, p2: go_pose): { ret: number; pout: go_pose } {
    const out = new go_pose()
    // const retval:number = 0;

    const r1 = go_quat_cart_mult(p1.rot, p2.tran)
    if (retval.GO_RESULT_OK != r1.ret) return { ret: r1.ret, pout: out }
    out.tran = r1.vout

    const r2 = go_cart_cart_add(p1.tran, out.tran)
    if (retval.GO_RESULT_OK != r2.ret) return { ret: r2.ret, pout: out }
    out.tran = r2.vout

    const r3 = go_quat_quat_mult(p1.rot, p2.rot)
    if (retval.GO_RESULT_OK != r3.ret) return { ret: r3.ret, pout: out }
    out.rot = r3.qout

    return { ret: retval.GO_RESULT_OK, pout: out }
}

// Lower Upper Decomposition
function ludcmp(A, update): { ret: number; A: number[]; idx: number[]; d: boolean } {
    // A is a matrix that we want to decompose into Lower and Upper matrices.
    console.log(A)
    var d = true
    const n = A.length
    const idx = new Array(n) // Output vector with row permutations from partial pivoting
    const vv = new Array(n) // Scaling information

    for (let i = 0; i < n; i++) {
        let max = 0
        for (let j = 0; j < n; j++) {
            const temp = Math.abs(A[i][j])
            if (temp > max) max = temp
        }
        if (max == 0) return { ret: retval.GO_RESULT_SINGULAR, A: null, idx: null, d: false } // Singular Matrix!
        vv[i] = 1 / max // Scaling
    }

    if (!update) {
        // make a copy of A
        const Acpy = new Array(n)
        for (let i = 0; i < n; i++) {
            var Ai = A[i]
            const Acpyi = new Array(Ai.length)
            for (let j = 0; j < Ai.length; j += 1) Acpyi[j] = Ai[j]
            Acpy[i] = Acpyi
        }
        A = Acpy
    }

    var tiny = 1e-20 // in case pivot element is zero
    for (let i = 0; ; i++) {
        for (let j = 0; j < i; j++) {
            let sum = A[j][i]
            for (let k = 0; k < j; k++) sum -= A[j][k] * A[k][i]
            A[j][i] = sum
        }
        let jmax = 0
        let max = 0
        for (let j = i; j < n; j++) {
            let sum = A[j][i]
            for (var k = 0; k < i; k++) sum -= A[j][k] * A[k][i]
            A[j][i] = sum
            let temp = vv[j] * Math.abs(sum)
            if (temp >= max) {
                max = temp
                jmax = j
            }
        }
        if (i <= jmax) {
            for (let j = 0; j < n; j++) {
                let temp = A[jmax][j]
                A[jmax][j] = A[i][j]
                A[i][j] = temp
            }
            d = !d
            vv[jmax] = vv[i]
        }
        idx[i] = jmax
        if (i == n - 1) break
        var temp = A[i][i] //
        if (temp == 0) A[i][i] = temp = tiny
        temp = 1 / temp
        for (var j = i + 1; j < n; j++) A[j][i] *= temp
    }
    return { ret: retval.GO_RESULT_OK, A: A, idx: idx, d: d }
}

/*
  Adapted from ludcmp routine in Numerical Recipes in C, but with
  indices starting at 0 and no heap allocation.

  Given a matrix a[0..n-1][0..n-1], this routine replaces it by the LU
  decomposition of a rowwise permutation of itself. a and n are
  input. a is changed and output.  indx[0..n-1] is an output vector
  that records the row permutation effected by the partial pivoting; d
  is output as +/-1 depending on whether the number of row
  interchanges was even or odd, respectively. This routine is used in
  combination with lubksb to solve linear equations or invert a
  matrix.

  Warning! The matrix 'a' can't be declared as go_real a[n][n]. It
  needs to be an array of go_real pointers. See e.g. go_mat6_inv() for
  how to set up the 'a' matrix.
*/

// const go_singular_epsilon = 1.0e-15;
//
//
// int ludcmp(go_real ** a,
//     go_real * scratchrow,
//     go_integer n,
// go_integer * indx,
// go_real * d)
// {
//     go_integer i, imax, j, k;
//     go_real big, dum, sum, temp;
//
// *d = 1.0;
//     for (i = 0; i < n; i++) {
//         big = 0.0;
//         for (j = 0; j < n; j++)
//             if ((temp = fabs(a[i][j])) > big)
//                 big = temp;
//         if (big < go_singular_epsilon)
//             return GO_RESULT_SINGULAR;
//         scratchrow[i] = 1.0 / big;
//     }
//     for (j = 0; j < n; j++) {
//         for (i = 0; i < j; i++) {
//             sum = a[i][j];
//             for (k = 0; k < i; k++)
//                 sum -= a[i][k] * a[k][j];
//             a[i][j] = sum;
//         }
//         big = 0.0;
//         imax = 0;
//         for (i = j; i < n; i++) {
//             sum = a[i][j];
//             for (k = 0; k < j; k++)
//                 sum -= a[i][k] * a[k][j];
//             a[i][j] = sum;
//             if ((dum = scratchrow[i] * fabs(sum)) >= big) {
//                 big = dum;
//                 imax = i;
//             }
//         }
//         if (j != imax) {
//             for (k = 0; k < n; k++) {
//                 dum = a[imax][k];
//                 a[imax][k] = a[j][k];
//                 a[j][k] = dum;
//             }
//         *d = -(*d);
//             scratchrow[imax] = scratchrow[j];
//         }
//         indx[j] = imax;
//         if (fabs(a[j][j]) < go_singular_epsilon)
//             return GO_RESULT_SINGULAR;
//         if (j != n - 1) {
//             dum = 1.0 / (a[j][j]);
//             for (i = j + 1; i < n; i++)
//                 a[i][j] *= dum;
//         }
//     }
//
//     return GO_RESULT_OK;
// }

/*
  Solves the set of n linear equations A·X = B. Here a[0..n-1][0..n-1]
  is input, not as the matrix A but rather as its LU decomposition,
  determined by the routine ludcmp. indx[0..n-1] is input as the
  permutation vector returned by ludcmp. b[0..n-1] is input as the
  right-hand side vector B, and returns with the solution vector X. a,
  n, and indx are not modified by this routine and can be left in
  place for successive calls with different right-hand sides b. This
  routine takes into account the possibility that b will begin with
  many zero elements, so it is efficient for use in matrix inversion.

  Warning! The matrix 'a' can't be declared as go_real a[n][n]. It
  needs to be an array of go_real pointers. See e.g. go_mat6_inv() for
  how to set up the 'a' matrix.
*/

// int lubksb(go_real ** a,
//     go_integer n,
// go_integer * indx,
// go_real * b)
// {
//     go_integer i, ii = -1, ip, j;
//     go_real sum;
//
//     for (i = 0; i < n; i++) {
//         ip = indx[i];
//         sum = b[ip];
//         b[ip] = b[i];
//         if (ii != -1)
//             for (j = ii; j <= i - 1; j++)
//                 sum -= a[i][j] * b[j];
//         else if (sum)
//             ii = i;
//         b[i] = sum;
//     }
//     for (i = n - 1; i >= 0; i--) {
//         sum = b[i];
//         for (j = i + 1; j < n; j++)
//             sum -= a[i][j] * b[j];
//         if (fabs(a[i][i]) < go_singular_epsilon)
//             return GO_RESULT_SINGULAR;
//         b[i] = sum / a[i][i];
//     }
//
//     return GO_RESULT_OK;
// }

// Lower Upper Back Substitution
function lubksb(lu, update, b) {
    // solves the set of n linear equations A*x = b.
    // lu is the object containing A, idx and d as determined by the routine ludcmp.
    var A = lu.A
    var idx = lu.idx
    var n = idx.length

    if (!update) {
        // make a copy of b
        var bcpy = new Array(n)
        for (let i = 0; i < b.length; i += 1) bcpy[i] = b[i]
        b = bcpy
    }

    for (let ii = -1, i = 0; i < n; i++) {
        var ix = idx[i]
        let sum = b[ix]
        b[ix] = b[i]
        if (ii > -1) for (let j = ii; j < i; j++) sum -= A[i][j] * b[j]
        else if (sum) ii = i
        b[i] = sum
    }
    for (let i = n - 1; i >= 0; i--) {
        let sum = b[i]
        for (let j = i + 1; j < n; j++) sum -= A[i][j] * b[j]
        b[i] = sum / A[i][i]
    }
    return b // solution vector x
}

// int go_cart_vector_convert(const go_cart * c,
// go_real * v)
// {
//     v[0] = c->x, v[1] = c->y, v[2] = c->z;
//
//     return GO_RESULT_OK;
// }

export function go_cart_vector_convert(c: go_cart): number[] {
    return [c.x, c.y, c.z]
}

// int go_quat_matrix_convert(const go_quat * quat,
// go_matrix * matrix)
// {
//     go_mat mat;
//     int retval;
//
//     /* check for an initialized matrix */
//     // if (0 == matrix->el[0]) return GO_RESULT_ERROR;
//     /* check for a 3x3 matrix */
//     // if (matrix->rows != 3 || matrix->cols != 3) return GO_RESULT_ERROR;
//
//     retval = go_quat_mat_convert(quat, &mat);
//     if (GO_RESULT_OK != retval) return retval;
//
//     return go_mat_matrix_convert(&mat, matrix);
// }

export function go_quat_matrix_convert(quat: go_quat): { ret: number; matrix: go_matrix } {
    const res = go_quat_mat_convert(quat)
    if (res.ret != retval.GO_RESULT_OK) return { ret: res.ret, matrix: null }

    return go_mat_matrix_convert(res.m)
}

/*            |  m.x.x   m.y.x   m.z.x  | */
/* go_mat m = |  m.x.y   m.y.y   m.z.y  | */
/*            |  m.x.z   m.y.z   m.z.z  | */
/* go_matrix mout[row][col]               */

// int go_mat_matrix_convert(const go_mat * mat,
// go_matrix * matrix)
// {
//     /* check for an initialized matrix */
//     if (0 == matrix->el[0]) return GO_RESULT_ERROR;
//     /* check for a 3x3 matrix */
//     if (matrix->rows != 3 || matrix->cols != 3) return GO_RESULT_ERROR;
//
//     matrix->el[0][0] = mat->x.x, matrix->el[0][1] = mat->y.x, matrix->el[0][2] = mat->z.x;
//     matrix->el[1][0] = mat->x.y, matrix->el[1][1] = mat->y.y, matrix->el[1][2] = mat->z.y;
//     matrix->el[2][0] = mat->x.z, matrix->el[2][1] = mat->y.z, matrix->el[2][2] = mat->z.z;
//
//     return GO_RESULT_OK;
// }

function go_mat_matrix_convert(mat: go_mat): { ret: number; matrix: go_matrix } {
    const matrix = new go_matrix(3, 3)

    ;(matrix.el[0][0] = mat.x.x), (matrix.el[0][1] = mat.y.x), (matrix.el[0][2] = mat.z.x)
    ;(matrix.el[1][0] = mat.x.y), (matrix.el[1][1] = mat.y.y), (matrix.el[1][2] = mat.z.y)
    ;(matrix.el[2][0] = mat.x.z), (matrix.el[2][1] = mat.y.z), (matrix.el[2][2] = mat.z.z)
    return { ret: retval.GO_RESULT_OK, matrix: matrix }
}

// go_result go_matrix_matrix_copy(const go_matrix *src,
// go_matrix *dst)
// {
//     go_integer row, col;
//
//     /* check for an initialized matrix */
//     if (0 == src->el[0] || 0 == dst->el[0]) return GO_RESULT_ERROR;
//     /* check for matching rows and cols */
//     if (src->rows != src->rows || src->cols != src->cols) return GO_RESULT_ERROR;
//
//     for (row = 0; row < src->rows; row++) {
//     for (col = 0; col < src->cols; col++) {
//         dst->el[row][col] = src->el[row][col];
//     }
// }
//
//     return GO_RESULT_OK;
// }

export function go_matrix_matrix_copy(src: go_matrix, dst: go_matrix): { ret: number } {
    for (let row = 0; row < src.rows; row++) {
        for (let col = 0; col < src.cols; col++) {
            dst.el[row][col] = src.el[row][col]
        }
    }
    return { ret: retval.GO_RESULT_OK }
}

//
// int go_matrix_matrix_add(const go_matrix * a,
// const go_matrix * b,
// go_matrix * apb)
// {
//     go_integer row, col;
//
//     /* check for matching rows and cols */
//     if (a->rows != b->rows || a->cols != b->cols ||
// b->rows != apb->rows || b->cols != apb->cols) return GO_RESULT_ERROR;
//
//     for (row = 0; row < a->rows; row++) {
//     for (col = 0; col < a->cols; col++) {
//         apb->el[row][col] = a->el[row][col] + b->el[row][col];
//     }
// }
//
//     return GO_RESULT_OK;
// }

export function go_matrix_matrix_add(a: go_matrix, b: go_matrix): { ret: number; apb: go_matrix } {
    const apb = new go_matrix(a.rows, a.cols)
    if (a.rows != b.rows || a.cols != b.cols) return { ret: retval.GO_RESULT_ERROR, apb: apb }

    for (var row = 0; row < a.rows; row++) {
        for (var col = 0; col < a.cols; col++) {
            apb.el[row][col] = a.el[row][col] + b.el[row][col]
        }
    }

    return { ret: retval.GO_RESULT_OK, apb: apb }
}

// int go_matrix_matrix_mult(const go_matrix * a,
// const go_matrix * b,
// go_matrix * ab)
// {
//     go_real ** ptrin;
//     go_real ** ptrout;
//     go_integer row, col, i;
//
//     /* check for an initialized matrix */
//     // if (0 == a->el[0] || 0 == b->el[0] || 0 == ab->el[0]) return GO_RESULT_ERROR;
//     /* check for consistent rows and cols */
//     if (a->cols != b->rows ||
// a->rows != ab->rows ||
// b->cols != ab->cols) return GO_RESULT_ERROR;
//
//     // if (ab == a) {
//     //     /* destructive multiply, use a's copy space and copy back */
//     //     ptrin = a->elcpy;
//     //     ptrout = a->el;
//     // } else if (ab == b) {
//     //     ptrin = b->elcpy;
//     //     ptrout = b->el;
//     // } else {
//     //     ptrin = ab->el;
//     //     ptrout = NULL;
//     // }
//
//     for (row = 0; row < a->rows; row++) {
//     for (col = 0; col < b->cols; col++) {
//         ptrin[row][col] = 0;
//         for (i = 0; i < a->cols; i++) {
//             ptrin[row][col] += a->el[row][i] * b->el[i][col];
//         }
//     }
// }
//
//     if (NULL != ptrout) {
//         for (row = 0; row < ab->rows; row++) {
//             for (col = 0; col < ab->cols; col++) {
//                 ptrout[row][col] = ptrin[row][col];
//             }
//         }
//     }
//
//     return GO_RESULT_OK;
// }

export function go_matrix_matrix_mult(a: go_matrix, b: go_matrix): { ret: number; ab: go_matrix } {
    const ab = new go_matrix(a.rows, b.cols)

    if (a.cols != b.rows || a.rows) return { ret: retval.GO_RESULT_ERROR, ab: null }

    for (var row = 0; row < a.rows; row++) {
        for (var col = 0; col < b.cols; col++) {
            ab.el[row][col] = 0
            for (var i = 0; i < a.cols; i++) {
                ab.el[row][col] += a.el[row][i] * b.el[i][col]
            }
        }
    }

    return { ret: retval.GO_RESULT_OK, ab: ab }

    // if (NULL != ptrout) {
    //     for (row = 0; row < ab->rows; row++) {
    //         for (col = 0; col < ab->cols; col++) {
    //             ptrout[row][col] = ptrin[row][col];
    //         }
    //     }
    // }
}

// int go_matrix_vector_mult(const go_matrix * a,
// const go_vector * v,
// go_vector * axv)
// {
//     go_vector * ptrin;
//     go_vector * ptrout;
//     go_integer row, i;
//
//     /* check for an initialized matrix */
//     // if (0 == a->el[0]) return GO_RESULT_ERROR;
//
//     if (axv == v) {
//         ptrin = a->elcpy[0];
//         ptrout = axv;
//     } else {
//         ptrin = axv;
//         ptrout = NULL;
//     }
//
//     for (row = 0; row < a->rows; row++) {
//     ptrin[row] = 0;
//     for (i = 0; i < a->cols; i++) {
//         ptrin[row] += a->el[row][i] * v[i];
//     }
// }
//
//     if (ptrout != NULL) {
//         for (row = 0; row < a->rows; row++) {
//             ptrout[row] = ptrin[row];
//         }
//     }
//
//     return GO_RESULT_OK;
// }

function go_matrix_vector_mult(a: go_matrix, v: go_vector): { ret: number; axv: go_vector } {
    const axv = new go_vector()

    for (var row = 0; row < a.rows; row++) {
        axv[row] = 0
        for (let i = 0; i < a.cols; i++) {
            axv[row] += a.el[row][i] * v[i]
        }
    }
    return { ret: retval.GO_RESULT_OK, axv: axv }
}

/*
  The matrix-vector cross product is a matrix of the same dimension,
  whose columns are the column-wise cross products of the matrix
  and the vector. The matrices must be 3xN, the vector 3x1.
*/
// int go_matrix_vector_cross(const go_matrix * a,
// const go_vector * v,
// go_matrix * axv)
// {
//     go_real ** ptrin;
//     go_real ** ptrout;
//     go_cart vc;			/* 'v' */
//     go_cart ac;			/* a column of the 'a' matrix */
//     go_cart cross;
//     go_integer row, col;
//
//     // /* check for an initialized matrix */
//     // if (0 == a->el[0] || 0 == axv->el[0]) return GO_RESULT_ERROR;
//     /* check for consistent rows and cols */
//     if (a->rows != 3 ||
//         axv->rows != 3 ||
// a->cols != axv->cols) return GO_RESULT_ERROR;
//
//     if (axv == a) {
//         /* destructive multiply, use a's copy space and copy back */
//         ptrin = a->elcpy;
//         ptrout = a->el;
//     } else {
//         ptrin = axv->el;
//         ptrout = NULL;
//     }
//     /* get 'v' as a cartesian type */
//     vc.x = v[0], vc.y = v[1], vc.z = v[2];
//     for (col = 0; col < a->cols; col++) {
//     /* pick off the col'th column as a cartesian type */
//     ac.x = a->el[0][col], ac.y = a->el[1][col], ac.z = a->el[2][col];
//     /* cross it with v */
//     go_cart_cart_cross(&ac, &vc, &cross);
//     /* make it the col'th column of axv[] */
//     ptrin[0][col] = cross.x, ptrin[1][col] = cross.y, ptrin[2][col] = cross.z;
// }
//
//     if (ptrout != NULL) {
//         for (row = 0; row < a->rows; row++) {
//             for (col = 0; col < a->cols; col++) {
//                 ptrout[row][col] = ptrin[row][col];
//             }
//         }
//     }
//     return GO_RESULT_OK;
// }

export function go_matrix_vector_cross(
    a: go_matrix,
    v: go_vector
): { ret: number; axv: go_matrix } {
    // const ac:go_cart =new go_cart()
    // const cross:go_cart =new go_cart()

    // go_integer row, col;

    const axv = new go_matrix(3, a.cols)

    if (a.rows != 3 || axv.rows != 3 || a.cols != axv.cols)
        return { ret: retval.GO_RESULT_ERROR, axv: null }

    const vc = new go_cart(v[0], v[1], v[2])

    for (let col = 0; col < a.cols; col++) {
        const ac = new go_cart(a.el[0][col], a.el[1][col], a.el[2][col])
        const { ret, vout } = go_cart_cart_cross(ac, vc)
        axv.el[0][col] = vout.x
        axv.el[1][col] = vout.y
        axv.el[2][col] = vout.z
    }

    return { ret: retval.GO_RESULT_OK, axv: axv }
}

// int go_matrix_transpose(const go_matrix * a,
// go_matrix * at)
// {
//     go_real ** ptrin;
//     go_real ** ptrout;
//     go_integer row, col;
//
//     // /* check for fixed matrix */
//     // if (0 == a->el[0] || 0 == at->el[0]) return GO_RESULT_ERROR;
//     //
//     // if (at == a) {
//     //     ptrin = a->elcpy;
//     //     ptrout = a->el;
//     // } else {
//     //     ptrin = at->el;
//     //     ptrout = NULL;
//     // }
//
//     for (row = 0; row < a->rows; row++) {
//     for (col = 0; col < a->cols; col++) {
//         ptrin[col][row] = a->el[row][col];
//     }
// }
//
//     // if (ptrout != NULL) {
//     //     for (row = 0; row < a->rows; row++) {
//     //         for (col = 0; col < a->cols; col++) {
//     //             ptrout[row][col] = ptrin[row][col];
//     //         }
//     //     }
//     // }
//
//     return GO_RESULT_OK;
// }

export function go_matrix_transpose(a: go_matrix): { ret: number; at: go_matrix } {
    const at = new go_matrix(a.cols, a.rows)

    for (let row = 0; row < a.rows; row++) {
        for (let col = 0; col < a.cols; col++) {
            at.el[col][row] = a.el[row][col]
        }
    }

    return { ret: retval.GO_RESULT_OK, at: at }
}

function arraysEqual(a, b) {
    if (a === b) return true
    if (a == null || b == null) return false
    if (a.length !== b.length) return false

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.

    for (var i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) return false
    }
    return true
}

// int go_matrix_inv(const go_matrix * m, /* M x N */
// go_matrix * minv) /* N x M */
// {
//     go_real d;
//     go_integer N, row, col;
//     int retval;
//
//     // /* check for fixed matrix */
//     // if (0 == m->el[0] || 0 == minv->el[0]) return GO_RESULT_ERROR;
//
//     // N = m->rows;
//     //
//     /* copy of m since ludcmp destroys input matrix */
//     for (row = 0; row < N; row++) {
//         for (col = 0; col < N; col++) {
//             m->elcpy[row][col] = m->el[row][col];
//         }
//     }
//
//     /* convert the copy to its LU decomposition  */
//     retval = ludcmp(m->elcpy, m->v, N, m->index, &d);
//     if (GO_RESULT_OK != retval) return retval;
//
//     /* backsubstitute a column with a 1 in it to get the inverse */
//     for (col = 0; col < N; col++) {
//         for (row = 0; row < N; row++) {
//             m->v[row] = 0.0;
//         }
//         m->v[col] = 1.0;
//         retval = lubksb(m->elcpy, N, m->index, m->v);
//         if (GO_RESULT_OK != retval) return retval;
//         for (row = 0; row < N; row++) {
//             minv->el[row][col] = m->v[row];
//         }
//     }
//
//     return GO_RESULT_OK;
// }

export function go_matrix_inv(m: go_matrix): { ret: number; minv: go_matrix } {
    const v: go_matrix = new go_matrix(m.cols, m.rows)
    const N: number = m.rows
    console.log("m1", m)
    // /* check for fixed matrix */
    //     if (0 == m.el[0] || 0 == minv->el[0]) return GO_RESULT_ERROR;

    //     /* copy of m since ludcmp destroys input matrix */
    //todo our function can preseve the matrix
    for (let row: number = 0; row < N; row++) {
        for (let col: number = 0; col < N; col++) {
            m.elcpy[row][col] = m.el[row][col]
        }
    }
    console.log("m2", m)
    //     retval = ludcmp(m->elcpy, m->v, N, m->index, &d);

    // const res = ludcmp([].concat.apply([], m.elcpy), 0)

    const res = ludcmp(m.elcpy, 1)

    //     /* backsubstitute a column with a 1 in it to get the inverse */
    //     for (col = 0; col < N; col++) {
    //         for (row = 0; row < N; row++) {
    //             m->v[row] = 0.0;
    //         }
    //         m->v[col] = 1.0;
    //         retval = lubksb(m->elcpy, N, m->index, m->v);
    //         if (GO_RESULT_OK != retval) return retval;
    //         for (row = 0; row < N; row++) {
    //             minv->el[row][col] = m->v[row];
    //         }
    //     }

    for (let col: number = 0; col < N; col++) {
        for (let row: number = 0; row < N; row++) {
            res.A[row] = 0.0
        }
        res.A[col] = 1.0

        var vec = []
        const retval = lubksb({ A: res.A, idx: res.idx, d: res.d }, true, vec)

        if (retval.GO_RESULT_OK != retval) return retval
        for (let row = 0; row < N; row++) {
            // minv->el[row][col] = m.v[row];
        }
        //todo
    }
}

/* recall:                          */
/*      |  m.x.x   m.y.x   m.z.x  | */
/* M =  |  m.x.y   m.y.y   m.z.y  | */
/*      |  m.x.z   m.y.z   m.z.z  | */

// int go_dh_pose_convert(const go_dh * dh, go_pose * p)
// {
//     go_hom h;
//     go_real sth, cth;		/* sin, cos theta[i] */
//     go_real sal, cal;		/* sin, cos alpha[i-1] */
//
//     pm_sincos(dh->theta, &sth, &cth);
//     pm_sincos(dh->alpha, &sal, &cal);
//
//     h.rot.x.x = cth, h.rot.y.x = -sth, h.rot.z.x = 0.0;
//     h.rot.x.y = sth*cal, h.rot.y.y = cth*cal, h.rot.z.y = -sal;
//     h.rot.x.z = sth*sal, h.rot.y.z = cth*sal, h.rot.z.z = cal;
//
//     h.tran.x = dh->a;
//     h.tran.y = -sal*dh->d;
//     h.tran.z = cal*dh->d;
//
//     return go_hom_pose_convert(&h, p);
// }

export function go_dh_pose_convert(dh: go_dh): { ret: number; pout: go_pose } {
    const h: go_hom = new go_hom()
    // var sth
    // var cth
    const [sth, cth] = pm_sincos(dh.theta)
    //     var sal
    // var cal
    const [sal, cal] = pm_sincos(dh.alpha)

    h.rot.x.x = cth
    h.rot.y.x = -sth
    h.rot.z.x = 0.0
    h.rot.x.y = sth * cal
    h.rot.y.y = cth * cal
    h.rot.z.y = -sal
    h.rot.x.z = sth * sal
    h.rot.y.z = cth * sal
    h.rot.z.z = cal

    h.tran.x = dh.a
    h.tran.y = -sal * dh.d

    h.tran.z = cal * dh.d
    return go_hom_pose_convert(h)
}

// int go_pose_dh_convert(const go_pose * ph, go_dh * dh)
// {
//     go_hom h;
//
//     go_pose_hom_convert(ph, &h);
//
//     dh->a = h.tran.x;
//     dh->alpha = -atan2(h.rot.z.y, h.rot.z.z);
//     dh->theta = -atan2(h.rot.y.x, h.rot.x.x);
//     if (GO_ROT_SMALL(dh->alpha)) {
//         dh->d = h.tran.z / cos(dh->alpha);
//     } else {
//         dh->d = -h.tran.y / sin(dh->alpha);
//     }
//
//     return GO_RESULT_OK;
// }

function go_pose_dh_convert(ph: go_pose): { ret: number; dh: go_dh } {
    const dh: go_dh = new go_dh()

    const { ret, h } = go_pose_hom_convert(ph)

    dh.a = h.tran.x
    dh.alpha = -Math.atan2(h.rot.z.y, h.rot.z.z)
    dh.theta = -Math.atan2(h.rot.y.x, h.rot.x.x)
    if (GO_ROT_SMALL(dh.alpha)) {
        dh.d = h.tran.z / Math.cos(dh.alpha)
    } else {
        dh.d = -h.tran.y / Math.sin(dh.alpha)
    }
    return { ret: retval.GO_RESULT_OK, dh: dh }
}

// /*! Types of link parameter representations  */
// enum {
//     GO_LINK_DH = 1,		/*!< for Denavit-Hartenberg params  */
//     GO_LINK_PK,			/*!< for parallel kinematics  */
//     GO_LINK_URDF			/*!< Unified Robot Description Language */
// };

export enum LinkParamRepresentation {
    GO_LINK_DH = 1,
    GO_LINK_PK = 2,
    GO_LINK_PP = 3,
    GO_LINK_URDF = 4
}

/*
  Joints are characterized by the quantities they affect, such as
  length for linear joints and angle for rotary joints.
*/
export enum LinkQuantities {
    GO_QUANTITY_NONE = 0,
    GO_QUANTITY_LENGTH,
    GO_QUANTITY_ANGLE
}

// int go_link_joint_set(const go_link * link, go_real joint, go_link * linkout)
// {
//     go_pose pose;
//     go_rvec rvec;
//     int retval;
//
//     linkout->type = link->type;
//     linkout->quantity = link->quantity;
//
//     if (GO_LINK_DH == link->type) {
//     linkout->u.dh.a = link->u.dh.a;
//     linkout->u.dh.alpha = link->u.dh.alpha;
//     if (GO_QUANTITY_LENGTH == link->quantity) {
//         linkout->u.dh.d = joint;
//         linkout->u.dh.theta = link->u.dh.theta;
//     } else {
//         linkout->u.dh.d = link->u.dh.d;
//         linkout->u.dh.theta = joint;
//     }
//     return GO_RESULT_OK;
// }
//
//     if (GO_LINK_PP == link->type) {
//     pose = go_pose_identity();
//     if (GO_QUANTITY_LENGTH == link->quantity) {
//         pose.tran.z = joint;
//         return go_pose_pose_mult(&link->u.pp.pose, &pose, &linkout->u.pp.pose);
//     }
//     /* else revolute */
//     rvec.x = 0, rvec.y = 0, rvec.z = joint; /* rot(Z,joint) */
//     retval = go_rvec_quat_convert(&rvec, &pose.rot);
//     if (GO_RESULT_OK != retval) return retval;
//     return go_pose_pose_mult(&link->u.pp.pose, &pose, &linkout->u.pp.pose);
// }
//
//     if (GO_LINK_PK == link->type) {
//     /*
//       Our PK type is always a length joint, so link->quantity must
//       be GO_QUANTITY_LENGTH. One day we may be able to handle revolute
//       parallel joints, but we can't now. Let's fail if we ever get
//       a revolute joint.
//       FIXME-- add revolute joints to PKMs.
//     */
//     if (GO_QUANTITY_LENGTH != link->quantity) {
//         return GO_RESULT_IMPL_ERROR;
//     }
//     /* else we're a prismatic joint */
//     linkout->u.pk.base = link->u.pk.base;
//     linkout->u.pk.platform = link->u.pk.platform;
//     linkout->u.pk.d = joint;
//     return GO_RESULT_OK;
// }
//
//     /* else not a recognized link type */
//     return GO_RESULT_ERROR;
// }

function go_link_joint_set(link: go_link, joint: number): { ret: number; linkout: go_link } {
    const linkout: go_link = new go_link()
    linkout.type = link.type
    linkout.quantity = link.quantity
    const pose = go_pose_identity()

    if (link.type == LinkParamRepresentation.GO_LINK_DH) {
        linkout.dh.a = link.dh.a
        linkout.dh.alpha = link.dh.alpha
        if (link.quantity == LinkQuantities.GO_QUANTITY_LENGTH) {
            linkout.dh.d = joint
            linkout.dh.theta = link.dh.theta
        } else {
            linkout.dh.d = link.dh.d
            linkout.dh.theta = joint
        }
        return { ret: retval.GO_RESULT_OK, linkout: linkout }
    }

    if (link.type == LinkParamRepresentation.GO_LINK_PP) {
        if (link.quantity == LinkQuantities.GO_QUANTITY_LENGTH) {
            pose.tran.z = joint

            var ret1
            ;({ ret: ret1, pout: linkout.pp.pose } = go_pose_pose_mult(link.pp.pose, pose))

            return { ret: ret1, linkout }
        }
    }
    const rvec: go_rvec = new go_rvec()
    rvec.x = 0
    rvec.y = 0
    rvec.z = joint
    //     retval = go_rvec_quat_convert(&rvec, &pose.rot);
    //     if (GO_RESULT_OK != retval) return retval;
    //     return go_pose_pose_mult(&link->u.pp.pose, &pose, &linkout->u.pp.pose);
    // }

    var ret2
    ;({ ret: ret2, q: pose.rot } = go_rvec_quat_convert(rvec))

    if (ret2 != retval.GO_RESULT_OK) {
        return { ret: ret2, linkout: linkout }
    }
    // return {ret: go_pose_pose_mult(link.pp.pose, pose2, linkout.pp.pose), linkout: linkout};

    if (link.type == LinkParamRepresentation.GO_LINK_PK) {
        if (link.quantity != LinkQuantities.GO_QUANTITY_LENGTH) {
            return { ret: retval.GO_RESULT_IMPL_ERROR, linkout: linkout }
        }
        linkout.pk.base = link.pk.base
        linkout.pk.platform = link.pk.platform
        linkout.pk.d = joint
        return { ret: retval.GO_RESULT_OK, linkout: linkout }
    }
}

/* this only works for serial-link manipulators */
// int go_link_pose_build(const go_link * link_params, go_integer num, go_pose * pose)
// {
//     go_pose p;
//     go_integer link;
//
// *pose = go_pose_identity();
//
//     for (link = 0; link < num; link++) {
//         if (GO_LINK_DH == link_params[link].type) {
//             go_dh_pose_convert(&link_params[link].u.dh, &p);
//             go_pose_pose_mult(pose, &p, pose);
//         } else if (GO_LINK_PP == link_params[link].type) {
//             go_pose_pose_mult(pose, &link_params[link].u.pp.pose, pose);
//         } else {
//             return GO_RESULT_ERROR;
//         }
//     }
//
//     return GO_RESULT_OK;
// }
function go_link_pose_build(link_params: go_link[], num: number): { ret: number; pose: go_pose } {
    const pose: go_pose = go_pose_identity()
    for (let link = 0; link < num; link++) {
        if (LinkParamRepresentation.GO_LINK_DH == link_params[link].type) {
            const { ret: ret1, pout: p1 } = go_dh_pose_convert(link_params[link].dh)
            const { ret: ret2, pout: p2 } = go_pose_pose_mult(pose, p1)
        } else if (LinkParamRepresentation.GO_LINK_PP == link_params[link].type) {
            const { ret: res3, pout: p3 } = go_pose_pose_mult(pose, link_params[link].pp.pose)
        } else {
            return { ret: retval.GO_RESULT_ERROR, pose: null }
        }
    }
    return { ret: retval.GO_RESULT_OK, pose: pose }
}
