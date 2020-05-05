//###  Module  ###//
import {pluralize} from "./pluralize"


//###############//
//###  Setup  ###//
//###############//

const singular = "item"
const plural   = "items"
const callback = pluralize(args => `${args.count} ${args.plural(singular, plural)}`)

let result: string


//###############//
//###  Tests  ###//
//###############//

test("returns correct zero value", ()=>{
	result = callback (0)
	expect(result).toEqual(`0 ${plural}`)
})

test("returns correct one value", ()=>{
	result = callback (1)
	expect(result).toEqual(`1 ${singular}`)
})

test("returns correct plural values", ()=>{
	result = callback (2)
	expect(result).toEqual(`2 ${plural}`)

	result = callback (3)
	expect(result).toEqual(`3 ${plural}`)
})
