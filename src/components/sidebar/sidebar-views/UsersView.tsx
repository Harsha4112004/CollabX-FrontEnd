import Users from "@/components/common/Users"
import { useAppContext } from "@/context/AppContext"
import { useSocket } from "@/context/SocketContext"
import useResponsive from "@/hooks/useResponsive"
import { USER_STATUS } from "@/types/user"
import toast from "react-hot-toast"
import { GoSignOut } from "react-icons/go"
import { IoShareOutline } from "react-icons/io5"
import { LuCopy, LuUsers } from "react-icons/lu"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"

function UsersView() {
    const navigate = useNavigate()
    const { viewHeight } = useResponsive()
    const { setStatus } = useAppContext()
    const { socket } = useSocket()

    const copyURL = async () => {
        const url = window.location.href
        try {
            await navigator.clipboard.writeText(url)
            toast.success("URL copied to clipboard")
        } catch (error) {
            toast.error("Unable to copy URL to clipboard")
            console.log(error)
        }
    }

    const shareURL = async () => {
        const url = window.location.href
        try {
            await navigator.share({ url })
        } catch (error) {
            toast.error("Unable to share URL")
            console.log(error)
        }
    }

    const leaveRoom = () => {
        socket.disconnect()
        setStatus(USER_STATUS.DISCONNECTED)
        navigate("/dashboard", {
            replace: true,
        })
    }

    return (
        <motion.div 
            className="flex flex-col p-6 gap-6"
            style={{ height: viewHeight }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <LuUsers size={20} className="text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    Connected Users
                </h1>
            </div>

            {/* Users List */}
            <div className="flex-grow overflow-hidden">
                <Users />
            </div>

            {/* Action Buttons */}
            <motion.div 
                className="flex flex-col gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
            >
                <div className="flex gap-3">
                    {/* Share URL button */}
                    <motion.button
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gray-800/50 backdrop-blur-sm p-4 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300 border border-gray-700/30"
                        onClick={shareURL}
                        title="Share Link"
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <IoShareOutline size={20} />
                        <span className="font-medium">Share</span>
                    </motion.button>

                    {/* Copy URL button */}
                    <motion.button
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gray-800/50 backdrop-blur-sm p-4 text-gray-300 hover:text-white hover:bg-gray-700/50 transition-all duration-300 border border-gray-700/30"
                        onClick={copyURL}
                        title="Copy Link"
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <LuCopy size={18} />
                        <span className="font-medium">Copy</span>
                    </motion.button>

                    {/* Leave room button */}
                    <motion.button
                        className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 p-4 text-white shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
                        onClick={leaveRoom}
                        title="Leave room"
                        whileHover={{ scale: 1.02, y: -1 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <GoSignOut size={18} />
                        <span className="font-medium">Leave</span>
                    </motion.button>
                </div>

                {/* Room Info */}
                <motion.div 
                    className="rounded-2xl border border-gray-700/50 bg-gray-900/30 backdrop-blur-sm p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <p className="text-sm text-gray-400 text-center">
                        Share this room URL with others to collaborate
                    </p>
                </motion.div>
            </motion.div>
        </motion.div>
    )
}

export default UsersView