import { notification } from "../redux-store/slices/notificationListSlice";

export function notificationFactory(id: string, content: string, icon?: React.ReactNode): notification {
    return {
        id: id,
        icon: icon,
        content: content
    }
}