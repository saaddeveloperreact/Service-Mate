import React from 'react'
import { motion } from 'framer-motion'
import { Clock, CheckCircle2, XCircle, PlayCircle, Ban, AlertCircle } from 'lucide-react'

const cfg = {
  pending:       { label:'Pending',     cls:'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800', Icon:Clock         },
  accepted:      { label:'Accepted',    cls:'bg-blue-100   dark:bg-blue-900/30   text-blue-700   dark:text-blue-400   border-blue-200   dark:border-blue-800',   Icon:CheckCircle2  },
  rejected:      { label:'Rejected',    cls:'bg-red-100    dark:bg-red-900/30    text-red-700    dark:text-red-400    border-red-200    dark:border-red-800',    Icon:XCircle       },
  'in-progress': { label:'In Progress', cls:'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800', Icon:PlayCircle    },
  completed:     { label:'Completed',   cls:'bg-green-100  dark:bg-green-900/30  text-green-700  dark:text-green-400  border-green-200  dark:border-green-800',  Icon:CheckCircle2  },
  cancelled:     { label:'Cancelled',   cls:'bg-gray-100   dark:bg-gray-800      text-gray-500   dark:text-gray-400   border-gray-200   dark:border-gray-700',   Icon:Ban           },
}

export default function StatusBadge({ status }) {
  const { label, cls, Icon } = cfg[status] || { label:status, cls:'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700', Icon:AlertCircle }
  return (
    <motion.span initial={{ scale:0.8, opacity:0 }} animate={{ scale:1, opacity:1 }}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      <Icon className="w-3 h-3" />{label}
    </motion.span>
  )
}
