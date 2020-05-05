//###  NPM  ###//
import escape_RegEx    from "escape-string-regexp"
import parse_Arguments from "yargs-parser"


//##################################//
//###  Exports.Interface.Public  ###//
//##################################//

/**
* Provides granular access to the data acquired by `Vorpal`.
*/
export interface Command{
	/** An instance of `Vorpal.CommandInstance` */
	instance: any

	/** The name of the executed command. */
	name: string,

	/**
	* The command flags & values provided by the user, provided as an object where flags' values are accessible as `{key: value}` pairs.
	*
	* Example:
	* ```bash
	* > someCommand --someFlag someValue
	* ```
	* ```javascript
	* command.options == {someFlag: "someValue"}
	* ```
	*
	* (*Alias of `command.arguments.keyword.object`*)
	*/
	options: any,

	/** The options provided by the user. */
	arguments: {

		/** The unprocessed argument string, as provided by the user. */
		raw: string,

		/** An object containing data related to the positional arguments extracted from the user's argument string. */
		positional:{
			/** `true` if any positional arguments were provided, `false` otherwise. */
			exists: boolean,
			/** A processed string representation of the user-provided positional arguments. Use `command.arguments.raw` if additional context is required. */
			string: string,
			/** An array representation of the user-provided positional arguments. */
			object: any[],
		},

		/** An object containing data related to the keyword arguments extracted from the user's argument string. */
		keyword:{
			/** `true` if any keyword arguments were provided, `false` otherwise. */
			exists: boolean,
			/** A processed string representation of the user-provided keyword arguments. Use `command.arguments.raw` if additional context is required. */
			string: string,
			/** An object representation of the user-provided keyword arguments. */
			object: any,
		},
	}
}


//###################################//
//###  Exports.Namespace.Private  ###//
//###################################//

export namespace _Command{

	/**
	* Extracts `Command` data from an instance of `Vorpal.CommandInstance`.
	*
	* Implements `yargs-parser` for improved handling of quoted arguments.
	*/
	export function build(commandInstance:any): Command{
		const commandName  = commandInstance.commandObject._name
		const rawArguments = _get_RawArguments(commandInstance, commandName)

		const {positionalArguments,        keywordArguments       } = _get_ArgumentObjects(rawArguments)
		const {positionalArguments_String, keywordArguments_String} = _get_ArgumentStrings(positionalArguments, keywordArguments)

		return {
			instance: commandInstance,
			name:     commandName,
			options:  keywordArguments,
			arguments: {
				raw: rawArguments,
				positional:{
					exists: (positionalArguments.length > 0),
					string: positionalArguments_String,
					object: positionalArguments,
				},
				keyword:{
					exists: (Object.values(keywordArguments).length > 0),
					string: keywordArguments_String,
					object: keywordArguments,
				},
			},
		}
	}

}


//###################//
//###  Utilities  ###//
//###################//

enum _QuoteType{
	Single,
	Double,
	None,
}

/** Removes the command name from the command string, leaving only the positional & keyword arguments. */
function _get_RawArguments(commandInstance:any, commandName:string){
	const commandText = commandInstance.commandWrapper.command

	return (
		commandText.replace(
			new RegExp(`^${escape_RegEx(commandName)}\\s*`),
			"",
		)
	)
}

/** Parses the raw argument string and returns object representations of the positional & keyword arguments. */
function _get_ArgumentObjects(rawArguments:string){
	const parsedArgs                                   = parse_Arguments(rawArguments)
	const {_:positionalArguments, ...keywordArguments} = parsedArgs

	const unquoted_PositionalArguments = positionalArguments.map(_format_ArgumentValue)

	const unquoted_keywordArguments = {}
	for(const [key, value] of Object.entries(keywordArguments))
		{unquoted_keywordArguments[key] = _format_ArgumentValue(value)}

	return {
		positionalArguments: unquoted_PositionalArguments,
		keywordArguments:    unquoted_keywordArguments,
	}
}

/** Stringifies the object representations of the positional & keyword arguments. */
function _get_ArgumentStrings(positionalArguments:any[], keywordArguments:any){
	const positionalArguments_String = positionalArguments.join(" ")

	const keywordArguments_String = (
		Object.entries(keywordArguments)
			.map(([flag, value]) => {
				const flagPrefix = _get_FlagPrefix(flag)
				return `${flagPrefix}${flag} ${value}`
			})
			.join(" ")
	)

	return {positionalArguments_String, keywordArguments_String}
}

/** Returns `-` for single-letter flags, or `--` for word flags */
function _get_FlagPrefix(flag:string){
	return (flag.length == 1) ? "-" : "--"
}

/** Formats `string` values, returns other types unaffected */
function _format_ArgumentValue(value:any){
	if(typeof value != "string")
		{return value}

	const quoteType = _get_SurroundingQuotes_Type(value)

	value = _remove_SurroundingQuotes(value)
	value = _replace_EscapedQuotes(value, quoteType)

	return value
}

/** Gets surrounding `_QuoteType`. */
function _get_SurroundingQuotes_Type(text:string){
	if     (text.match(/^'.*'/)){return _QuoteType.Single}
	else if(text.match(/^".*"/)){return _QuoteType.Double}
	else                        {return _QuoteType.None  }
}

/** Removes surrounding quotes. */
function _remove_SurroundingQuotes(text:string)
	{return text.replace(/^(["']?)(.*)\1$/, "$2")}

/** Replaces escaped quotes. */
function _replace_EscapedQuotes(text:string, quoteType:_QuoteType){
	if     (quoteType == _QuoteType.Single){return text.replace(/''/g, `'`)}
	else if(quoteType == _QuoteType.Double){return text.replace(/""/g, `"`)}
	else                                   {return text                    }
}
