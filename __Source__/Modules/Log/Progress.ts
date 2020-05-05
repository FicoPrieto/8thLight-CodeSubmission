//###  App  ###//
import Settings from "../../Settings"

//###  Node  ###//
import {Writable} from "stream"

//###  NPM  ###//
import ora from "ora"


//##################################//
//###  Exports.Namespace.Public  ###//
//##################################//

export namespace Progress{

	export type Spinner = ora.Ora

	/** Returns an `ora` instance, with output disabled if the test environment is active. */
	export function Spinner(text:string){
		const stream =
			(process.env[Settings.testEnvironment_Key])
			? {stream:_NoOutput_Stream}
			: {}

		const spinner = ora({text, ...stream})
		return spinner
	}

}


//###################//
//###  Utilities  ###//
//###################//

const _NoOutput_Stream = new Writable({
	write: ((chunk, encoding, done) => done())
})
