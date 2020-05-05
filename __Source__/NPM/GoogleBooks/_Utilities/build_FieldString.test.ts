//###  Module  ###//
import {build_FieldString} from "./build_FieldString"


//###############//
//###  Tests  ###//
//###############//

test("builds valid field strings ", ()=>{
	const f = build_FieldString
	expect(f([                     ])).toEqual("items"               )
	expect(f(["a"                  ])).toEqual("items(a)"            )
	expect(f(["a", "b"             ])).toEqual("items(a, b)"         )
	expect(f(["a.1"                ])).toEqual("items(a(1))"         )
	expect(f(["a.1", "a.2"         ])).toEqual("items(a(1, 2))"      )
	expect(f(["a", "b.1"           ])).toEqual("items(a, b(1))"      )
	expect(f(["a", "b.1", "b.2"    ])).toEqual("items(a, b(1, 2))"   )
	expect(f(["a.1.1"              ])).toEqual("items(a(1(1)))"      )
	expect(f(["a.1.1", "b"         ])).toEqual("items(a(1(1)), b)"   )
	expect(f(["a.1.1", "a.1.2", "b"])).toEqual("items(a(1(1, 2)), b)")
})
