
//########################//
//###  Exports.Public  ###//
//########################//

export type AppData = {
	Books: Book[],
}

export type Book = {
	id:         string,
	title:      string,
	authors?:   string[],
	publisher?: string,
}

