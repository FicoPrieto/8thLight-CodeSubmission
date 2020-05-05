//###  Module  ###//
import {Command, _Command} from "./Command"


//##################################//
//###  Exports.Namespace.Public  ###//
//##################################//

/**
* Contains utility functions that:
*  - provide `Vorpal.Command.action`s with access to `Command` data
*  - automatically handle `Promise` resolution as required by `Vorpal`
*/
export namespace Action{

	/** Executes the provided callback and returns the result. */
	export function Basic(callback:((command:Command) => Promise<any>)){
		return function(): Promise<any>{
			const commandInstance = this

			return new Promise(async (resolve) => {
				const command = _Command.build(commandInstance)
				const result  = await callback(command)
				resolve(result)
			})
		}
	}

}
