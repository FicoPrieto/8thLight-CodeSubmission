//###  App  ###//
import Settings      from "../../../Settings"
import {Environment} from "../../../Modules/Environment/__Main__"
import {truncate   } from "../../../Modules/Log/Format"
import {Prompt     } from "../../../Modules/Prompt/__Main__"

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

function _get_SelectionPrompt(volumes:Volume[]){
	const choiceMap            = _build_ChoiceMap(volumes)
	const resultsTotal_Message = _get_Pluralized_BookMessage(volumes, Message.found)

	return Prompt.MultiSelect({
		choiceMap,
		messages: {
			on_Display: `${resultsTotal_Message}\n${Message.select}`,
			on_Cancel:  Message.noResults,
			on_Submit:  (selections) => _get_Pluralized_BookMessage(selections, Message.saved),
		},
		choiceFormatter: Prompt.MultiSelect.Formatter.Highlight_FirstLine_Only,
	})
}

function _build_ChoiceMap(volumes:Volume[]){
	const choiceMap:Prompt.MultiSelect.ChoiceMap<Volume> = {}

	for(const volume of volumes){
		const volumeString = _build_VolumeString(volume)
		choiceMap[volume.id] = {choice:volumeString, value:volume}
	}

	return choiceMap
}

function _build_VolumeString(volume:Volume){
	const lines = []

	lines.push(volume.volumeInfo.title)

	if(volume.volumeInfo.authors){
		const authors   = volume.volumeInfo.authors.join(", ")
		const authorKey = (volume.volumeInfo.authors.length == 1) ? "Author: " : "Authors:"
		lines.push(`${authorKey}   ${authors}`)
	}

	if(volume.volumeInfo.publisher)
		{lines.push(`Publisher: ${volume.volumeInfo.publisher}`)}

	const promptWidth = (Settings.UI.maximum_LineWidth - Settings.UI.indentationWidth)

	return (
		lines
			.map(line => truncate(line, promptWidth))
			.join("\n")
			.concat("\n")
	)
}

function _get_Pluralized_BookMessage(volumes:Volume[], suffix:string){
	const bookDescriptor = (volumes.length == 1) ? "book was" : "books were"
	return `${volumes.length} ${bookDescriptor} ${suffix}`
}
