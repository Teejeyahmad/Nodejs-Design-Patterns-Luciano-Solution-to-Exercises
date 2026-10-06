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
    let ticks=0;
    const emitter = new EventEmitter;
    const timeout=((remainingtime)=>{
       let delay=remainingtime<50?remainingtime:50
        setTimeout(()=>{
            // If delay < 50, we are at the final fraction of time. 
            // The time logged here will include the accumulated event loop drift.
            if(delay<50)return cb(null,ticks,Date.now()-start);
            emitter.emit('tick',ticks+1,Date.now()-start);
            ticks++;

            // If this was exactly the last 50ms cycle, fire the callback immediately.
            if (remainingtime === 50) {
                return cb(null, ticks, Date.now()-start);
            }
        timeout(remainingtime-50)
    },delay)})
        timeout(num)
    return emitter
};

ticker(120,(err,data,time)=>(console.log(`\x1b[32mTotal ticks: ${data}, Total time: ${time}\x1b[0m`))).on('tick',(ticks,time)=>console.log(`Tick: ${ticks}, Time: ${time}`));