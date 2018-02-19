// Double precision 64-bit floating point values. It can be used to represent both, integers and fractions.

interface Team {
    readonly name: string,  // => A team must have a name
    readonly id?: number    // => It may have an optional id
}

export default Team
