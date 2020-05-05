//###  App  ###//
import {Json           } from "../Types/Json"
import {RequiredPartial} from "../Types/RequiredPartial"


//#########################//
//###  Exports.Private  ###//
//#########################//

/** Manages read/write operations for a specific `Database` namespace. */
export interface NamespaceManager<Type extends Json>{
	clear(): void

	add(value:Type): void

	remove(condition:((value:Type, index:number, array:Type[]) => boolean)): void
	remove(partialValue:RequiredPartial<Type>):                              void

	find(value:RequiredPartial<Type>): Type

	find_All(value:RequiredPartial<Type>): Type[]

	value(): Type[]
}

export namespace NamespaceManager{

	/* Returns a decorator that returns a `NamespaceManager` via `create_Manager` */
	export function build_Decorator(
		create_Manager: ((instance:any, namespaceKey:string) => NamespaceManager<any>)
	){
		return function<Type extends Json>(key:string){
			const namespaceKey = key
			return function(target, propertyKey:string){
				let manager:NamespaceManager<Type>
				Object.defineProperty(target, propertyKey, {
					get(){
						if(!manager)
							{manager = create_Manager(this, namespaceKey)}
						return manager
					},
				})
			}
		}
	}

}
