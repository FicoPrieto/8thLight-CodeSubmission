//###  App  ###//
import {App}       from "../App"
import Settings    from "../Settings"
import {multiLine} from "../Modules/Log/Format"
import {Progress } from "../Modules/Log/Progress"
import {Action   } from "../Modules/CLI/Action"
import {Command  } from "../Modules/CLI/Command"

//###  NPM  ###//
import {Volume} from "../NPM/GoogleBooks/__Main__"


//##################//
//###  Settings  ###//
//##################//

const command         = "find <query>"
const description     = "Searches GoogleBooks for the given query."
const progressMessage = "Querying Google Books API"


//#################//
//###  Aliases  ###//
//#################//

const {log, newLine} = App


//####################//
//###  Initialize  ###//
//####################//

App
	.command(command)
	.description(description)
	.allowUnknownOptions()
	.action(Action.Basic(__Main__))


//##############//
//###  Main  ###//
//##############//

async function __Main__(command:Command){
	const keyword = command.arguments.raw
	const spinner = Progress.Spinner(progressMessage)

	spinner.start()
	const {volumes, error} = await _get_Volumes(keyword)

	if(error)
		{_on_Error(spinner)}
	else if(volumes.length == 0)
		{_on_NoResults(spinner)}
	else
		{_on_Success(spinner, volumes)}

	return {volumes, error}
}

function _on_Error(spinner:Progress.Spinner){
	spinner.fail()
	log("Unable to access the GoogleBooks API.")
	newLine()
}

function _on_NoResults(spinner:Progress.Spinner){
	spinner.fail()
	log("No books were found matching your query. Try simplifying your query.")
	newLine()
}

function _on_Success(spinner:Progress.Spinner, volumes:Volume[]){
	spinner.succeed()
	_log_ResultsTotal(volumes)
	_log_Results(volumes)
}


//###################//
//###  Utilities  ###//
//###################//

async function _get_Volumes(keyword:string){
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

function _log_ResultsTotal(volumes:Volume[]){
	const bookDescriptor = (volumes.length == 1) ? "book was" : "books were"
	log(`${volumes.length} ${bookDescriptor} found matching your query:`)
	newLine()
}

function _log_Results(volumes:Volume[]){
	const volumeStrings = volumes.map(_build_VolumeString)
	for(const volumeString of volumeStrings){
		log(volumeString)
		newLine()
	}
}

function _build_VolumeString(volume:Volume){
	const lines = []

	lines.push(`Title:     ${volume.volumeInfo.title}`)

	if(volume.volumeInfo.authors){
		const authors   = volume.volumeInfo.authors.join(", ")
		const authorKey = (volume.volumeInfo.authors.length == 1) ? "Author: " : "Authors:"
		lines.push(`${authorKey}   ${authors}`)
	}

	if(volume.volumeInfo.publisher)
		{lines.push(`Publisher: ${volume.volumeInfo.publisher}`)}

	return multiLine(lines.join("\n"), {
		indent:   1,
		truncate: Settings.maximum_LineWidth
	})
}
