import style from './index.module.css';
import { MessageSquareWarning } from 'lucide-react';
import { motion } from "framer-motion";
import {
    FileWarning as FileWarningIcon,
    CheckCheck as CheckCheckIcon,
    X as XIcon
} from 'lucide-react';

const icons = {
    fileWarningIcon: <FileWarningIcon color="white" size={28} />,
    checkCheckIcon: <CheckCheckIcon color="white" size={28} />,
    xIcon: <XIcon color="white" size={28} />,
    default: <MessageSquareWarning color="white" size={28} />
}

export type iconType = keyof typeof icons;

interface Props {
    iconType?: iconType;
    content: string;
}

export function Notification({ iconType, content }: Props) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={style.container}
        >
            {icons[iconType || "default"]}
            <p>{content}</p>
        </motion.div>
    );
}
