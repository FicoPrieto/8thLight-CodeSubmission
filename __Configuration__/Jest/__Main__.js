module.exports = {

	rootDir:           "../../__Source__",
	coverageDirectory: "../__Generated__/Jest",

	preset:          "ts-jest",
	testEnvironment: "node",

	testMatch: [
		"<rootDir>/**/*.test.ts",
	],

	setupFiles: [
		"<rootDir>/TestSetup.ts",
	],

}
