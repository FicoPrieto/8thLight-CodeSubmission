//###  Module  ###//
import {Volume                  } from "./__Main__"
import {API_Base                } from "../_Utilities/API_Base"
import {build_FieldString       } from "../_Utilities/build_FieldString"
import {EscapeCodes             } from "../_Utilities/EscapeCodes"
import {integer, RequiredPartial} from "../_Utilities/Types"


//##############################//
//###  Exports.Public.Class  ###//
//##############################//

export class List extends API_Base<Volume[], List.SearchParameters>{

	//-------------------------------------//
	//  Protected.Abstract.Implementation  //
	//-------------------------------------//

	protected readonly _urlPath = "volumes"

	protected async _modify_SearchParameters(parameters:List.SearchParameters){
		const query = _build_Query(parameters)
		delete parameters.query

		const fields = (parameters.fields) ? {fields:build_FieldString(parameters.fields)} : {}
		delete parameters.fields

		return {
			q: query,
			...fields,
			...parameters
		}
	}

}


//##################################//
//###  Exports.Public.Namespace  ###//
//##################################//

export namespace List{

	/** The search parameters to be applied to `Volume.List.get(searchParameters)` */
	// Reference:
	// - https://developers.google.com/books/docs/v1/reference/volumes/list
	// - https://developers.google.com/books/docs/v1/using#PerformingSearch
	// - https://developers.google.com/books/docs/v1/performance#partial-response
	export interface SearchParameters{

		//-----------------//
		//---  Dynamic  ---//
		//-----------------//

		/** Queries to apply to the search. Requires at least one of the available fields. */
		// alias of `q`
		query: RequiredPartial<{
			/** Full-text search query. */
			keyword: string,

			/** Returns results where this text is found in the title. */
			title: string

			/** Returns results where this text is found in the author. */
			author: string

			/** Returns results where this text is found in the publisher. */
			publisher: string

			/** Returns results where this text is listed in the category list of the volume. */
			subject: string

			/** Returns results where this text is the ISBN number. */
			isbn: string

			/** Returns results where this text is the Library of Congress Control Number. */
			lccn: string

			/** Returns results where this text is the Online Computer Library Center number. */
			oclc: string
		}>

		/**
		* A list of specific fields to return.
		*
		* Use JSON path notation to access nested fields.
		*
		* ### Notes:
		* Fields are first filtered via `projection`.
		*
		* Fields discarded by the usage of `projection: "lite"` will not be accessible via `fields`.
		*
		* ### Examples:
		* ```javascript
		* fields: ["id", "volumeInfo"]
		* ```
		* ```javascript
		* fields: ["volumeInfo.title", "volumeInfo.authors"]
		* ```
		* ```javascript
		* fields: ["volumeInfo.dimensions.height"]
		* ```
		*/
		fields?: string[]

		//----------------//
		//---  Static  ---//
		//----------------//

		/**
		* Restrict to volumes by download availability.
		*
		* Acceptable values are:
		* - "epub" - All volumes with epub.
		*/
		download?: ("epub")

		/**
		* Filter search results.
		*
		* Acceptable values are:
		* - "ebooks" - All Google eBooks.
		* - "free-ebooks" - Google eBook with full volume text viewability.
		* - "full" - Public can view entire volume text.
		* - "paid-ebooks" - Google eBook with a price.
		* - "partial" - Public able to see parts of text.
		*/
		filter?: ("ebooks" | "free-ebooks" | "full" | "paid-ebooks" | "partial")

		/** Restrict results to books with this language code. */
		langRestrict?: string

		/**
		* Restrict search to this user's library.
		*
		* Acceptable values are:
		* - "my-library" - Restrict to the user's library, any shelf.
		* - "no-restrict" - Do not restrict based on user's library.
		*/
		libraryRestrict?: ("my-library" | "no-restrict")

		/** Maximum number of results to return. Acceptable values are 0 to 40, inclusive. */
		maxResults?: integer

		/**
		* Sort search results.
		*
		* Acceptable values are:
		* - "newest" - Most recently published.
		* - "relevance" - Relevance to search terms.
		*/
		orderBy?: ("newest" | "relevance")

		/** Restrict and brand results for partner ID. */
		partner?: string

		/**
		* Restrict to books or magazines.
		*
		* - Acceptable values are:
		* - "all" - All volume content types.
		* - "books" - Just books.
		* - "magazines" - Just magazines.
		*/
		printType?: ("all" | "books" | "magazines")

		/**
		* Restrict information returned to a set of selected fields.
		*
		* Acceptable values are:
		* "full" - Includes all volume data.
		* "lite" - Includes a subset of fields in volumeInfo and accessInfo.
		*/
		projection?: ("full" | "lite")

		/** Set to true to show books available for preorder. Defaults to false. */
		showPreorders?: boolean

		/** String to identify the originator of this request. */
		source?: string

		/** Index of the first result to return (starts at 0) */
		startIndex?: integer

	}

}


//###################//
//###  Utilities  ###//
//###################//

/** Builds query segments into a format consumable by the API. */
function _build_Query(parameters:List.SearchParameters){
	const {query} = parameters

	const segmentData = [
		[query.keyword,   null         ],
		[query.title,     "intitle"    ],
		[query.author,    "inauthor"   ],
		[query.publisher, "inpublisher"],
		[query.subject,   "subject"    ],
		[query.isbn,      "isbn"       ],
		[query.lccn,      "lccn"       ],
		[query.oclc,      "oclc"       ],
	]

	const segments = segmentData.reduce( (list, [segment, keyword]) => (
		(segment)
		? [...list, _build_QuerySegment(segment, keyword)]
		: list
	), [])

	return segments.join("+")
}

/** Builds a single query segment into a format consumable by the API. */
function _build_QuerySegment(segment:string, keyword:(string|null)){
	const prefix         = (keyword) ? `${keyword}:` : ""
	const escapedSegment = _escape_Segment(segment)

	return `${prefix}${escapedSegment}`
}

/**
* Escapes the colons (*keyword delimiters*) in a query segment.
*
* Other characters are handled by the API.
*/
function _escape_Segment(segment:string)
	{return segment.replace(/:/g, EscapeCodes[":"])}
