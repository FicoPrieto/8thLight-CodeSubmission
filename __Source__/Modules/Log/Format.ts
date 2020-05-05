//###  App  ###//
import Settings from "../../Settings"

//###  NPM  ###//
import redent from "redent"


//#################//
//###  Aliases  ###//
//#################//

const {truncationString} = Settings.UI


//########################//
//###  Exports.Public  ###//
//########################//

/** Indentation string, composed of spaces. Length is set via `Settings.indentationWidth`. */
export const tab = "".padEnd(Settings.UI.indentationWidth)

/** Reduces the lowest level of indentation to zero, while preserving the relational indentation between lines. */
export function dedent(text:string){
	const dedented   = redent(text, 0, {indent:tab})
	const normalized = _replace_IndentationTabs_With_Spaces(dedented)
	return normalized
}

/** Applies `dedent`, then applies the given `level` of indentation to each line of the resulting string. */
export function indent(text:string, level:number){
	const dedented = dedent(text)
	const indented = redent(dedented, level, {indent:tab})
	return indented
}

/** Applies `indent`, `trim`, & `truncate` simultaneously. */
export function multiLine(text:string, options?:{indent?:number, truncate?:number}){
	const trimmed   = trim(text)
	const indented  = indent(trimmed, (options.indent || 0))

	const truncated =
		(options.truncate !== undefined)
		? indented.split("\n").map(line => truncate(line, options.truncate)).join("\n")
		: indented

	return truncated
}

/** Removes leading & trailing whitespace, while preserving indentation. */
export function trim(text:string)
	{return text.replace(_leading_And_Trailing_Whitespace, "")}

/** Truncates `text` at the given `length`. */
export function truncate(text:string, length:number){
	if(length < _minimum_TruncationLength)
		{throw Error(`Truncation length is too short. The minimum truncation length is ${_minimum_TruncationLength}.`)}
	else if(length >= text.length)
		{return text}
	else{
		const offsetLength = (length - truncationString.length)
		return (text.substring(0, offsetLength) + truncationString)
	}
}


//###################//
//###  Utilities  ###//
//###################//

const _minimum_TruncationLength = (truncationString.length + 1)

const _leading_And_Trailing_Whitespace = /(^[\s]*\n(?=[\t ]*[^\s]))|(\n[\s]*$)/g

/** Replaces leading tabs of each line with spaces. */
function _replace_IndentationTabs_With_Spaces(text:string)
	{return text.replace(/^\t+/gm, _tabReplacer)}

/** Replaces each tab character with spaces. */
function _tabReplacer(subString:string)
	{return tab.repeat(subString.length)}
