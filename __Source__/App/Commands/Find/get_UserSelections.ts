//###  App  ###//
import {build_BookString, convert_Volume_To_Book} from "../../Utilities"
import Settings                                   from "../../../Settings"
import {Environment}                              from "../../../Modules/Environment/__Main__"
import {Prompt     }                              from "../../../Modules/Prompt/__Main__"

//###  NPM  ###//
import {Volume} from "../../../NPM/GoogleBooks/__Main__"


//#################//
//###  Aliases  ###//
//#################//

const Message = Settings.Output.Command.Find.get_UserSelection


//#################################//
//###  Exports.Function.Public  ###//
//#################################//

export async function get_UserSelections(volumes:Volume[]){
	const prompt = _get_SelectionPrompt(volumes)

	return (
		(Environment.is_Testing)
		? prompt
		: await prompt.run()
	)
}


//###################//
//###  Utilities  ###//
//###################//

const _truncationWidth = (Settings.UI.maximum_LineWidth - Settings.UI.indentationWidth)

function _get_SelectionPrompt(volumes:Volume[]){
	const choiceMap            = _build_ChoiceMap(volumes)
	const resultsTotal_Message = Message.found(volumes.length)

	return Prompt.MultiSelect({
		choiceMap,
		messages: {
			on_Display: `${resultsTotal_Message}\n${Message.select}`,
			on_Cancel:  Message.noResults,
			on_Submit:  (selections) => Message.saved(selections.length),
		},
		choiceFormatter: Prompt.MultiSelect.Formatter.Highlight_FirstLine_Only,
	})
}

function _build_ChoiceMap(volumes:Volume[]){
	const choiceMap:Prompt.MultiSelect.ChoiceMap<Volume> = {}

	for(const volume of volumes){
		const book           = convert_Volume_To_Book(volume)
		const bookString     = build_BookString(book, _truncationWidth)
		choiceMap[volume.id] = {choice:bookString, value:volume}
	}

	return choiceMap
}
