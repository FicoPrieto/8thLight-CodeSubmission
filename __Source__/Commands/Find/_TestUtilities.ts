
//#################//
//###  Aliases  ###//
//#################//

const {
	any,
	arrayContaining,
	objectContaining,
} = expect


//#########################//
//###  Exports.Private  ###//
//#########################//

export const VolumeInstance_Array =
	arrayContaining([
		objectContaining({
			id: any(String),
		}),
	])
