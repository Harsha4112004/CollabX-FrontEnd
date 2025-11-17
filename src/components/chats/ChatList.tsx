import { useAppContext } from "@/context/AppContext"
import { useChatRoom } from "@/context/ChatContext"
import { SyntheticEvent, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

function ChatList() {
    const {
        messages,
        isNewMessage,
        setIsNewMessage,
        lastScrollHeight,
        setLastScrollHeight,
    } = useChatRoom()
    const { currentUser } = useAppContext()
    const messagesContainerRef = useRef<HTMLDivElement | null>(null)

    const handleScroll = (e: SyntheticEvent) => {
        const container = e.target as HTMLDivElement
        setLastScrollHeight(container.scrollTop)
    }

    // Scroll to bottom when messages change
    useEffect(() => {
        if (!messagesContainerRef.current) return
        messagesContainerRef.current.scrollTop =
            messagesContainerRef.current.scrollHeight
    }, [messages])

    useEffect(() => {
        if (isNewMessage) {
            setIsNewMessage(false)
        }
        if (messagesContainerRef.current)
            messagesContainerRef.current.scrollTop = lastScrollHeight
    }, [isNewMessage, setIsNewMessage, lastScrollHeight])

    return (
        <motion.div
            className="flex-grow overflow-auto rounded-2xl bg-gray-900/30 backdrop-blur-sm border border-gray-700/50 p-6 shadow-inner"
            ref={messagesContainerRef}
            onScroll={handleScroll}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <AnimatePresence>
                {messages.map((message, index) => {
                    const isOwnMessage = message.username === currentUser.username
                    
                    return (
                        <motion.div
                            key={message.id || index}
                            className={`mb-4 flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, x: isOwnMessage ? 50 : -50 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <div
                                className={`max-w-[80%] break-words rounded-2xl px-4 py-3 shadow-lg ${
                                    isOwnMessage
                                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-md"
                                        : "bg-gray-800/70 text-gray-100 border border-gray-700/50 rounded-bl-md backdrop-blur-sm"
                                }`}
                            >
                                {/* Message header */}
                                <div className="flex justify-between items-center mb-1">
                                    <span 
                                        className={`text-xs font-semibold ${
                                            isOwnMessage 
                                                ? "text-indigo-100" 
                                                : "text-gray-400"
                                        }`}
                                    >
                                        {message.username}
                                        {isOwnMessage && " (You)"}
                                    </span>
                                    <span 
                                        className={`text-xs ${
                                            isOwnMessage 
                                                ? "text-indigo-200" 
                                                : "text-gray-500"
                                        }`}
                                    >
                                        {message.timestamp}
                                    </span>
                                </div>
                                
                                {/* Message content */}
                                <p className="py-1 leading-relaxed">{message.message}</p>
                                
                                {/* Message status indicator */}
                                {isOwnMessage && (
                                    <div className="flex justify-end mt-1">
                                        <motion.div 
                                            className="w-2 h-2 bg-green-400 rounded-full"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )
                })}
            </AnimatePresence>

            {/* Empty state */}
            {messages.length === 0 && (
                <motion.div
                    className="flex flex-col items-center justify-center h-full text-gray-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-2xl flex items-center justify-center mb-4 border border-gray-700/50">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-8 w-8 text-gray-500"
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6h18v8h-5l-5 5v-5z" 
                            />
                        </svg>
                    </div>
                    <p className="text-lg font-semibold mb-2">No messages yet</p>
                    <p className="text-sm text-center max-w-sm">
                        Start a conversation by sending the first message!
                    </p>
                </motion.div>
            )}
        </motion.div>
    )
}

export default ChatList