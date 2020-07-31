
import fly from "./config";
import {Character} from "@/interface";
import {resolveCharacterPic} from "@/utils/dataSourceResolve";

/**
 * 获取角色页，params 是假的。。
 * @param params
 */
export const getArkCharacters = (params: any) => fly.post( "/ark/characters/ajax",params,{
    headers:{
        "content-type":"application/x-www-form-urlencoded"
    }
}).then((res:any)=> JSON.parse(res))

export const savePic = ( url: string, params: any) => fly.get(url, params, {
    responseType:"arraybuffer",
}).then((res:any)=>{
    console.log(res);
})

export const getAllArkCharacters = async() => {
    let list:Character[] = []
    let params = {
        name: "",
        pn: 1,
        ps: 160
    }
    async function getData(){
        let res:any = await getArkCharacters(params)
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
    return Promise.resolve(resolveCharacterPic(list))
}

