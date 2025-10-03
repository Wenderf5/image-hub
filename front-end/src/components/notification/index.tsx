import style from './index.module.css';
import { MessageSquareWarning } from 'lucide-react';
import { motion } from "framer-motion";

interface props {
    icon?: React.ReactNode,
    content: string
}

export function Notification({ icon, content }: props) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={style.container}>
            {icon || <MessageSquareWarning color='white' size={28} />}
            <p>{content}</p>
        </motion.div>
    );
}