## Project Information




&nbsp;
<!--######-->
#  Process  #
<!--######-->

I started off by extracting the key points from Julie's email into:
- [**Project Guidelines**](./Guidelines.md)
- Software specifications via [**#1**](../../../../../issues/1) & [**#2**](../../../../../issues/2)

I then built out the project from several contexts:

- `__Source__/Modules`
  - project-specific library wrappers & convenience functions
- `__Source__/NPM`
  - general purpose functionality
  - due to time & project-scope constraints
    - they are located in the `NPM` folder rather than being published as proper packages
    - the implementations & tests only cover the scope that is relevant to the project
- `__Source__/App`
  - runtime-specific functionality


&nbsp;
<!--#################################-->
# Topics Researched / Skills Acquired  #
<!--#################################-->

• git  

• DevOps  

• GitHub Actions  
&nbsp;&nbsp;&nbsp;&nbsp;(*here's the [**Release Action**](../../../.github/workflows/Release.yml) I wrote*)  

• NPM Scripts cross-platform compatibility  
&nbsp;&nbsp;&nbsp;&nbsp;(*local dev on Windows, remote build @ GitHub Actions*)  

• NPM Packages  
&nbsp;&nbsp;&nbsp;&nbsp;(*[**vorpal**](https://www.npmjs.com/package/vorpal), [**enquirer**](https://www.npmjs.com/package/enquirer), [**lowdb**](https://www.npmjs.com/package/lowdb)*)  

• Javascript [**Proxy**](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)  
&nbsp;&nbsp;&nbsp;&nbsp;(*used in my [**ExpectBoolean**](../../../__Source__/NPM/ExpectBoolean/__Main__.ts) package*)  

&nbsp;  
Before this project, my experience with git was very minimal. I didn't really have a workflow, and didn't know how to work with branches or clean up my commit history. After researching various workflows, I settled on the following strategy which I based on `Git Flow` and `GitHub Flow`:

- create [**GitHub Issues**](../../../../../issues?q=is%3Aissue) for new features, in addition to actual issues
- create `<scope>/<issue>--description>` branches to resolve issues & features
- create `Release/<#.#.#>` branches to merge `<scope>` branches into, before finally merging `Release` into `master`
- work on features locally, with a commit history of something like:
  ```
  Branch: Feature/1--QueryBooks
  
    [Feature #1] implement GoogleBooks API's Volume
    `List` implementation
    ..
    tests @ `List`
    ..
    ..
    [Feature.Close #1] book querying @ CLI
    documentation
    ..
    ..
    utilities
    ..
  ```
- prefixed messages are milestones that will be pushed to the remote repo, and follow the convention `[<scope> #<issue>] <description>`
- the non-prefixed messages are just for personal debugging purposes, and will be squashed before pushing to `remote`
- the `..` messages are continuations of their preceding message
- the resulting `remote` history will be as follows; where each commit is 100% stable, fully tested, & documented
  ```
  [Feature #1] implement GoogleBooks API's Volume
  [Feature.Close #1] implement book querying @ CLI
  ```
- `Feature/1--QueryBooks` will now be merged into `Release/1.0.0`
- once the other `1.0.0`-related branches are complete, merge `Release/1.0.0` into `master`, at which point a `GitHub Action` will
  - test
  - build
  - create a release, with build assets attached
  
This strategy has been working pretty well for me and I think it results in having a very informative & concise [**commit history**](../../../../../commits/master).
