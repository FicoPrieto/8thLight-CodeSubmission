//###  Module  ###//
import {Action} from "./Action"
import {Vorpal} from "./_TestUtilities"


//###############//
//###  Setup  ###//
//###############//

let command:  Vorpal.CommandInstance
let callback: (() => Promise<any>)


//###############//
//###  Tests  ###//
//###############//

test("`Action.Basic` receives `Command` and returns value", async ()=>{
	command = new Vorpal.CommandInstance({name:"foo", args:"1 2 3"})
	callback = Action.Basic(async (command) => command.arguments.positional.object)
	expect(await callback.apply(command)).toEqual([1, 2, 3])
})
