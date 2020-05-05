//###  Module  ###//
import {NoOutput_Stream} from "./NoOutput_Stream"

//###  App  ###//
import Settings from "../../Settings"

//###  NPM  ###//
import ora from "ora"


//##################################//
//###  Exports.Namespace.Public  ###//
//##################################//

export namespace Progress{

	export type Spinner = ora.Ora

	/** Returns an `ora` instance, with output disabled if the test environment is active. */
	export function Spinner(text:string){
		const stream  = (process.env[Settings.testEnvironment_Key]) ? {stream:NoOutput_Stream} : {}
		const spinner = ora({text, ...stream})
		return spinner
	}

}
