//###  Module  ###//
import {expect as newExpect} from "./__Main__"


//###############//
//###  Tests  ###//
//###############//

test("`toEqual` results are valid", ()=>{
	expect(  newExpect(true      ).toEqual(true      )  ).toBe(true)
	expect(  newExpect(false     ).toEqual(false     )  ).toBe(true)
	expect(  newExpect({a:1, b:2}).toEqual({a:1, b:2})  ).toBe(true)
})

test("`not` negates properly", ()=>{
	expect(  newExpect(true      ).not.toEqual(false)  ).toBe(true)
	expect(  newExpect(false     ).not.toEqual(true )  ).toBe(true)
	expect(  newExpect(1         ).not.toEqual(2    )  ).toBe(true)
	expect(  newExpect(1         ).not.toEqual("1"  )  ).toBe(true)
	expect(  newExpect("1"       ).not.toEqual(1    )  ).toBe(true)
	expect(  newExpect({a:1, b:2}).not.toEqual({a:1})  ).toBe(true)
})

test("`toMatchObject` results are valid", ()=>{
	expect(  newExpect({a:1, b:2}).toMatchObject({a:1})  ).toBe(true )
	expect(  newExpect({a:1, b:2}).toMatchObject({a:2})  ).toBe(false)
})

test("`toThrow` results are valid", ()=>{
	expect(  newExpect(() => {throw new Error()}).toThrow()      ).toBe(true )
	expect(  newExpect(() => {                 }).toThrow()      ).toBe(false)
	expect(  newExpect(() => {throw new Error()}).not.toThrow()  ).toBe(false)
	expect(  newExpect(() => {                 }).not.toThrow()  ).toBe(true )
})

test("`toThrow` calls do not actually throw", ()=>{
	expect(  (() => newExpect(() => {throw new Error()}).toThrow()    )  ).not.toThrow()
	expect(  (() => newExpect(() => {throw new Error()}).not.toThrow())  ).not.toThrow()
})
