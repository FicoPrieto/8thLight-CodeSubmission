//###  App  ###//
import Settings from "../../Settings"


//##############################//
//###  Exports.Class.Public  ###//
//##############################//

export class Environment{
	public static get is_Testing    (){return _get() == _Environment.Testing    }
	public static get is_Development(){return _get() == _Environment.Development}
	public static get is_Production (){return _get() == _Environment.Production }
}


//###################//
//###  Utilities  ###//
//###################//

export enum _Environment{
	Testing     = "Testing",
	Development = "Development",
	Production  = "Production",
}

function _get(){
	const is_Testing     = process.env[Settings.testEnvironment_Key]
	const is_Development = process.env["npm_execpath"]

	if     (is_Testing    ){return _Environment.Testing    }
	else if(is_Development){return _Environment.Development}
	else                   {return _Environment.Production }
}
