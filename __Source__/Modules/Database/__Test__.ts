//###  Module  ###//
import {Database} from "./__Main__"

//###  App  ###//
import Settings from "../../Settings"

//###  Node  ###//
import FileSystem from "fs"

//###  NPM  ###//
import Temp from "tmp"


//#################//
//###  Aliases  ###//
//#################//

const List = Database.List.Decorator
const Set  = Database.Set.Decorator


//###############//
//###  Setup  ###//
//###############//

const database_FilePath = Temp.tmpNameSync({prefix:Settings.appName})

class TestDatabase extends Database<any>{
	protected _filePath = database_FilePath

	@Set ("Set" ) public readonly Set:  Database.Set <any>
	@List("List") public readonly List: Database.List<any>
}

export const DB = TestDatabase.create()


//###############//
//###  Tests  ###//
//###############//

test("`database` stores values", ()=>{
	DB.clear()

	DB.List.add(1)
	expect(DB.List.value()).toEqual([1])
	DB.Set.add(1)
	expect(DB.Set.value()).toEqual([1])

	DB.List.add(2)
	expect(DB.List.value()).toEqual([1, 2])
	DB.Set.add(2)
	expect(DB.Set.value()).toEqual([1, 2])
})

test("`database.clear` removes all values", ()=>{
	DB.clear()

	DB.List.add(1)
	DB.Set .add(1)
	DB.clear()
	expect(DB.List.value()).toEqual([])
	expect(DB.Set .value()).toEqual([])
})

test("`namespace.clear` removes `namespace` values", ()=>{
	DB.clear()

	DB.List.add(1)
	DB.Set .add(1)
	DB.List.clear()
	expect(DB.List.value()).toEqual([])
	expect(DB.Set .value()).toEqual([1])

	DB.List.add(1)
	DB.Set.clear()
	expect(DB.List.value()).toEqual([1])
	expect(DB.Set .value()).toEqual([])
})

test("`Set` does not store duplicate values", ()=>{
	DB.clear()
	DB.Set.add(1)
	DB.Set.add(1)
	expect(DB.Set.value()).toEqual([1])

	DB.clear()
	DB.Set.add({id:1, name:"A"})
	DB.Set.add({id:1, name:"A"})
	expect(DB.Set.value()).toEqual([
		{id:1, name:"A"}
	])
})

test("`List` stores duplicate values", ()=>{
	DB.clear()
	DB.List.add(1)
	DB.List.add(1)
	expect(DB.List.value()).toEqual([1, 1])

	DB.clear()
	DB.List.add({id:1, name:"A"})
	DB.List.add({id:1, name:"A"})
	expect(DB.List.value()).toEqual([
		{id:1, name:"A"},
		{id:1, name:"A"},
	])
})

test("`find` retrieves the correct value", ()=>{
	DB.clear()

	const result = {id:1, name:"A"}

	DB.List.add(result)
	expect(DB.List.find(result)).toEqual(result)
})

test("`find_All` retrieves the correct values", ()=>{
	DB.clear()

	DB.List.add({id:1, name:"A"})
	DB.List.add({id:2, name:"A"})
	DB.List.add({id:3, name:"A"})

	expect(DB.List.find_All({name:"A"})).toEqual([
		{id:1, name:"A"},
		{id:2, name:"A"},
		{id:3, name:"A"},
	])
})

test("stores data changes in file", ()=>{
	let data:any

	DB.clear()

	DB.List.add({id:1, name:"A"})
	DB.List.add({id:2, name:"B"})
	DB.Set .add({id:1, name:"A"})
	DB.Set .add({id:2, name:"B"})

	data = _load_Data()
	expect(data).toEqual({
		List: [
			{id:1, name:"A"},
			{id:2, name:"B"},
		],

		Set: [
			{id:1, name:"A"},
			{id:2, name:"B"},
		],
	})

	DB.Set.clear()
	data = _load_Data()

	expect(data).toEqual({
		List: [
			{id:1, name:"A"},
			{id:2, name:"B"},
		],
		Set: [],
	})

	DB.clear()
	data = _load_Data()

	expect(data).toEqual({
		List: [],
		Set:  [],
	})
})


//###################//
//###  Utilities  ###//
//###################//

function _load_Data(){
	const json = FileSystem.readFileSync(database_FilePath, {encoding:"utf8"})
	return JSON.parse(json)
}
