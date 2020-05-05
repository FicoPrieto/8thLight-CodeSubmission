//###  App  ###//
import Settings from "../../Settings"

//###  Module  ###//
import {dedent, indent, multiLine, trim, truncate} from "./Format"


//#################//
//###  Aliases  ###//
//#################//

const {truncationString} = Settings


//###############//
//###  Setup  ###//
//###############//

const tab = "".padEnd(Settings.indentationWidth)


//######################//
//###  Tests.dedent  ###//
//######################//

test("`dedent` reduces & preserves indentation", ()=>{
	expect(dedent("\ta\n\t\tb"            )).toEqual(`a\n${tab}b`)
	expect(dedent(`${tab}a\n${tab}${tab}b`)).toEqual(`a\n${tab}b`)
})

test("`dedent` preserves leading & trailing newlines", ()=>{
	expect(dedent("\n\ta\n\t\tb\n")).toEqual(`\na\n${tab}b\n`)
})


//######################//
//###  Tests.indent  ###//
//######################//

test("`indent` preserves indentation", ()=>{
	expect(indent("\ta\n\t\tb",             0)).toEqual(`a\n${tab}b`            )
	expect(indent(`${tab}a\n${tab}${tab}b`, 0)).toEqual(`a\n${tab}b`            )
	expect(indent("\ta\n\t\tb",             1)).toEqual(`${tab}a\n${tab}${tab}b`)
	expect(indent(`${tab}a\n${tab}${tab}b`, 1)).toEqual(`${tab}a\n${tab}${tab}b`)
})

test("`indent` applies indentation to each line", ()=>{
	expect(indent("a\nb\nc", 1)).toEqual(`${tab}a\n${tab}b\n${tab}c`)
})

test("`indent` applies `level` correctly", ()=>{
	expect(indent("\ta\n\t\tb",             2)).toEqual(`${tab}${tab}a\n${tab}${tab}${tab}b`            )
	expect(indent(`${tab}a\n${tab}${tab}b`, 2)).toEqual(`${tab}${tab}a\n${tab}${tab}${tab}b`            )
	expect(indent("\ta\n\t\tb",             3)).toEqual(`${tab}${tab}${tab}a\n${tab}${tab}${tab}${tab}b`)
	expect(indent(`${tab}a\n${tab}${tab}b`, 3)).toEqual(`${tab}${tab}${tab}a\n${tab}${tab}${tab}${tab}b`)
})


//#########################//
//###  Tests.multiLine  ###//
//#########################//

test("`multiLine` removes leading & trailing newlines", ()=>{
	expect(multiLine("\na\n", {indent:0})).toEqual(`a`      )
	expect(multiLine("\na\n", {indent:1})).toEqual(`${tab}a`)
})

test("`multiLine` applies `level` correctly", ()=>{
	expect(multiLine("a",     {indent:0})).toEqual(`a`            )
	expect(multiLine("a",     {indent:1})).toEqual(`${tab}a`      )
	expect(multiLine("a",     {indent:2})).toEqual(`${tab}${tab}a`)
	expect(multiLine("\na\n", {indent:0})).toEqual(`a`            )
	expect(multiLine("\na\n", {indent:1})).toEqual(`${tab}a`      )
	expect(multiLine("\na\n", {indent:2})).toEqual(`${tab}${tab}a`)
})

test("`multiLine` preserves indentation", ()=>{
	expect(multiLine("\ta\n\t\tb",             {indent:0})).toEqual(`a\n${tab}b`            )
	expect(multiLine(`${tab}a\n${tab}${tab}b`, {indent:0})).toEqual(`a\n${tab}b`            )
	expect(multiLine("\ta\n\t\tb",             {indent:1})).toEqual(`${tab}a\n${tab}${tab}b`)
	expect(multiLine(`${tab}a\n${tab}${tab}b`, {indent:1})).toEqual(`${tab}a\n${tab}${tab}b`)
})

test("`multiLine` truncates each line", ()=>{
	const length     = (truncationString.length + 2)
	const text_A     = "1234567890"
	const text_B     = "abcdefghi"
	const expected_A = (text_A.substring(0, (length - truncationString.length)) + truncationString)
	const expected_B = (text_B.substring(0, (length - truncationString.length)) + truncationString)
	const	result     = multiLine(`${text_A}\n${text_B}`, {truncate:length})
	expect(result).toEqual(`${expected_A}\n${expected_B}`)
})


//####################//
//###  Tests.trim  ###//
//####################//

test("`trim` removes leading & trailing newlines", ()=>{
	expect(trim("\na\n")).toEqual(`a`)
})

test("`trim` preserves inner newlines", ()=>{
	expect(trim("\na\nb\n"  )).toEqual(`a\nb`  )
	expect(trim("\na\n\nb\n")).toEqual(`a\n\nb`)
})

test("`trim` preserves indentation", ()=>{
	expect(trim("\n\ta\n"     )).toEqual(`\ta`       )
	expect(trim("\ta\n\tb\n"  )).toEqual(`\ta\n\tb`  )
	expect(trim("\ta\n\t\tb\n")).toEqual(`\ta\n\t\tb`)
})


//########################//
//###  Tests.truncate  ###//
//########################//

test("`truncate` removes trailing characters and matches `length`", ()=>{
	const length         = (truncationString.length + 2)
	const text           = "1234567890"
	const expectedResult = (text.substring(0, (length - truncationString.length)) + truncationString)
	const	result         = truncate(text, length)
	expect(result).toEqual(expectedResult)
	expect(result).toHaveLength(length)
})

test("`truncate` does not affect strings that are shorter than or equal to `length`", ()=>{
	expect(truncate("123",   5)).toEqual("123"  )
	expect(truncate("12345", 5)).toEqual("12345")
})

test("`truncate` throws error if `length` is too short", ()=>{
	expect(() => truncate("123", 1)).toThrow(/^Truncation length is too short/)
})
