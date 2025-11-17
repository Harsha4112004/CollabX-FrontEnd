import Select from "@/components/common/Select"
import { useSettings } from "@/context/SettingContext"
import useResponsive from "@/hooks/useResponsive"
import { editorFonts } from "@/resources/Fonts"
import { editorThemes } from "@/resources/Themes"
import { langNames } from "@uiw/codemirror-extensions-langs"
import { ChangeEvent, useEffect } from "react"
import { motion } from "framer-motion"
import { LuSettings2, LuRefreshCw } from "react-icons/lu"

function SettingsView() {
    const {
        theme,
        setTheme,
        language,
        setLanguage,
        fontSize,
        setFontSize,
        fontFamily,
        setFontFamily,
        showGitHubCorner,
        setShowGitHubCorner,
        resetSettings,
    } = useSettings()
    const { viewHeight } = useResponsive()

    const handleFontFamilyChange = (e: ChangeEvent<HTMLSelectElement>) =>
        setFontFamily(e.target.value)
    const handleThemeChange = (e: ChangeEvent<HTMLSelectElement>) =>
        setTheme(e.target.value)
    const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) =>
        setLanguage(e.target.value)
    const handleFontSizeChange = (e: ChangeEvent<HTMLSelectElement>) =>
        setFontSize(parseInt(e.target.value))
    const handleShowGitHubCornerChange = (e: ChangeEvent<HTMLInputElement>) =>
        setShowGitHubCorner(e.target.checked)

    useEffect(() => {
        // Set editor font family
        const editor = document.querySelector(
            ".cm-editor > .cm-scroller",
        ) as HTMLElement
        if (editor !== null) {
            editor.style.fontFamily = `${fontFamily}, monospace`
        }
    }, [fontFamily])

    return (
        <motion.div
            className="flex max-h-full min-h-[400px] w-full flex-col gap-6 p-6"
            style={{ height: viewHeight }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <LuSettings2 size={20} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Editor Settings
                </h1>
            </div>

            {/* Settings Grid */}
            <div className="flex flex-col gap-6 flex-grow overflow-y-auto">
                {/* Font Settings Row */}
                <motion.div 
                    className="flex flex-col sm:flex-row gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {/* Font Family */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Font Family
                        </label>
                        <Select
                            onChange={handleFontFamilyChange}
                            value={fontFamily}
                            options={editorFonts}
                            title="Font Family"
                        />
                    </div>
                    
                    {/* Font Size */}
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Font Size
                        </label>
                        <div className="relative">
                            <select
                                value={fontSize}
                                onChange={handleFontSizeChange}
                                className="w-full rounded-2xl border border-gray-700/50 bg-gray-900/50 backdrop-blur-sm px-4 py-3 text-gray-100 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/30 transition-all duration-300 appearance-none cursor-pointer"
                                title="Font Size"
                                style={{ 
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%239CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                                    backgroundPosition: 'right 0.5rem center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: '1.5em 1.5em',
                                    paddingRight: '2.5rem'
                                }}
                            >
                                {[...Array(13).keys()].map((size) => {
                                    return (
                                        <option 
                                            key={size} 
                                            value={size + 12}
                                        >
                                            {size + 12}px
                                        </option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* Theme */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Editor Theme
                    </label>
                    <Select
                        onChange={handleThemeChange}
                        value={theme}
                        options={Object.keys(editorThemes)}
                        title="Theme"
                    />
                </motion.div>

                {/* Language */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Default Language
                    </label>
                    <Select
                        onChange={handleLanguageChange}
                        value={language}
                        options={langNames}
                        title="Language"
                    />
                </motion.div>

                {/* GitHub Corner Toggle */}
                <motion.div 
                    className="flex items-center justify-between rounded-2xl border border-gray-700/50 bg-gray-900/30 backdrop-blur-sm p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Show GitHub Corner
                        </label>
                        <p className="text-xs text-gray-400">
                            Display GitHub corner ribbon in the editor
                        </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                        <input
                            className="peer sr-only"
                            type="checkbox"
                            onChange={handleShowGitHubCornerChange}
                            checked={showGitHubCorner}
                        />
                        <div className="peer h-6 w-12 rounded-full bg-gray-700 outline-none duration-300 after:absolute after:left-1 after:top-1 after:flex after:h-4 after:w-4 after:items-center after:justify-center after:rounded-full after:bg-gray-400 after:font-bold after:outline-none after:duration-300 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-indigo-500 peer-checked:to-purple-600 peer-checked:after:translate-x-6 peer-checked:after:bg-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500/50"></div>
                    </label>
                </motion.div>
            </div>

            {/* Reset Button */}
            <motion.button
                className="flex items-center justify-center gap-2 rounded-2xl bg-gray-800/50 backdrop-blur-sm p-4 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300 border border-gray-700/30 font-medium"
                onClick={resetSettings}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
            >
                <LuRefreshCw size={18} />
                Reset to Default Settings
            </motion.button>
        </motion.div>
    )
}

export default SettingsView