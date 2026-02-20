import React from "react"
import { useExtensionState } from "@/context/ExtensionStateContext"
import { EmptyRequest } from "@shared/proto/cline/common"
import { StateServiceClient } from "@/services/grpc-client"

interface QueueDisplayProps {
	onClearQueue?: () => void
	onRemoveItem?: (index: number) => void
}

/**
 * Simple queue display component showing queued prompts
 */
export const QueueDisplay: React.FC<QueueDisplayProps> = ({ onClearQueue, onRemoveItem }) => {
	const state = useExtensionState()
	const queuedPrompts = state?.queuedPrompts || []

	if (queuedPrompts.length === 0) {
		return null
	}

	const handleClearQueue = async () => {
		try {
			await StateServiceClient.clearQueue(EmptyRequest.create({}))
			onClearQueue?.()
		} catch (error) {
			console.error("Failed to clear queue:", error)
		}
	}

	const handleRemoveItem = async (index: number) => {
		try {
			// In a real implementation, we would need to get the item ID
			// For now, we'll just call removeFromQueue with a dummy ID
			// await StateServiceClient.removeFromQueue(RemoveFromQueueRequest.create({ id: `queue-item-${index}` }))
			onRemoveItem?.(index)
		} catch (error) {
			console.error("Failed to remove item from queue:", error)
		}
	}

	return (
		<div className="queue-display border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-3">
			<div className="flex items-center justify-between mb-2">
				<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
					Queue ({queuedPrompts.length} item{queuedPrompts.length !== 1 ? "s" : ""})
				</h3>
				{queuedPrompts.length > 0 && (
					<button
						onClick={handleClearQueue}
						className="text-xs text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
					>
						Clear All
					</button>
				)}
			</div>
			<div className="space-y-2 max-h-40 overflow-y-auto">
				{queuedPrompts.map((prompt: string, index: number) => (
					<div
						key={index}
						className="flex items-start justify-between p-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
					>
						<div className="flex-1 min-w-0">
							<div className="flex items-center mb-1">
								<span className="text-xs font-medium text-gray-500 dark:text-gray-400 mr-2">
									#{index + 1}
								</span>
								<span className="text-xs text-gray-500 dark:text-gray-400">
									{index === 0 ? "Next" : "Queued"}
								</span>
							</div>
							<p className="text-sm text-gray-800 dark:text-gray-200 truncate">
								{prompt.length > 80 ? `${prompt.substring(0, 80)}...` : prompt}
							</p>
						</div>
						<button
							onClick={() => handleRemoveItem(index)}
							className="ml-2 text-xs text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
							title="Remove from queue"
						>
							×
						</button>
					</div>
				))}
			</div>
		</div>
	)
}