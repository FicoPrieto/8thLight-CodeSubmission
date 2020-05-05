//###  Module  ###//
import {Volume     } from "../__Main__"
import {GoogleBooks} from "../Error"


//#################//
//###  Aliases  ###//
//#################//

const {
	any,
	arrayContaining,
	objectContaining,
} = expect


//###############//
//###  Setup  ###//
//###############//

let response: {result:Volume[], error:Error}


//###############//
//###  Tests  ###//
//###############//

test("throws error with invalid `query`", async ()=>{
	response = await Volume.List.get({
		query: {keyword:""},
	})
	expect(
		response.error instanceof GoogleBooks.Error.InvalidRequest
	).toBe(true)
})

test("retrieves list of `Volume`s", async ()=>{
	response = await Volume.List.get({
		query: {keyword:"Programming"},
	})
	expect(response.result).toEqual(
		arrayContaining([
			objectContaining({
				id: any(String),
			}),
		])
	)
})

test("`result`s contain `keyword`", async ()=>{
	response = await Volume.List.get({
		query:   {keyword:"Programming"},
		orderBy: "relevance",
	})
	expect(response.result.length > 0).toEqual(true)
	expect(
		response.result.every(volume => (
			JSON.stringify(volume).match(/programming/i)
		))
	).toEqual(true)
})

test("`maxResults` limits `result` length", async ()=>{
	response = await Volume.List.get({
		maxResults: 10,
		query:      {keyword:"Programming"},
	})
	expect(response.result).toHaveLength(10)
})

test("`projection` filters `result` properties", async ()=>{
	//###  Lite  ###//
	response = await Volume.List.get({
		query:      {keyword:"Programming"},
		projection: "lite",
	})
	for(const volume of response.result){
		expect(volume).toMatchObject({
			id: any(String),
		})
		expect(volume).not.toMatchObject({
			volumeInfo: {pageCount:any(Number)},
		})
	}

	//###  Full  ###//
	response = await Volume.List.get({
		query:      {keyword:"Programming"},
		projection: "full",
	})
	for(const volume of response.result){
		expect(volume).toMatchObject({
			id:         any(String),
			volumeInfo: {pageCount:any(Number)},
		})
	}
})

test("`fields` filters `result` properties", async ()=>{
	response = await Volume.List.get({
		query: {keyword:"Programming"},
		fields: [
			"id",
			"volumeInfo.authors",
			"volumeInfo.title",
			"volumeInfo.publisher",
		],
	})
	expect(response.result.length > 0).toEqual(true)
	for(const volume of response.result){
		expect(volume).toEqual(
			objectContaining({
				id: any(String),
				volumeInfo: {
					authors:   arrayContaining([any(String)]),
					title:     any(String),
					publisher: any(String),
				},
			}),
		)
	}
})

test("`printType` filters `result`s", async ()=>{
	//###  Books  ###//
	response = await Volume.List.get({
		query:     {keyword:"Programming"},
		printType: "books",
	})
	expect(response.result.length > 0).toEqual(true)
	for(const volume of response.result){
		expect(volume).toMatchObject({
			volumeInfo: {printType:"BOOK"},
		})
	}

	//###  Magazines  ###//
	response = await Volume.List.get({
		query:     {keyword:"Programming"},
		printType: "magazines",
	})
	expect(response.result.length > 0).toEqual(true)
	for(const volume of response.result){
		expect(volume).toMatchObject({
			volumeInfo: {printType:"MAGAZINE"},
		})
	}
})
