//###  App  ###//
import {Book     } from "./Database/Types"
import {truncate } from "../Modules/Log/Format"
import {pluralize} from "../Modules/Log/pluralize"

//###  NPM  ###//
import {Volume} from "../NPM/GoogleBooks/__Main__"


//########################//
//###  Exports.Public  ###//
//########################//

export function build_BookString(book:Book, truncationWidth:number){
	const lines: _BookString_Line[] = []
	let prefix: string

	lines.push({prefix:null, data:book.title})

	if(book.authors){
		prefix = _Prefix.Author(book.authors.length)
		const authors = book.authors.join(", ")
		lines.push({prefix, data:authors})
	}

	if(book.publisher){
		prefix = _Prefix.Publisher
		lines.push({prefix, data:book.publisher})
	}

	const normalizedLines = _normalize_PrefixLength(lines, truncationWidth)
	return normalizedLines
}

export function convert_Volume_To_Book(volume:Volume): Book{
	return {
		id:        volume.id,
		title:     volume.volumeInfo.title,
		authors:   volume.volumeInfo.authors,
		publisher: volume.volumeInfo.publisher,
	}
}


//###################//
//###  Utilities  ###//
//###################//

type _BookString_Line = {prefix:(string|null), data:string}

namespace _Prefix{
	export const Author    = pluralize(_ => `${_.plural("Author", "Authors")}`)
	export const Publisher = "Publisher"
}

/** Pads the `prefix` of each line so that the `data` is aligned. */
function _normalize_PrefixLength(lines:_BookString_Line[], truncationWidth:number){
	const max_PrefixLength = lines.reduce((max, {prefix}) => (
		((prefix && (prefix.length > max)) ? prefix.length : max)
	), 0)

	return (
		lines
			.map(({prefix, data}) => {
				const text =
					(prefix)
					? (`${prefix}:`.padEnd(max_PrefixLength + 1) + ` ${data}`)
					: data
				return truncate(text, truncationWidth)
			})
			.join("\n")
			.concat("\n")
	)
}
