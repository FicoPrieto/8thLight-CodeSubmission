//###  Module  ###//
import {Prompt} from "./_Type"

//###  App  ###//
import Settings          from "../../Settings"
import {indent         } from "../../Modules/Log/Format"
import {NoOutput_Stream} from "../../Modules/Log/NoOutput_Stream"
import {Style as _Style} from "../../Modules/Log/Style"

//###  NPM  ###//
// @ts-ignore // TODO: types are in development, remove when issue closed: https://github.com/enquirer/enquirer/issues/135
import {MultiSelect as _MultiSelect} from "enquirer"


//#################//
//###  Aliases  ###//
//#################//

const {Preset:Style} = _Style


//#################################//
//###  Exports.Function.Public  ###//
//#################################//

/** Displays a list of options for the user to select from and returns the selected options. */
export function MultiSelect<ValueType>({
	messages,
	choiceMap,
	choiceFormatter,
}:{
	messages:         {on_Display:string, on_Submit:((selections:ValueType[]) => string), on_Cancel:string},
	choiceMap:        MultiSelect.ChoiceMap<ValueType>,
	choiceFormatter?: ((options:{index:number, choice:string, selected:boolean, enabled:boolean}) => string)
}){
	const multiSelect = new _MultiSelect({..._get_ConstructorArguments(messages, choiceMap)})
	_override_RenderChoice(multiSelect, choiceFormatter)
	return (multiSelect as Prompt<ValueType>)
}


//##################################//
//###  Exports.Namespace.Public  ###//
//##################################//

export namespace MultiSelect{

	/** Provides `MultiSelect` with options that will be displayed as `choice` and will return `value` when selected. */
	export type ChoiceMap<ValueType> = {[key:string]: {choice:string, value:ValueType}}

	/** Provides default `choiceFormatter`s for `MultiSelect` */
	export namespace Formatter{

		/** When a `choice` is selected or enabled, highlights the entire `choice`. */
		export function Default(
			{choice,        selected,         enabled        }:
			{choice:string, selected:boolean, enabled:boolean}
		)
			{return _build_ChoiceMessage({choice, selected, enabled, apply_Style:true})}

		/** When a `choice` is selected or enabled, highlights the first line of the `choice` only. */
		export function Highlight_FirstLine_Only(
			{choice,        selected,         enabled        }:
			{choice:string, selected:boolean, enabled:boolean}
		){
			choice = (
				choice
					.split("\n")
					.map((line, i) => (
						(i == 0)
						? (selected)
							? Style.Selected(line)
							: Style.Bold    (line)
						: Style.Normal(line)
					))
					.join("\n")
			)

			return _build_ChoiceMessage({choice, selected, enabled, apply_Style:false})
		}

	}

}


//###################//
//###  Utilities  ###//
//###################//

const _usageInstructions = ""
	+ Style.Note  ("(press "         )
	+ Style.Accent("up"              )
	+ Style.Note  ("/"               )
	+ Style.Accent("down"            )
	+ Style.Note  (" to move, "      )
	+ Style.Accent("space"           )
	+ Style.Note  (" to select, and ")
	+ Style.Accent("enter"           )
	+ Style.Note  (" to submit)"     )
	+ "\n"

function _get_ConstructorArguments<ValueType>(
	messages:  {on_Display:string, on_Submit:((selections:ValueType[]) => string), on_Cancel:string},
	choiceMap: MultiSelect.ChoiceMap<ValueType>,
){
	return {
		// provides `choice` message and return value `key`
		choices: Object.entries(choiceMap).map( ([key, {choice}]) => ({
			name:    key,
			message: choice,
		})),

		// removes `ChoiceMap` keys after `on_Submit` message
		format: () => " ",

		// displays usage instructions
		hint: () => `\n${_usageInstructions}`,

		// formats prompt messages
		message(){
			if(this.state.submitted){return Style.Normal(`${messages.on_Display}\n${messages.on_Submit(this.value)}\n`)}
			if(this.state.cancelled){return Style.Normal(`${messages.on_Display}\n${messages.on_Cancel            }\n`)}
			else                    {return `${Style.Bold(messages.on_Display)}:`                                      }
		},

		// returns `ChoiceMap` values
		result: ((keys:string[]) => keys.map(key => choiceMap[key].value)),

		// removes trailing characters @ prompt message
		separator: () => "",

		stdout: (process.env[Settings.testEnvironment_Key]) ? NoOutput_Stream : process.stdout
	}
}

// TODO: types are in development, update `multiSelect:any` when issue closed: https://github.com/enquirer/enquirer/issues/135
function _override_RenderChoice(
	multiSelect:     any,
	choiceFormatter: ((options:{index:number, choice:string, selected:boolean, enabled:boolean}) => string)
){
	multiSelect.renderChoice = (async function(choice, i){
		const selected      = (this.index == i)
		const formatterArgs = {index:i, choice:choice.message, selected, enabled:choice.enabled}
		const has_Formatter = Boolean(choiceFormatter)

		const choiceMessage =
			(has_Formatter)
			? choiceFormatter(formatterArgs)
			: MultiSelect.Formatter.Default(formatterArgs)

		return choiceMessage
	}).bind(multiSelect)
}

function _build_ChoiceMessage(
	{choice,        selected,         enabled,         apply_Style        }:
	{choice:string, selected:boolean, enabled:boolean, apply_Style:boolean}
){
	// format choice
	if(apply_Style){
		const choiceStyle = (selected) ? Style.Selected : Style.Bold
		choice = choiceStyle(choice)
	}
	choice = indent(choice, 1)

	// add choice indicator
	const indicatorStyle = (enabled) ? Style.Active : Style.Normal
	const indicator = indicatorStyle(Settings.UI.choiceIndicator)
	choice = choice.replace(/^ /, indicator)

	return choice
}
