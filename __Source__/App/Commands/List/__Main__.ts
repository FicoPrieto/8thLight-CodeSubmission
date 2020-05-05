//###  App  ###//
import {display_ReadingList} from "./display_ReadingList"
import {App                } from "../../__Main__"
import Settings              from "../../../Settings"
import {Action   }           from "../../../Modules/CLI/Action"
import {Command  }           from "../../../Modules/CLI/Command"


//#################//
//###  Aliases  ###//
//#################//

const Output = Settings.Output.Command.List


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
	const books = App.database.Books.value()
	display_ReadingList(books)
}
