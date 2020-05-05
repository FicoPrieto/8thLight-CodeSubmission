//###  Module  ###//
import {_List           } from "./List"
import {NamespaceManager} from "./NamespaceManager"

//###  App  ###//
import {Json} from "../Types/Json"

//###  NPM  ###//
import {expect} from "../../NPM/ExpectBoolean/__Main__"
import LoDash   from "lodash"


//########################//
//###  Exports.Public  ###//
//########################//

export interface Set<Type extends Json> extends NamespaceManager<Type>{}

export namespace Set{
	/** A decorator that instantiates a `Set` manager for the `Database`. */
	export const Decorator = NamespaceManager.build_Decorator(_create_Manager)
}


//###################//
//###  Utilities  ###//
//###################//

function _create_Manager<Type extends Json>(instance:any, namespaceKey:string): NamespaceManager<Type>{
	const namespace = (() => instance._database.get(namespaceKey) as LoDash.CollectionChain<Type>)
	const manager   = _List.create_Manager<Type>(instance, namespaceKey)
	const {add}     = manager

	manager.add = function(value:Type){
		const values = namespace().value()
		let   exists = false

		for(const _value of values){
			if(expect(value).toEqual(_value))
				{exists = true}
		}

		if(!exists)
			{add(value)}
	}

	return manager
}
