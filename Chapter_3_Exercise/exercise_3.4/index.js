import {EventEmitter} from 'node:events'


/**
 * UNDERSTANDING TIMER DRIFT IN NODE.JS
 * 
 * You will notice the logged times are not exactly 50, 100, 150, etc. 
 * This happens because of two rules in the Node.js event loop:
 * 
 * 1. Minimum Delay Guarantee: setTimeout(..., 50) does not mean "execute at exactly 50ms". 
 *    It means "wait AT LEAST 50ms before adding this callback to the timers queue."
 * 
 * 2. Compounding Drift: Once the 50ms passes, the callback still has to wait for the 
 *    call stack to be empty before it can execute. This adds a small delay (1-5ms). 
 *    Because we schedule the next setTimeout *inside* the current one, these tiny delays 
 *    add up. Tick 1 might fire at 52ms, and Tick 2 will fire 50ms after that (at 102ms), 
 *    drifting further from perfection on every loop.
 */
function ticker (num, cb){
    let start=Date.now();
    const emitter = new EventEmitter;
    let ticks=0;
    const getElapsedTime = () => Date.now() - start;

    // exercise 3.4 (start)
    let initialTimestamp = Date.now();
    if(initialTimestamp%5 === 0) {
        let error = new Error('Timestamp is divisible by 5');
            process.nextTick(()=>{
            emitter.emit('error', error);
            cb(error,ticks,getElapsedTime());
            })
            return emitter;
        };
        
    // exercise 3.4 (end)
    process.nextTick(()=>{
            emitter.emit('tick',ticks,getElapsedTime());
            ticks++
    });

    const scheduleNext=((remainingtime)=>{
       let delay=Math.min(remainingtime,50);
        setTimeout(()=>{
            const elapsedTime = getElapsedTime();
            // If delay < 50, we are at the final fraction of time. 
            if(delay<50)return cb(null,ticks,elapsedTime);

            //exercise 3.4 
            let currentTimestamp=Date.now();
            if(currentTimestamp%5 === 0) { 
                let error = new Error('Timestamp is divisible by 5');
                emitter.emit('error', error);
                return cb(error,ticks, elapsedTime);
            }
            //exercise 3.4 (end)

            emitter.emit('tick',ticks,elapsedTime);
            ticks++;

            // If this was exactly the last 50ms cycle, fire the callback immediately.
            if (remainingtime === 50) {
                return cb(null, ticks, elapsedTime);
            }
        scheduleNext(remainingtime-50)
    },delay)})

        scheduleNext(num)

    return emitter
};

ticker(2049,(err,data,time)=>{
if(err) console.error(`\x1b[31mError occurred: ${err.message}\x1b[0m`);
   console.log(`\x1b[32mTotal ticks: ${data}, Total time: ${time}\x1b[0m`)
}).on('tick',(ticks,time)=>console.log(`Tick: ${ticks}, Time: ${time}`))
  .on('error',(error)=>console.error(`\x1b[31mError Event occurred: ${error.message}\x1b[0m`));