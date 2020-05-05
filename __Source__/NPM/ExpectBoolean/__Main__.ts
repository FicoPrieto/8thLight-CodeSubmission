//###  NPM  ###//
import Expect      from "expect"
import is_Function from "lodash/isFunction"


//#################################//
//###  Exports.Function.Public  ###//
//#################################//

/** Returns an `Expect.Matchers` instance with functions that return `boolean` values instead of throwing exceptions. */
export function expect<Type>(value:Type){
	const matcher = Expect(value)
	return _MatcherProxy.create(matcher)
}


//###################//
//###  Utilities  ###//
//###################//

const _ConstructorKey = Symbol()

/**
* `Expect.Matchers` property handler that:
* - wraps functions, ensuring the return of `boolean` values
* - wraps nested `Expect.Matchers` with `_MatcherProxy`
*/
class _MatcherProxy<Type>{
	private _matcher: Expect.Matchers<Type>

	constructor(matcher:Expect.Matchers<Type>, _constructorKey?:Symbol){
		if(_constructorKey === _ConstructorKey)
			{this._matcher = matcher}
		else
			{throw new Error("`_MatcherProxy` should only be constructed via `_MatcherProxy.create()`")}
	}

	static create(matcher:Expect.Matchers<any>): Expect.Matchers<boolean>{
		return new Proxy<Expect.Matchers<any>>(
			({} as any),
			new _MatcherProxy(matcher, _ConstructorKey),
		)
	}

	get(target:any, key:string){
		const value = this._matcher[key]
		if(is_Function(value))
			{return _get_BooleanMatcherFunction(value)}
		else
			{return _MatcherProxy.create(value)}
	}
}

/**
* Returns a callback that:
* - returns `false` when an `Expect` exception is thrown
* - returns `true` otherwise
*/
function _get_BooleanMatcherFunction<Type>(
	func: ((...args:any) => Expect.Matchers<Type>),
){
	return function(...args:any){
		let result = true
		try  {func(...args) }
		catch{result = false}
		return result
	}
}
