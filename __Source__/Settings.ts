export default{

	appName:           "ReadingList",
	databaseExtension: "data",

	testEnvironment_Key: "__TEST_ENVIRONMENT__",

	maximum_QueryResults: 5,

	UI: {
		indentationWidth:  3,
		maximum_LineWidth: 80,
		truncationString:  "...",
		choiceIndicator:   "✓",
	},

	Output: {
		Command: {
			Find: {
				command:     "find <query>",
				description: "Searches GoogleBooks for the given query, then allows you to select books to save to your reading list.",
				query_API: {
					inProgress: "Querying GoogleBooks API",
					noResults:  "No books were found matching your query. Try simplifying your query.",
					fail:       "Unable to access the GoogleBooks API.",
				},
				get_UserSelection: {
					select:    "Select the books you'd like to save to your reading list",
					noResults: "0 books were saved to your reading list.",
					found:     /* <n> books were */ "found.",
					saved:     /* <n> books were */ "saved to your reading list.",
				},
			},
		},
	},

}
