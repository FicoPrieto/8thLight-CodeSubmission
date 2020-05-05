//###  Module  ###//
import {AppData, Book} from "./Types"

//###  App  ###//
import Settings                from "../../Settings"
import {Database as _Database} from "../../Modules/Database/__Main__"
import {Environment          } from "../../Modules/Environment/__Main__"

//###  Node  ###//
import Path from "path"

//###  NPM  ###//
import Temp from "tmp"


//#################//
//###  Aliases  ###//
//#################//

const Set = _Database.Set.Decorator


//##################//
//###  Database  ###//
//##################//

export class Database extends _Database<AppData>{
	protected _filePath = _get_DatabaseFile()

	@Set("Books") public readonly Books: _Database.List<Book>
}


//########################//
//###  Exports.Public  ###//
//########################//

export const database = Database.create()


//###################//
//###  Utilities  ###//
//###################//

function _get_DatabaseFile(){
	const fileName = `${Settings.appName}.${Settings.databaseExtension}`
	let filePath: string

	if(Environment.is_Testing)
		{filePath = Temp.tmpNameSync({prefix:Settings.appName})}
	else if(Environment.is_Development)
		{filePath = Path.join(process.cwd(), `__Generated__/Database/${fileName}`)}
	else
		{filePath = Path.join("./", fileName)}

	return filePath
}
