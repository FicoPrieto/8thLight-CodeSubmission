//###  Module  ###//
import {GoogleBooks} from "../Error"

//###  NPM  ###//
import fetch from "node-fetch"


//###############################//
//###  Exports.Class.Private  ###//
//###############################//

export abstract class API_Base<ReturnType, ParametersType>{

	//----------//
	//  Public  //
	//----------//

	/** Retrieves data from the API. */
	public async get(parameters:ParametersType){
		const response = await this._fetch(parameters)

		let error:  Error
		let result: ReturnType

		if(response.ok){
			result = (((await response.json()).items || []) as ReturnType)
			error  = null
		}
		else{
			result = null
			error = new GoogleBooks.Error.InvalidRequest({
				status:     response.status,
				statusText: response.statusText,
				url:        response.url,
			})
		}

		return {
			/**
			* The data returned by the API.
			*
			* `null` if an error was encountered.
			*/
			result,

			/**
			* The error returned by the API.
			*
			* `null` if no errors were encountered.
			*/
			error,
		}
	}

	//----------------------//
	//  Protected.Abstract  //
	//----------------------//

	/** The url path to be suffixed to the API's base URL. */
	protected abstract readonly _urlPath: string

	/** Allows derived classes to modify the parameters that were provided to `get` before they are consumed by the API. */
	protected abstract async _modify_SearchParameters(parameters:ParametersType): Promise<any>

	//-----------//
	//  Private  //
	//-----------//

	/** The API's base URL. */
	private readonly _baseURL = "https://www.googleapis.com/books/v1"

	/** Returns a `URL` instance with the API's full URL, including search parameters. */
	private _get_URL_Object(searchParameters:any){
		const url = new URL(this._url)
		for(const [key, value] of Object.entries(searchParameters))
			{url.searchParams.append(key, value.toString())}

		return url
	}

	/** The API's full URL, before applying search parameters. */
	private get _url()
		{return `${this._baseURL}/${this._urlPath}`}

	/** Returns the API response. */
	private async _fetch(parameters:any){
		const modifiedParameters = await this._modify_SearchParameters(parameters)
		const url                = this._get_URL_Object(modifiedParameters)

		return await fetch(url)
	}

}
