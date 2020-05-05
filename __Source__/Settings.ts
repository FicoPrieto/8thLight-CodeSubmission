//###  App ###//
import {pluralize      } from "./Modules/Log/pluralize"
import {Style as _Style} from "./Modules/Log/Style"


//#################//
//###  Aliases  ###//
//#################//

const {Preset:Style, Font, Color} = _Style


//################################//
//###  Exports.Default.Public  ###//
//################################//

namespace Settings{

	export const appName           = "ReadingList"
	export const databaseExtension = "data"
	export const bookAPI           = "Google Books"

	export const testEnvironment_Key = "__TEST_ENVIRONMENT__"

	export const maximum_QueryResults = 5

	export const UI = {
		indentationWidth:  3,
		maximum_LineWidth: 80,
		truncationString:  "...",
		choiceIndicator:   "✓",
	}

	export const Output = {
		AppStart: {
			banner: () => multiLine([
				Color.grey       (" __  ___ _  _    _    _ ____ _  _ ___"                          ), // FIGlet.cybermedium
				Color.grey       ("|__|  |  |__|    |    | | __ |__|  |"                           ),
				Color.grey       ("|__|  |  |  |    |___ | |__] |  |  |"                           ),
				Color.brightGreen("______               _ _               _     _     _"           ), // FIGlet.doom
				Color.green      ("| ___ \\             | (_)             | |   (_)   | |"         ),
				Color.brightCyan ("| |_/ /___  __ _  __| |_ _ __   __ _  | |    _ ___| |_"         ),
				Color.cyan       ("|    // _ \\/ _\` |/ _\` | | '_ \\ / _\` | | |   | / __| __|"   ),
				Color.brightBlue ("| |\\ \\  __/ (_| | (_| | | | | | (_| | | |___| \\__ \\ |_"     ),
				Color.blue       ("\\_| \\_\\___|\\__,_|\\__,_|_|_| |_|\\__, | \\_____/_|___/\\__|"),
				Color.blue       ("                                __/ |"                          ),
				Color.brightBlue ("                               |___/"                           ),
			].join("\n"), {indent:1}),
		},

		Command: {
			Find: {
				command:     "find <query>",
				description: `Searches ${bookAPI} for the provided ${Font.bold.underline("query")}, then allows you to select books to save to your reading list.`,
				query_API: {
					inProgress: `Querying ${bookAPI} API`,
					noResults:  "No books were found matching your query. Try simplifying your query.",
					fail:       `Unable to access the ${bookAPI} API.`,
				},
				get_UserSelection: {
					select:    "Select the books you'd like to save to your reading list",
					noResults: "0 books were saved to your reading list.",
					found:     pluralize(_ => `${_.count} ${_.plural("book was", "books were")} found.`                     ),
					saved:     pluralize(_ => `${_.count} ${_.plural("book was", "books were")} saved to your reading list.`),
				},
			},
			List: {
				command:     "list",
				description: "Displays the books saved in your reading list.",
				display_ReadingList: {
					count:       pluralize(_ => `You have ${_.count} ${_.plural("book", "books")} in your reading list`),
					noResults:  `Try using the ${Style.Accent("find")} command to add some books to your list.`,
				},
			},
		},
	}

}

export default Settings


//#################//
//###  Imports  ###//
//#################//

//###  App ###//
import {multiLine} from "./Modules/Log/Format"
