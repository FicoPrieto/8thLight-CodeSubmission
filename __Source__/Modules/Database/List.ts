//###  Module  ###//
import {NamespaceManager} from "./NamespaceManager"

//###  App  ###//
import {Json           } from "../Types/Json"
import {RequiredPartial} from "../Types/RequiredPartial"

//###  NPM  ###//
import {expect} from "../../NPM/ExpectBoolean/__Main__"
import LoDash   from "lodash"


//#########################//
//###  Exports.Private  ###//
//#########################//

export namespace _List{
	export function create_Manager<Type extends Json>(instance:any, namespaceKey:string): NamespaceManager<Type>{
		instance._add_Namespace(namespaceKey)
		const namespace = (() => instance._database.get(namespaceKey) as LoDash.CollectionChain<Type>)

		return {
			clear(){
				instance._database.unset(namespaceKey).write()
				instance._set_NamespaceDefault(namespaceKey)
			},

			add(value:Type)
				{namespace().push(value).write()},

			remove: _get_Remove(namespace()),

			find(value:RequiredPartial<Type>)
				{return (namespace().find(value as any).value() as Type)},

			find_All(value:RequiredPartial<Type>)
				{return namespace().value().filter(item => expect(item).toMatchObject(value))},

			value()
				{return namespace().value()}
		}
	}
}


//########################//
//###  Exports.Public  ###//
//########################//

export interface List<Type extends Json> extends NamespaceManager<Type>{}

export namespace List{
	/** A decorator that instantiates a `List` manager for the `Database`. */
	export const Decorator = NamespaceManager.build_Decorator(_List.create_Manager)
}


//###################//
//###  Utilities  ###//
//###################//

function _get_Remove<Type>(namespace:LoDash.CollectionChain<Type>){
	function remove(condition:((value:Type, index:number, array:Type[]) => boolean)): void
	function remove(partialValue:RequiredPartial<Type>):                              void
	function remove<Type>(arg:any){
		namespace
			.remove(arg)
			.write()
	}

	return remove
}
