//###  Module  ###//
import {Command          } from "./Command"
import {build, positional} from "./Command.test.utilities"


//###############//
//###  Setup  ###//
//###############//

let result: Command


//##############################//
//###  Tests.FullValidation  ###//
//##############################//

test("`build` extracts name correctly", ()=>{
	//###  Single Word  ###//
	result = build({name:"foo", args:"1"})
	expect(result).toMatchObject({
		name:    "foo",
		options: {},
		arguments: {
		  keyword:    {exists:false, object:{},  string:"" },
		  positional: {exists:true,  object:[1], string:"1"},
		  raw:        "1",
		},
	})

	//###  Multiple Words  ###//
	result = build({name:"foo bar", args:"1"})
	expect(result).toMatchObject({
		name:    "foo bar",
		options: {},
		arguments: {
		  keyword:    {exists:false, object:{},  string:"" },
		  positional: {exists:true,  object:[1], string:"1"},
		  raw:        "1",
		},
	})
})

test("`build` extracts positional arguments", ()=>{
	//###  Single  ###//
	result = build({name:"foo", args:"1 2 3"})
	expect(result).toMatchObject({
		name:    "foo",
		options: {},
		arguments: {
		  keyword:    {exists:false, object:{},        string:""     },
		  positional: {exists:true,  object:[1, 2, 3], string:"1 2 3"},
		  raw:        "1 2 3",
		},
	})

	//###  Multiple  ###//
	result = build({name:"foo", args:"1 2 3"})
	expect(result).toMatchObject({
		name:    "foo",
		options: {},
		arguments: {
		  keyword:    {exists:false, object:{},        string:""     },
		  positional: {exists:true,  object:[1, 2, 3], string:"1 2 3"},
		  raw:        "1 2 3",
		},
	})
})

test("`build` extracts options", ()=>{
	//###  Flag.Short  ###//
	result = build({name:"foo", args:"-a"})
	expect(result).toMatchObject({
		name:    "foo",
		options: {a:true},
		arguments: {
		  keyword:    {exists:true,  object:{a:true}, string:"-a true"},
		  positional: {exists:false, object:[],       string:""       },
		  raw:        "-a",
		},
	})

	//###  Flag.Long  ###//
	result = build({name:"foo", args:"--bar"})
	expect(result).toMatchObject({
		name:    "foo",
		options: {bar:true},
		arguments: {
		  keyword:    {exists:true,  object:{bar:true}, string:"--bar true"},
		  positional: {exists:false, object:[],         string:""          },
		  raw:        "--bar",
		},
	})

	//###  Argument  ###//
	result = build({name:"foo", args:"--bar baz"})
	expect(result).toMatchObject({
		name:    "foo",
		options: {bar:"baz"},
		arguments: {
		  keyword:    {exists:true,  object:{bar:"baz"}, string:"--bar baz"},
		  positional: {exists:false, object:[],          string:""         },
		  raw:        "--bar baz",
		},
	})

	//###  Multiple  ###//
	result = build({name:"foo", args:"-a --bar -c baz --qux quux"})
	expect(result).toMatchObject({
		name:    "foo",
		options: {a:true, bar:true, c:"baz", qux:"quux"},
		arguments: {
		  keyword:    {exists:true,  object:{a:true, bar:true, c:"baz", qux:"quux"}, string:"-a true --bar true -c baz --qux quux"},
		  positional: {exists:false, object:[],                                      string:""                                    },
		  raw:        "-a --bar -c baz --qux quux",
		},
	})
})

test("`build` extracts positional arguments & options", ()=>{
	//###  Single  ###//
	result = build({name:"foo", args:"1 -a"})
	expect(result).toMatchObject({
		name:    "foo",
		options: {a:true},
		arguments: {
		  keyword:    {exists:true,  object:{a:true}, string:"-a true"},
		  positional: {exists:true,  object:[1],      string:"1"      },
		  raw:        "1 -a",
		},
	})

	//###  Multiple  ###//
	result = build({name:"foo", args:"1 2 3 -a --bar -c baz --qux quux"})
	expect(result).toMatchObject({
		name:    "foo",
		options: {a:true, bar:true, c:"baz", qux:"quux"},
		arguments: {
		  keyword:    {exists:true,  object:{a:true, bar:true, c:"baz", qux:"quux"}, string:"-a true --bar true -c baz --qux quux"},
		  positional: {exists:true,  object:[1, 2, 3],                               string:"1 2 3"                               },
		  raw:        "1 2 3 -a --bar -c baz --qux quux",
		},
	})
})

test("`build` detects no arguments", ()=>{
	result = build({name:"foo", args:""})
	expect(result).toMatchObject({
		name:    "foo",
		options: {},
		arguments: {
		  keyword:    {exists:false, object:{}, string:""},
		  positional: {exists:false, object:[], string:""},
		  raw:        "",
		},
	})
})


//#################################//
//###  Tests.PartialValidation  ###//
//#################################//

test("`build` casts values", ()=>{
	result = build({name:"foo", args:"1 word true false -a 1 --foo 1 -b word -c true -d false"})
	expect(result.arguments).toMatchObject({
		keyword:    {object:{a:1, foo:1, b:"word", c:"true", d:"false"}},
		positional: {object:[1, "word", "true", "false"]               },
	})
})

test("`build` quotes are handled as expected", ()=>{
	let result: any[]

	//###  SingleQuote.Multiple  ###//
	result = positional({name:"foo", args:`'1 2 3' '4 5 6'`})
	expect(result).toMatchObject(['1 2 3', '4 5 6'])

	//###  DoubleQuote.Multiple  ###//
	result = positional({name:"foo", args:`"1 2 3" "4 5 6"`})
	expect(result).toMatchObject(["1 2 3", "4 5 6"])

	//###  MixedQuote.Multiple  ###//
	result = positional({name:"foo", args:`"1 2 3" '4 5 6'`})
	expect(result).toMatchObject(["1 2 3", "4 5 6"])

	//###  SingleQuote.Escaped  ###//
	result = positional({name:"foo", args:`'''1 2 3'' ''4 5 6'''`})
	expect(result).toMatchObject([`'1 2 3' '4 5 6'`])

	//###  DoubleQuote.Escaped  ###//
	result = positional({name:"foo", args:`"""1 2 3"" ""4 5 6"""`})
	expect(result).toMatchObject([`"1 2 3" "4 5 6"`])

	//###  MixedQuote.DoubleQuote_Surround  ###//
	result = positional({name:"foo", args:`'""1 2 3"" ""4 5 6""'`})
	expect(result).toMatchObject([`""1 2 3"" ""4 5 6""`])

	//###  MixedQuote.SingleQuote_Surround  ###//
	result = positional({name:"foo", args:`"''1 2 3'' ''4 5 6''"`})
	expect(result).toMatchObject([`''1 2 3'' ''4 5 6''`])
})
