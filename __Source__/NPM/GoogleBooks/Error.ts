
//###################//
//###  Utilities  ###//
//###################//

class _GoogleBooks_Error extends Error{
	constructor(...args:any){
		super(...args)
		this.name = `GoogleBooks.${this.constructor.name}`
	}
}


//##################################//
//###  Exports.Namespace.Public  ###//
//##################################//

export namespace GoogleBooks{
	export namespace Error{

		export class InvalidRequest extends _GoogleBooks_Error{
			constructor(
				{status,        statusText,        url       }:
				{status:number, statusText:string, url:string}
			){
				super(
					JSON.stringify({status, statusText, url}, null, 2)
				)
			}
		}

	}
}
