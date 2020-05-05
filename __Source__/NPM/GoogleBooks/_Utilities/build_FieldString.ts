//###  Reference  ###//
// - https://developers.google.com/books/docs/v1/performance#partial-response


//#########################//
//###  Exports.Private  ###//
//#########################//

/** Converts a list of strings into a string that follows the API's `fields` parameter syntax. */
export function build_FieldString(fields:string[]){
	let fieldStructure: _ObjectStructure = {}

	for(const field of fields)
		{fieldStructure = _build_ObjectStructure_From_Path(field, fieldStructure)}

	return _build_FieldString_From_ObjectStructure("items", fieldStructure)
}


//###################//
//###  Utilities  ###//
//###################//

/**
* An object that only contains other objects.
*
* Used to build an object scaffolding for key retrieval.
*/
type _ObjectStructure = {[key:string]:_ObjectStructure}

/**
* Creates an `_ObjectStructure` from the `path` argument (*a `.`-delimited string*).
*
* Optionally, adds to a previously existing `_ObjectStructure` if the `objectStructure` is provided.
*/
function _build_ObjectStructure_From_Path(path:string, objectStructure?:_ObjectStructure){
	let   result = (objectStructure) ? {...objectStructure} : {}
	const parts  = path.split(".")

	let innerResult = result

	for(const part of parts){
		innerResult[part] = (innerResult[part] || {})
		innerResult = innerResult[part]
	}

	return result
}

/** Recursively extracts object keys and returns them in the API's `fields` parameter syntax. */
function _build_FieldString_From_ObjectStructure(objectKey:string, objectStructure:_ObjectStructure){
	const fieldStrings = []
	const children     = Object.entries(objectStructure)

	if(children.length > 0){
		let children_FieldStrings = []

		for(const [childKey, child] of children)
			{children_FieldStrings.push(_build_FieldString_From_ObjectStructure(childKey, child))}

		const children_FieldString = children_FieldStrings.join(", ")
		fieldStrings.push(`${objectKey}(${children_FieldString})`)
	}
	else
		{fieldStrings.push(objectKey)}

	return fieldStrings.join(",")
}
