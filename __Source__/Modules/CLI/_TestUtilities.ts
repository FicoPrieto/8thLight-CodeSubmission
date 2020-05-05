//###  Module  ###//
import {_Command} from "./Command"


//#########################//
//###  Exports.Private  ###//
//#########################//

/** A mock of `Vorpal`. */
export namespace Vorpal{

	/** A mock of `Vorpal`'s `CommandInstance` class. */
	export class CommandInstance{
		constructor(args:{name:string, args:string}){
			Object.assign(this, {
				commandObject:  {_name:   args.name                  },
				commandWrapper: {command: `${args.name} ${args.args}`},
			})
		}
	}
}

/** Executes `_Command.build` with a mock of `Vorpal`'s `CommandInstance` class. */
export function build(args:{name:string, args:string}){
	const commandInstance = new Vorpal.CommandInstance(args)
	return _Command.build(commandInstance)
}

/** Retrieves `arguments.positional.object` from `_Command.build` with a mock of `Vorpal`'s `CommandInstance` class. */
export function positional(args:{name:string, args:string})
	{return build(args).arguments.positional.object}
