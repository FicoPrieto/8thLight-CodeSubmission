
//########################//
//###  Exports.Public  ###//
//########################//

/**
* Returns a callback that accepts a `number`, which renders the provided `string` with the correct plural form.
*
* Example:
* ```javascript
const callback = pluralize(_ => `${_.count} ${_.plural("item", "item")}`)
callback(0) // "0 items"
callback(1) // "1 item"
callback(2) // "2 items"
callback(3) // "3 items"
* ```
*/
export function pluralize(textCallback:pluralize.OuterCallback){
	return (count:number) => (
		textCallback({
			count,
			plural: (singular:string, plural:string) => ((count == 1) ? singular : plural),
		})
	)
}

export namespace pluralize{
	export type Arguments = {count:number, plural:InnerCallback}
	export type OuterCallback = ((args:pluralize.Arguments      ) => string)
	export type InnerCallback = ((singular:string, plural:string) => string)
}
