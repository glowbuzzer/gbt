import { Quaternion } from "three"

export function quaternion_to_axis_angle(q: Quaternion, to_local_units): number[] {
    const q1 = q.clone().normalize() // ensure quaternion is normalised to avoid errors
    const angle = 2 * Math.acos(q1.w)
    const s = Math.sqrt(1 - q1.w * q1.w) // assuming quaternion normalised then w is less than 1, so term always positive.
    if (s < 0.00001) {
        // test to avoid divide by zero, s is always positive due to sqrt
        // if s close to zero then direction of axis not important
        return [1, 0, 0, to_local_units(angle)] // axis is unimportant so make sure it is normalised
    }
    return [q1.x / s, q1.y / s, q1.z / s, to_local_units(angle)]
}
