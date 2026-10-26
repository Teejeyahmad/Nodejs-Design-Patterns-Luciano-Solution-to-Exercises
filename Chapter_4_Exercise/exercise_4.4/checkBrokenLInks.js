import {
  getContent,
  getPageLinks,
  checkHead
} from './utils.js'


const loaded=new Set();
export function checkBrokenLinks(url, queue,maxDepth,cb){
  loaded.add(url)
  checkHead(url,(err,broken)=>{
    console.log(`\x1b[32mOpening ${url}\x1b[0m`);
    if(err) return cb(err);
    if(broken) {
      console.log("\x1b[31m404 Broken Link: ", url)
      return cb() ;
    }
    loadLink(url,queue,maxDepth,cb)
  })
}


function loadLink(url,queue,maxDepth,cb){
  if(maxDepth === 0) {
    return cb()
  } 

  getContent(url, (err, content)=>{
    if(err)return cb(err);
    content=content.toString();

    const links= getPageLinks(url,content)

    if(links.length==0) return cb();

    for(const link of links){
      if(!loaded.has(link)){
      queue.pushTask((done)=>{
        checkBrokenLinks(link,queue,maxDepth-1,done)
      })
      loaded.add(link)
    }
    }
    return cb() 
  })

}