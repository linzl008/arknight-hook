import {Character} from "@/interface";

/**
 * 添加图片前缀
 * @param list
 */
export function resolveCharacterPic(list: Character[]) {
    return list.map((item:Character)=>{
        item.card_a = "https://www.diopoo.com/ark/media/character/card/" + item.card_a
        item.card_b = "https://www.diopoo.com/ark/media/character/card/" + item.card_b
        return item
    })
}
