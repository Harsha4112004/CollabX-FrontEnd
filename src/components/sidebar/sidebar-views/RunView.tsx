import { useRunCode } from "@/context/RunCodeContext"
import useResponsive from "@/hooks/useResponsive"
import { ChangeEvent } from "react"
import toast from "react-hot-toast"
import { LuCopy, LuPlay } from "react-icons/lu"
import { PiCaretDownBold } from "react-icons/pi"
import { motion, AnimatePresence } from "framer-motion"

function RunView() {
    const { viewHeight } = useResponsive()
    const {
        setInput,
        output,
        isRunning,
        supportedLanguages,
        selectedLanguage,
        setSelectedLanguage,
        runCode,
    } = useRunCode()

    const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const lang = JSON.parse(e.target.value)
        setSelectedLanguage(lang)
    }

    const copyOutput = () => {
        navigator.clipboard.writeText(output)
        toast.success("Output copied to clipboard")
    }

    return (
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
                    <LuPlay size={20} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Run Code
                </h1>
            </div>

            <div className="flex h-full flex-col gap-4">
                {/* Language Selector */}
                <div className="relative">
                    <select
                        className="w-full rounded-2xl border border-gray-700/50 bg-gray-900/50 backdrop-blur-sm px-4 py-3 text-gray-100 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/30 transition-all duration-300 appearance-none cursor-pointer"
                        value={JSON.stringify(selectedLanguage)}
                        onChange={handleLanguageChange}
                    >
                        {supportedLanguages
                            .sort((a, b) => (a.language > b.language ? 1 : -1))
                            .map((lang, i) => {
                                return (
                                    <option
                                        key={i}
                                        value={JSON.stringify(lang)}
                                        className="bg-gray-900 text-gray-100"
                                    >
                                        {lang.language +
                                            (lang.version
                                                ? ` (${lang.version})`
                                                : "")}
                                    </option>
                                )
                            })}
                    </select>
                    <PiCaretDownBold
                        size={16}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                    />
                </div>

                {/* Input Section */}
                <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-300">
                        Input
                    </label>
                    <textarea
                        className="min-h-[120px] w-full resize-none rounded-2xl border border-gray-700/50 bg-gray-900/50 backdrop-blur-sm p-4 text-gray-100 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/30 transition-all duration-300"
                        placeholder="Enter your input here... (e.g., test cases, function parameters)"
                        onChange={(e) => setInput(e.target.value)}
                    />
                </div>

                {/* Run Button */}
                <motion.button
                    className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-4 font-bold text-white shadow-lg transition-all duration-300 hover:shadow-indigo-500/25 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                    onClick={runCode}
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
                                    <LuPlay size={18} />
                                </motion.div>
                                Running Code...
                            </>
                        ) : (
                            <>
                                <LuPlay size={18} />
                                Run Code
                            </>
                        )}
                    </div>
                </motion.button>

                {/* Output Section */}
                <AnimatePresence>
                    <motion.div 
                        className="flex flex-col gap-3 flex-grow"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-300">
                                Output
                            </label>
                            <motion.button 
                                onClick={copyOutput} 
                                title="Copy Output"
                                className="flex items-center gap-2 rounded-2xl bg-gray-800/50 backdrop-blur-sm px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300 border border-gray-700/30 text-sm"
                                whileHover={{ scale: 1.05, y: -1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <LuCopy size={14} />
                                Copy
                            </motion.button>
                        </div>
                        
                        <motion.div 
                            className="w-full flex-grow resize-none overflow-y-auto rounded-2xl border border-gray-700/50 bg-gray-900/30 backdrop-blur-sm p-4 text-gray-100 outline-none"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <code className="font-mono text-sm">
                                <pre className="text-wrap whitespace-pre-wrap break-words">
                                    <AnimatePresence mode="wait">
                                        <motion.span
                                            key={output}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            {output || (
                                                <span className="text-gray-500 italic">
                                                    Output will appear here after running your code...
                                                </span>
                                            )}
                                        </motion.span>
                                    </AnimatePresence>
                                </pre>
                            </code>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>

                {/* Empty State */}
                <AnimatePresence>
                    {!output && !isRunning && (
                        <motion.div
                            className="flex flex-col items-center justify-center py-16 text-gray-400 flex-grow"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-2xl flex items-center justify-center mb-4 border border-gray-700/50">
                                <LuPlay size={32} className="text-gray-500" />
                            </div>
                            <p className="text-lg font-semibold mb-2">Code Runner</p>
                            <p className="text-sm text-center max-w-sm">
                                Select a language, write your code, and run it to see the output
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    )
}

export default RunView