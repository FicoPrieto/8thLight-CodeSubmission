//###  Module  ###//
import {query_API            } from "./query_API"
import {get_UserSelections   } from "./get_UserSelections"
import {store_SelectedVolumes} from "./store_SelectedVolumes"

//###  App  ###//
import {App}     from "../../__Main__"
import Settings  from "../../../Settings"
import {Action } from "../../../Modules/CLI/Action"
import {Command} from "../../../Modules/CLI/Command"


//#################//
//###  Aliases  ###//
//#################//

const Output = Settings.Output.Command.Find


//####################//
//###  Initialize  ###//
//####################//

App
	.command    (Output.command    )
	.description(Output.description)
	.allowUnknownOptions()
	.action(Action.Basic(__Main__))


//##############//
//###  Main  ###//
//##############//

async function __Main__(command:Command){
	const keyword = command.arguments.raw
	const {volumes:foundVolumes, error} = await query_API(keyword)
	const selectedVolumes = (error) ? [] : await get_UserSelections(foundVolumes)
	store_SelectedVolumes(selectedVolumes)

	return {foundVolumes, selectedVolumes, error}
}
