//###  Reference  ###//
// https://github.com/microsoft/TypeScript/issues/1897#issuecomment-580962081

//###  TODO  ###//
// This implementation was found on a current TypeScript
//   feature request to add an official JSON type.
// Remove this file & refactor implementations when issue closed:
//   https://github.com/microsoft/TypeScript/issues/1897


//########################//
//###  Exports.Public  ###//
//########################//

export type Json =
	| null
	| boolean
	| number
	| string
	| Json[]
	| {[key:string]: Json}
