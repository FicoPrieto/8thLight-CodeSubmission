//###  Module  ###//
import {VolumeInstance_Array} from "./_TestUtilities"

//###  App  ###//
import {App} from "../../App"


//#################//
//###  Aliases  ###//
//#################//

const {run} = App


//###############//
//###  Tests  ###//
//###############//

test("`find` retrieves one user-selected `Volume`", async ()=>{
	const {selectedVolumes:prompt} = await run(`find Programming`)

	await prompt.once("run", async() => {
		await prompt.keypress(" ")
		await prompt.keypress(null, {name:"return"})
		await prompt.submit()
	})

	const selectedVolumes = await prompt.run()
	expect(selectedVolumes).toEqual(VolumeInstance_Array)
	expect(selectedVolumes).toHaveLength(1)
})

test("`find` retrieves multiple user-selected `Volume`s", async ()=>{
	const selectionCount = 3
	const {selectedVolumes:prompt} = await run(`find Programming`)

	await prompt.once("run", async() => {
		for(let i = 0; (i < selectionCount); i++){
			await prompt.keypress(" ")
			await prompt.keypress(null, {name:"down"})
		}
		await prompt.keypress(null, {name:"return"})
		await prompt.submit()
	})

	const selectedVolumes = await prompt.run()
	expect(selectedVolumes).toEqual(VolumeInstance_Array)
	expect(selectedVolumes).toHaveLength(selectionCount)
})

test("`find` retrieves no `Volume`s if user does not select any", async ()=>{
	const {selectedVolumes:prompt} = await run(`find Programming`)

	await prompt.once("run", async() => {
		await prompt.keypress(null, {name:"return"})
		await prompt.submit()
	})

	const selectedVolumes = await prompt.run()
	expect(selectedVolumes).toEqual([])
})
