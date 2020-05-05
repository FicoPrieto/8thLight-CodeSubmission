//###  Reference  ###//
// https://github.com/dthree/vorpal/blob/51f5e2b545631b6a86c9781c274a1b0916a67ee8/dist/vorpal-commons.js#L20-L41

//###  App ###//
import {Style         } from "../Log/Style"
import {tab, multiLine} from "../Log/Format"

//###  NPM  ###//
import _ from "lodash"


//##################//
//###  Settings  ###//
//##################//

const commandOrder = [
	"find",
	"list",
	"help",
	"exit",
]


//#########################//
//###  Exports.Public  ###//
//#########################//

export function override_Help(vorpal:Vorpal){
	_update_AppHelp             (vorpal)
	_update_CommandHelp         (vorpal)
	_update_ExitDescription     (vorpal)
	_reorder_Commands           (vorpal)
	_format_CommandsDescriptions(vorpal)
}


//###############//
//###  Utils  ###//
//###############//

type Vorpal = any

const vorpal_TabWidth = 2

function _get_HelpMessage(vorpal:Vorpal){
	const message = multiLine(
		vorpal
			.find("help").parent._commandHelp()
			.replace(/^Commands\:/, Style.Font.dim.white("$1Commands:"))
			.split("\n")
			.map((line, i) => (i > 0) ? `${tab}${line.substring(vorpal_TabWidth)}` : line)
			.join("\n")
	, {indent:1})

	return `\n${message}\n`
}

function _update_AppHelp(vorpal:Vorpal){
	const help = vorpal.find("help")
	help.remove()

	vorpal
		.command    ("help"                                  )
		.description("Displays a list of available commands.")
		.action(function(){
			return new Promise(async (resolve) => {
				const helpMessage = _get_HelpMessage(vorpal)
				this.log(helpMessage)
				resolve()
			})
		})
}

function _update_CommandHelp(vorpal:Vorpal){
	for(const command of vorpal.commands){
		command.helpInformation = ()=>{
			const helpMessage = _get_HelpMessage(vorpal)
			return helpMessage
		}
	}
}

function _update_ExitDescription(vorpal:Vorpal){
	const exit = vorpal.find("exit")
	exit._description = "Exits the application.\n"
}

function _reorder_Commands(vorpal:Vorpal){
	vorpal.commands = vorpal.commands.sort((a, b) => (
		(commandOrder.indexOf(a._name) > commandOrder.indexOf(b._name))
		? 1
		: -1
	))
}

function _format_CommandsDescriptions(vorpal:Vorpal){
	const lastIndex = (commandOrder.length - 1)
	vorpal.commands.forEach((command, i) => {
		command._description = Style.Color.grey(command._description)
		if(i != lastIndex)
			{command._description += "\n"}
	})
}
