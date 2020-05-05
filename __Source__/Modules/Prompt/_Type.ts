//###  TODO  ###//
// types are in development,
// remove this file, its implementations, and related `any` typings when issue closed:
// https://github.com/enquirer/enquirer/issues/135


//########################//
//###  Exports.Public  ###//
//########################//

export type Prompt<ValueType> = {
	run: (() => Promise<ValueType[]>)
}
