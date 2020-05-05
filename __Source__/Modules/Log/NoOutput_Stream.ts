//###  Node  ###//
import {Writable} from "stream"


//########################//
//###  Exports.Public  ###//
//########################//

/** A stream to use for silencing output during testing. */
export const NoOutput_Stream = new Writable({
	write: ((chunk, encoding, done) => done())
})
