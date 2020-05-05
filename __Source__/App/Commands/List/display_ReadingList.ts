//###  App  ###//
import {App             } from "../../__Main__"
import {build_BookString} from "../../Utilities"
import {Book            } from "../../Database/Types"
import Settings           from "../../../Settings"
import {indent         }  from "../../../Modules/Log/Format"
import {Style as _Style}  from "../../../Modules/Log/Style"


//#################//
//###  Aliases  ###//
//#################//

const {log, newLine} = App
const Message        = Settings.Output.Command.List.display_ReadingList
const {Preset:Style} = _Style


//#################################//
//###  Exports.Function.Public  ###//
//#################################//

export async function display_ReadingList(books:Book[]){
	const countMessage = Message.count(books.length)

	if(books.length == 0){
		log(Style.Bold(`${countMessage}.`))
		log(Message.noResults)
		newLine()
	}
	else{
		log(Style.Bold(`${countMessage}:`))
		newLine()

		for(const book of books){
			const bookString = _get_Formatted_BookString(book)
			log(bookString)
		}
	}
}


//###################//
//###  Utilities  ###//
//###################//

function _get_Formatted_BookString(book:Book){
	let result = build_BookString(book, Settings.UI.maximum_LineWidth)
	result     = _bold_FirstLine(result)
	result     = indent(result, 1)

	return result
}

function _bold_FirstLine(text:string){
	const lines = text.split("\n")
	lines[0] = Style.Bold(lines[0])
	return lines.join("\n")
}
