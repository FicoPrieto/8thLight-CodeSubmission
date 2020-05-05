//###  Module  ###//
import {VolumeInstance_Array} from "./_TestUtilities"

//###  App  ###//
import {App} from "../../App"

//###  NPM  ###//
import {Volume} from "../../NPM/GoogleBooks/__Main__"


//#################//
//###  Aliases  ###//
//#################//

const {run} = App


//###############//
//###  Tests  ###//
//###############//

test("`find` retrieves `Volume`s from `GoogleBooks` API with valid query", async ()=>{
	const {foundVolumes} = await run("find Programming")
	expect(foundVolumes).toEqual(VolumeInstance_Array)
})

test("`find` retrieves no `Volume`s from `GoogleBooks` API with invalid query", async ()=>{
	const {foundVolumes} = await run(`find ${_randomString}`)
	expect(foundVolumes).toHaveLength(0)
})

test("`find` retrieves `Volume`s from `GoogleBooks` API with book excerpt", async ()=>{
	const {foundVolumes}  = (await run(`find ${_bookExcerpt}`)) as {foundVolumes:Volume[]}
	const firstTitle = foundVolumes[0].volumeInfo.title.toLowerCase()
	expect(
		["pragmatic", "thinking", "learning"]
			.every(keyword => firstTitle.includes(keyword))
	).toBe(true)
})

test("`find` requires an argument", async ()=>{
	const result = await run(`find`)
	expect(result.includes("Missing required argument.")).toBe(true)
})


//###################//
//###  Utilities  ###//
//###################//

const _randomString = "Lfb5Q5S15m qg1EyXkJxH oetF49XaxO etCsy1Magu 0XtaX5K0hd cfopeM26Q5 G0BzarnGqV YXgwpbA5ui RYmcWyEr4u M7KIBTcfkj nrTjGQCpmH BC3jD43gDR KbHJzJt1ms QbeuGQdiew i1QsYp9YCQ o27sdQwiun uA8gbC4mKw YCYoi49Uk5 ryxhLGyS3S kMFcDYq6yD xVJGPxfCyy wmKCFOgbxh GQ0wJ046fC XFZxaqttrw qwgeC0q2sg 79UnPZnd7M E55Y2tC0yH RZUY038Jhl JIPPACPOri zkLOCXSPlp 0olUHsjq3d s0mEwyn7mz Ck7DU5k84P Qgl4U9tzuj okNJ5FugKn yYdO9Lk41E boeqIF7ksS WnPcWLH7rp tipeTDetsA SGiuViLQr3 ldUB6QGpgn FxuLeedFIf uet2ak8n1P k41j6qNRrN XUIyydCj92 weWonLTTmg zXr8ktocpT vo0pKyqGx7 GMA8gzVp0R R73HpW9zpN J02AE6CrsL lVJG9mzqbC wGOydRCEtO JD8LNqpkwJ tSKelKn9iI 6JBKMYHL7d HtMDtWJHab iysO4GpMu7 jK7dYSgvQP MGXp7pmS4N rdOLmOajUs 71NaB9Jq0r OIn31R6C13 JIWqif3ElV RgbV4XRcb9 ujqaE7Lpqt 7o3vyUcP13 xOuBzdIAod XitKPoHrmb mr6eYcOoPL IcTt03FtrW 9ZesFgffb4 BJ4UObEE36 AdiuoeBqr9 Fj9p06zGvi As9OKwWuic YExn02JYtM fpSeU9VnqT 4FnR8kAEzD R2AcLRazhj SMM5HN5BPw thHSMrLimn IORem0SO2o Hk5JkDSRm4 rT1blk8E8N 8qncf7DEMJ p3hrabTy0X QkWHttDIHF IxPZk1w4mz iu2Q6fxdEV NddkPt67X9 nLp1diFGuJ vNafreh5Dq 6bu4vW9wqG OBOyJ8N4T2 tz6QCFOQMc WhKqmkkfWe RJrXB36Tn0 xUJQNREn8x b2BuybiwNy"

/** Source: `Pragmatic Thinking & Learning`, Page 13 */
const _bookExcerpt = `
Welcome!
Thanks for picking up this book. Together, we’re going to journey
through bits of cognitive science, neuroscience, and learning and
behavioral theory. You’ll see surprising aspects of how our brains
work and see how you can beat the system to improve your own
learning and thinking skills.
We’re going to begin to refactor your wetware—redesign and rewire
your brain—to make you more effective at your job. Whether you’re
a programmer, manager, “knowledge worker,” technogeek, or deep
thinker, or if you just happen to have a human brain you’d like to
crank up, this book will help.
I’m a programmer, so my examples and rants will be directed at the
world of software development. If you’re not a programmer, don’t
worry; programming really has little to do with writing software in
arcane, cryptic languages (although we have a curious attachment
to that habit).
Programming is all about problem solving. It requires creativity,
ingenuity, and invention. Regardless of your profession, you probably
also have to solve problems creatively. However, for programmers,
combining rich, flexible human thought with the rigid constraints
of a digital computer exposes the power and the deepest
flaws of both.
`
