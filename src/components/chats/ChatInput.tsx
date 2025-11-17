import { useAppContext } from "@/context/AppContext"
import { useChatRoom } from "@/context/ChatContext"
import { useSocket } from "@/context/SocketContext"
import { ChatMessage } from "@/types/chat"
import { SocketEvent } from "@/types/socket"
import { formatDate } from "@/utils/formateDate"
import { FormEvent, useRef } from "react"
import { LuSendHorizonal } from "react-icons/lu"
import { v4 as uuidV4 } from "uuid"
import { motion } from "framer-motion"

function ChatInput() {
    const { currentUser } = useAppContext()
    const { socket } = useSocket()
    const { setMessages } = useChatRoom()
    const inputRef = useRef<HTMLInputElement | null>(null)

    const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const inputVal = inputRef.current?.value.trim()

        if (inputVal && inputVal.length > 0) {
            const message: ChatMessage = {
                id: uuidV4(),
                message: inputVal,
                username: currentUser.username,
                timestamp: formatDate(new Date().toISOString()),
            }
            socket.emit(SocketEvent.SEND_MESSAGE, { message })
            setMessages((messages) => [...messages, message])

            if (inputRef.current) inputRef.current.value = ""
        }
    }

    return (
        <motion.form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 rounded-2xl border border-gray-700/50 bg-gray-900/50 backdrop-blur-sm p-1 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <input
                type="text"
                className="w-full flex-grow rounded-2xl border-none bg-transparent p-4 text-gray-100 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/50"
                placeholder="Type your message..."
                ref={inputRef}
            />
            <motion.button
                className="flex items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-3 text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <LuSendHorizonal size={20} />
            </motion.button>
        </motion.form>
    )
}

export default ChatInput