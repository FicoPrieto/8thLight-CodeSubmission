//###  App  ###//
import {App}      from "../../App"
import Settings   from "../../Settings"
import {Progress} from "../../Modules/Log/Progress"

//###  NPM  ###//
import {Volume} from "../../NPM/GoogleBooks/__Main__"


//#################//
//###  Aliases  ###//
//#################//

const {log, newLine} = App
const Message        = Settings.Output.Command.Find.query_API


//#################################//
//###  Exports.Function.Public  ###//
//#################################//

export async function query_API(keyword:string){
	const spinner = Progress.Spinner(Message.inProgress)

	spinner.start()
	const {volumes, error} = await _get_MatchingVolumes(keyword)

	if(error)
		{_on_Error(spinner)}
	else if(volumes.length == 0)
		{_on_NoResults(spinner)}
	else
		{_on_Success(spinner)}

	return {volumes, error}
}


//##################//
//###  Outcomes  ###//
//##################//

function _on_Error(spinner:Progress.Spinner){
	spinner.fail()
	log(Message.fail)
	newLine()
}

function _on_NoResults(spinner:Progress.Spinner){
	spinner.fail()
	log(Message.noResults)
	newLine()
}

async function _on_Success(spinner:Progress.Spinner)
	{spinner.succeed()}


//###################//
//###  Utilities  ###//
//###################//

async function _get_MatchingVolumes(keyword:string){
	const {result:volumes, error} = await Volume.List.get({
		query:      {keyword},
		maxResults: Settings.maximum_QueryResults,
		printType:  "books",
		projection: "lite",
		fields: [
			"id",
			"volumeInfo.authors",
			"volumeInfo.title",
			"volumeInfo.publisher",
		]
	})

	return {volumes, error}
}
