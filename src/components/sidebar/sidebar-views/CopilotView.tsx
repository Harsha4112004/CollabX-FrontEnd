import { useCopilot } from "@/context/CopilotContext"
import { useFileSystem } from "@/context/FileContext"
import { useSocket } from "@/context/SocketContext"
import useResponsive from "@/hooks/useResponsive"
import { SocketEvent } from "@/types/socket"
import toast from "react-hot-toast"
import { LuClipboardPaste, LuCopy, LuRepeat, LuSparkles, LuX } from "react-icons/lu"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"

function CopilotView() {
    const {socket} = useSocket()
    const { viewHeight } = useResponsive()
    const { generateCode, output, isRunning, setInput } = useCopilot()
    const { activeFile, updateFileContent, setActiveFile } = useFileSystem()
    const [showReplaceModal, setShowReplaceModal] = useState(false)

    const copyOutput = async () => {
        try {
            const content = output.replace(/```[\w]*\n?/g, "").trim()
            await navigator.clipboard.writeText(content)
            toast.success("Output copied to clipboard")
        } catch (error) {
            toast.error("Unable to copy output to clipboard")
            console.log(error)
        }
    }

    const pasteCodeInFile = () => {
        if (activeFile) {
            const fileContent = activeFile.content
                ? `${activeFile.content}\n`
                : ""
            const content = `${fileContent}${output.replace(/```[\w]*\n?/g, "").trim()}`
            updateFileContent(activeFile.id, content)
            // Update the content of the active file if it's the same file
            setActiveFile({ ...activeFile, content })
            toast.success("Code pasted successfully")
            // Emit the FILE_UPDATED event to the server
            socket.emit(SocketEvent.FILE_UPDATED, {
                fileId: activeFile.id,
                newContent: content,
            })
        }
    }

    const handleReplaceCodeInFile = () => {
        setShowReplaceModal(true)
    }

    const confirmReplaceCode = () => {
        if (activeFile) {
            const content = output.replace(/```[\w]*\n?/g, "").trim()
            updateFileContent(activeFile.id, content)
            // Update the content of the active file if it's the same file
            setActiveFile({ ...activeFile, content })
            toast.success("Code replaced successfully")
            // Emit the FILE_UPDATED event to the server
            socket.emit(SocketEvent.FILE_UPDATED, {
                fileId: activeFile.id,
                newContent: content,
            })
            setShowReplaceModal(false)
        }
    }

    const cancelReplace = () => {
        setShowReplaceModal(false)
    }

    return (
        <>
            <motion.div
                className="flex max-h-full min-h-[400px] w-full flex-col gap-4 p-6"
                style={{ height: viewHeight }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <LuSparkles size={20} className="text-white" />
                    </div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                        AI Copilot
                    </h1>
                </div>

                {/* Input Section */}
                <div className="space-y-4">
                    <textarea
                        className="w-full min-h-[140px] rounded-2xl border border-gray-700/50 bg-gray-900/50 backdrop-blur-sm p-4 text-gray-100 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/30 transition-all duration-300 resize-none"
                        placeholder="Describe the code you want to generate... (e.g., 'Create a React component for a login form')"
                        onChange={(e) => setInput(e.target.value)}
                    />
                    
                    <motion.button
                        className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-4 font-bold text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                        onClick={generateCode}
                        disabled={isRunning}
                        whileHover={{ scale: isRunning ? 1 : 1.02, y: isRunning ? 0 : -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="flex items-center justify-center gap-2">
                            {isRunning ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        <LuRepeat size={18} />
                                    </motion.div>
                                    Generating Code...
                                </>
                            ) : (
                                <>
                                    <LuSparkles size={18} />
                                    Generate Code
                                </>
                            )}
                        </div>
                    </motion.button>
                </div>

                {/* Output Section */}
                <AnimatePresence>
                    {output && (
                        <motion.div
                            className="flex flex-col gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            {/* Action Buttons */}
                            <div className="flex justify-end gap-3">
                                <motion.button 
                                    title="Copy Output" 
                                    onClick={copyOutput}
                                    className="flex items-center gap-2 rounded-2xl bg-gray-800/50 backdrop-blur-sm px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300 border border-gray-700/30"
                                    whileHover={{ scale: 1.05, y: -1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <LuCopy size={16} />
                                    Copy
                                </motion.button>
                                <motion.button
                                    title="Replace code in file"
                                    onClick={handleReplaceCodeInFile}
                                    className="flex items-center gap-2 rounded-2xl bg-gray-800/50 backdrop-blur-sm px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300 border border-gray-700/30"
                                    whileHover={{ scale: 1.05, y: -1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <LuRepeat size={16} />
                                    Replace
                                </motion.button>
                                <motion.button
                                    title="Paste code in file"
                                    onClick={pasteCodeInFile}
                                    className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-2 text-white shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
                                    whileHover={{ scale: 1.05, y: -1 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <LuClipboardPaste size={16} />
                                    Paste
                                </motion.button>
                            </div>

                            {/* Output Content */}
                            <motion.div 
                                className="h-full rounded-2xl border border-gray-700/50 bg-gray-900/30 backdrop-blur-sm overflow-hidden shadow-lg"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <div className="h-full overflow-y-auto">
                                    <ReactMarkdown
                                        components={{
                                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                            code({ inline, className, children, ...props }: any) {
                                                const match = /language-(\w+)/.exec(className || "")
                                                const language = match ? match[1] : "javascript"

                                                return !inline ? (
                                                    <SyntaxHighlighter
                                                        style={dracula}
                                                        language={language}
                                                        PreTag="div"
                                                        className="!m-0 !h-full !rounded-none !bg-gray-900/80 !p-4 !backdrop-blur-sm"
                                                        customStyle={{
                                                            background: 'rgba(17, 24, 39, 0.8)',
                                                            fontSize: '14px',
                                                            lineHeight: '1.5',
                                                        }}
                                                        codeTagProps={{
                                                            style: {
                                                                fontFamily: 'Monaco, "JetBrains Mono", monospace',
                                                            }
                                                        }}
                                                    >
                                                        {String(children).replace(/\n$/, "")}
                                                    </SyntaxHighlighter>
                                                ) : (
                                                    <code 
                                                        className={`${className} bg-gray-800/50 px-1.5 py-0.5 rounded-md text-indigo-300 font-mono text-sm`} 
                                                        {...props}
                                                    >
                                                        {children}
                                                    </code>
                                                )
                                            },
                                            pre({ children }) {
                                                return <div className="h-full">{children}</div>
                                            },
                                            h1: ({ children }) => <h1 className="text-2xl font-bold text-white mb-4 mt-6 first:mt-0">{children}</h1>,
                                            h2: ({ children }) => <h2 className="text-xl font-bold text-white mb-3 mt-5">{children}</h2>,
                                            h3: ({ children }) => <h3 className="text-lg font-bold text-white mb-2 mt-4">{children}</h3>,
                                            p: ({ children }) => <p className="text-gray-300 mb-4 leading-relaxed">{children}</p>,
                                            ul: ({ children }) => <ul className="text-gray-300 mb-4 list-disc list-inside space-y-1">{children}</ul>,
                                            ol: ({ children }) => <ol className="text-gray-300 mb-4 list-decimal list-inside space-y-1">{children}</ol>,
                                            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                                            blockquote: ({ children }) => (
                                                <blockquote className="border-l-4 border-indigo-500 pl-4 my-4 text-gray-400 italic">
                                                    {children}
                                                </blockquote>
                                            ),
                                        }}
                                    >
                                        {output}
                                    </ReactMarkdown>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Empty State */}
                <AnimatePresence>
                    {!output && !isRunning && (
                        <motion.div
                            className="flex flex-col items-center justify-center py-16 text-gray-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-2xl flex items-center justify-center mb-4 border border-gray-700/50">
                                <LuSparkles size={32} className="text-gray-500" />
                            </div>
                            <p className="text-lg font-semibold mb-2">AI Code Generation</p>
                            <p className="text-sm text-center max-w-sm">
                                Describe what you want to build and let AI generate the code for you
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Replace Confirmation Modal */}
            <AnimatePresence>
                {showReplaceModal && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="w-full max-w-md rounded-2xl border border-gray-700/50 bg-gray-900/95 backdrop-blur-xl p-6 shadow-2xl"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25 }}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                                        <LuRepeat size={16} className="text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">
                                        Replace File Content
                                    </h3>
                                </div>
                                <button
                                    onClick={cancelReplace}
                                    className="rounded-xl p-1 hover:bg-gray-800/50 transition-colors duration-200"
                                >
                                    <LuX size={20} className="text-gray-400" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="mb-6">
                                <p className="text-gray-300 mb-3">
                                    Are you sure you want to replace the entire content of{" "}
                                    <span className="font-semibold text-white">
                                        {activeFile?.name || "the current file"}
                                    </span>{" "}
                                    with the generated code?
                                </p>
                                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                                    <p className="text-red-400 text-sm">
                                        ⚠️ This action cannot be undone. All existing content will be permanently replaced.
                                    </p>
                                </div>
                            </div>

                            {/* Modal Actions */}
                            <div className="flex gap-3">
                                <motion.button
                                    onClick={cancelReplace}
                                    className="flex-1 rounded-2xl bg-gray-800/50 backdrop-blur-sm px-4 py-3 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300 border border-gray-700/30 font-medium"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    onClick={confirmReplaceCode}
                                    className="flex-1 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 px-4 py-3 text-white shadow-lg hover:shadow-red-500/25 transition-all duration-300 font-medium"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    Replace File
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default CopilotView