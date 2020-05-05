//###  NPM  ###//
import ANSI_Colors from "ansi-colors"
import strip_Color from "strip-color"


//##################################//
//###  Exports.Namespace.Public  ###//
//##################################//

/** Aliases & presets for `ansi-colors`. */
export namespace Style{

	export const reset = (text:string) => strip_Color(text)

	export namespace Background{
		export const {
			bgBlack:  black,   bgBlackBright:  brightBlack,
			bgBlue:   blue,    bgBlueBright:   brightBlue,
			bgCyan:   cyan,    bgCyanBright:   brightCyan,
			bgGreen:  green,   bgGreenBright:  brightGreen,
			bgMagenta:magenta, bgMagentaBright:brightMagenta,
			bgRed:    red,     bgRedBright:    brightRed,
			bgWhite:  white,   bgWhiteBright:  brightWhite,
			bgYellow: yellow,  bgYellowBright: brightYellow,
		} = ANSI_Colors
	}

	export namespace Color{
		export const {
			black,   blackBright:  brightBlack,
			blue,    blueBright:   brightBlue,
			cyan,    cyanBright:   brightCyan,
			green,   greenBright:  brightGreen,
			magenta, magentaBright:brightMagenta,
			red,     redBright:    brightRed,
			white,   whiteBright:  brightWhite,
			yellow,  yellowBright: brightYellow,
			grey,
		} = ANSI_Colors
	}

	export namespace Font{
		export const {
			bold,   dim,           hidden,    inverse,
			italic, strikethrough, underline,
		} = ANSI_Colors

		export const normal = ANSI_Colors.reset
	}

	export namespace Preset{
		export const Normal   = (text:string) => reset(text)
		export const Bold     = (text:string) => Font.bold               (reset(text))
		export const Note     = (text:string) => Color.grey              (reset(text))
		export const Accent   = (text:string) => Font.bold.underline.grey(reset(text))
		export const Selected = (text:string) => Font.bold.blue          (reset(text))
		export const Active   = (text:string) => Font.bold.green         (reset(text))
	}

}
