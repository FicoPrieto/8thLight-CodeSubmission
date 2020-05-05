
//#########################//
//###  Exports.Private  ###//
//#########################//

export type integer = number
export type double  = number

/** Constructs a type with all properties of `Type` set to optional, but requires at least one of those properties to exist. */
// Reference: https://stackoverflow.com/a/48244432/4955183
export type RequiredPartial<Type> = Partial<Type> & Union<Type>[keyof Union<Type>]


//###################//
//###  Utilities  ###//
//###################//

/** Helper type for `RequiredPartial`, ensures that at least one property exists. */
type Union<Type> = {[Key in keyof Type]: Pick<Type, Key>}
