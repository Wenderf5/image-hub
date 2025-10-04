import { iconType } from "@/components/notification";
import { notification } from "../redux-store/slices/notificationListSlice";

export function notificationFactory(id: string, content: string, iconType?: iconType): notification {
    return {
        id: id,
        iconType: iconType,
        content: content
    }
}