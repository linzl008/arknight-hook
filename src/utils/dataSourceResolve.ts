import {Character} from "@/interface";

/**
 * 添加图片前缀
 * @param list https://www.diopoo.com/ark/media/character/card/349A.png 1:2
 */
export function resolveCharacterPic(list: Character[]) {
    return list.map((item:Character)=>{
        // let baseUrl = "https://www.diopoo.com"
        let baseUrl = ""
        // item.card_a = baseUrl + "/ark/media/character/card/" + item.card_a
        // item.card_b = baseUrl + "/ark/media/character/card/" + item.card_b
        return item
    })
}
