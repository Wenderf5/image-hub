import style from './index.module.css';
import { MessageSquareWarning } from 'lucide-react';

interface props {
    icon?: React.ReactNode,
    content: string
}

export function Notification({ icon, content }: props) {
    return (
        <div className={style.container}>
            {icon || <MessageSquareWarning color='white' size={28} />}
            <p>{content || "Esssa é uma notificação qualquer, por favor ignore!"}</p>
        </div>
    );
}