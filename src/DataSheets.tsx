import { motion } from 'framer-motion'

export default function DataSheets() {
  return (
    <motion.div 
      className="flex w-11/12 bg-gradient-to-r from-slate-300/75 p-5 rounded-lg"
      initial={{ opacity: 0, x: '100%'}}
      animate={{ opacity: 1, x: 0}}
      transition={{ duration: 0.5 }}
      >
      <h1 className="text-3xl">New Data Sheet</h1>
    </motion.div>
  )
}