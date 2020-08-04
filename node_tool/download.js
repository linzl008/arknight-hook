const request = require("request");
const fs = require("fs");
const fly = require("flyio");
function savePic(imgUrl, filename) {
    return new Promise((resolve , reject )=>{
        fly.get(imgUrl, null, {
            responseType:"stream",
        }).then((res)=>{
            fs.writeFileSync( __dirname +'/resource/images/'+filename, Buffer.from(res.data),'binary');
            resolve("")
        }).catch(err=>{
            console.log("filename: " + filename + "下载失败");
            fs.copyFile(__dirname +'/resource/images/char_bkg.jpg',__dirname +'/resource/images/'+filename,function(err){
                if(err) console.log('something wrong was happened',err)
                else console.log('copy file succeed');
                resolve("filename: " + filename + "下载失败")
            })
        })
    })


}

/**
 * 获取角色页
 * @param params
 */
 function getArkCharacters(params){
     return new Promise((resolve, reject)=>{
         request.post( {
             url: "https://www.diopoo.com/ark/characters/ajax",
             form: params
         }, function(error, response, body){
            if(error){
                reject(error)
            }else{
                resolve(JSON.parse(body))
            }
         })
     })

}
/**
 * 获取干员基础数据
 * @returns {Promise<Array|T[]>}
 */
async function getAllArkCharacters() {
    let list = []
    let params = {
        name: "",
        pn: 1,
        ps: 999
    }
    async function getData(){
        let res = await getArkCharacters(params)
        return res
    }
    while(true){
        let res = await getData()
        if(res.data.length === 0){
            break
        }
        params.pn ++
        list = list.concat(res.data)
    }
    return Promise.resolve(list)
}

/**
 * 写入干员配置文件
 */
function writeCharacterFile(data){
    try{
        fs.writeFileSync( __dirname +'/resource/characters.json', JSON.stringify(data, null ,2 ));
        return {}
    }catch (e) {
        console.log(e);
        return {err: e}
    }
}
/**
 * 读取干员配置文件
 */
function readCharacterFile(){
    return new Promise((resolve,reject)=>{
        fs.open(__dirname +'/resource/characters.json', 'a+', async (err, fd) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    console.error('characters.json 不存在');
                }
            }else{
                let data = fs.readFileSync(fd,'utf8')  ;
                if(data){
                    fs.close(fd,(err) => {
                        if (err) throw err;
                    })
                    resolve(JSON.parse(data));
                }else{
                    let res = await getAllArkCharacters()
                    writeCharacterFile(res)
                    resolve(res);
                }

            }
        });
    } )

}

async function startTask(){
    let list = await readCharacterFile()
    console.log(list.length);
    for (let i = 0; i < 4; i++) {
    // for (let i = 0; i < list.length; i++) {
        const data = list[i];
        let baseUrl = "https://www.diopoo.com/ark/media/character/card/"
        console.log(baseUrl + data.card_a);
        let resA = await savePic(baseUrl + data.card_a,data.card_a)
        if(data.card_b){
            let resB = await savePic(baseUrl + data.card_b,data.card_b)
        }
    }
}
startTask()
