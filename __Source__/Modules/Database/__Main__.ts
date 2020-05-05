//###  App  ###//
import {Json} from "../Types/Json"

//###  Module  ###//
import {List as _List} from "./List"
import {Set  as _Set } from "./Set"

//###  Node  ###//
import FileSystem from "fs"
import Path       from "path"

//###  NPM  ###//
import _Database from "lowdb"
import File      from "lowdb/adapters/FileSync"


//##############################//
//###  Exports.Class.Public  ###//
//##############################//

/** A class that allows `JSON` data to be persisted locally files */
export abstract class Database<Type extends Json>{

	protected abstract _filePath: string

	private _database: _Database.LowdbSync<Type>
	private _namespaceKeys:string[] = []

	constructor(_constructorKey?:Symbol){
		if(_constructorKey !== _ConstructorKey)
			{throw new Error("`Database` should only be constructed via `Database.create()`")}
	}

	/** Creates database file, initializes database manager, and returns `Database` instance. */
	public static create<Subclass extends Database<any>>(this:{new (...args:any): Subclass}): Subclass{
		const database = new this(_ConstructorKey)
		_ensure_DatabaseFile(database._filePath)
		database._database = _Database(new File(database._filePath))
		return database
	}

	/** Removes all data from the database. */
	public clear(){
		this._database
			.setState({} as Type)
			.write()

		for(const namespaceKey of this._namespaceKeys)
			{this._set_NamespaceDefault(namespaceKey)}
	}

	private _add_Namespace(namespaceKey:string){
		this._namespaceKeys.push(namespaceKey)
		this._set_NamespaceDefault(namespaceKey)
	}

	private _set_NamespaceDefault(namespaceKey:string)
		{this._database.defaults({[namespaceKey]:[]}).write()}

}


//##################################//
//###  Exports.Namespace.Public  ###//
//##################################//

export namespace Database{
	export import List = _List
	export import Set  = _Set
}


//###################//
//###  Utilities  ###//
//###################//

const _ConstructorKey = Symbol()

function _ensure_DatabaseFile(filePath:string){
	const directoryPath = Path.dirname(filePath)
	FileSystem.mkdirSync(directoryPath, {recursive:true})
}
