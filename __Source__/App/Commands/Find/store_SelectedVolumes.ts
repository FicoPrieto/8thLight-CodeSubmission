//###  App  ###//
import {App}         from "../../__Main__"
import {Environment} from "../../../Modules/Environment/__Main__"
import {Prompt     } from "../../../Modules/Prompt/_Type"

//###  NPM  ###//
import {Volume} from "../../../NPM/GoogleBooks/__Main__"


//#################################//
//###  Exports.Function.Public  ###//
//#################################//

export function store_SelectedVolumes(volumes:(Volume[]|Prompt<Volume>)){
	if(Environment.is_Testing || !(volumes instanceof Array))
		{return}

	for(const volume of volumes){
		App.database.Books.add({
			id:        volume.id,
			title:     volume.volumeInfo.title,
			authors:   volume.volumeInfo.authors,
			publisher: volume.volumeInfo.publisher,
		})
	}
}
