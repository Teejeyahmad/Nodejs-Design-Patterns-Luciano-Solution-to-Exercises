
import { TaskQueue } from './TaskQueue.js'
import { checkBrokenLinks } from './checkBrokenLInks.js'

const url = process.argv[2]
const maxDepth = Number.parseInt(process.argv[3], 10) || 1
const concurrency = Number.parseInt(process.argv[4], 10) || 2
if(!url){
    console.log(new Error("Provide Url"))
    process.exit(1)
}
const spiderQueue = new TaskQueue(concurrency)
spiderQueue.on('error', console.error)
spiderQueue.on('empty', () => console.log('Crawling complete'))

spiderQueue.pushTask((done)=>{
    checkBrokenLinks(url, spiderQueue, maxDepth,done)
})