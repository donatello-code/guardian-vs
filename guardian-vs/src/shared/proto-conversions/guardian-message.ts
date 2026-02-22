import { GuardianAsk as AppGuardianAsk, GuardianMessage as AppGuardianMessage, GuardianSay as AppGuardianSay } from "@shared/ExtensionMessage"
import { GuardianAsk, GuardianMessageType, GuardianSay, GuardianMessage as ProtoGuardianMessage } from "@shared/proto/guardian/ui"

// Helper function to convert GuardianAsk string to enum
function convertGuardianAskToProtoEnum(ask: AppGuardianAsk | undefined): GuardianAsk | undefined {
	if (!ask) {
		return undefined
	}

	const mapping: Record<AppGuardianAsk, GuardianAsk> = {
		followup: GuardianAsk.FOLLOWUP,
		plan_mode_respond: GuardianAsk.PLAN_MODE_RESPOND,
		act_mode_respond: GuardianAsk.ACT_MODE_RESPOND,
		command: GuardianAsk.COMMAND,
		command_output: GuardianAsk.COMMAND_OUTPUT,
		completion_result: GuardianAsk.COMPLETION_RESULT,
		tool: GuardianAsk.TOOL,
		api_req_failed: GuardianAsk.API_REQ_FAILED,
		resume_task: GuardianAsk.RESUME_TASK,
		resume_completed_task: GuardianAsk.RESUME_COMPLETED_TASK,
		mistake_limit_reached: GuardianAsk.MISTAKE_LIMIT_REACHED,
		browser_action_launch: GuardianAsk.BROWSER_ACTION_LAUNCH,
		use_mcp_server: GuardianAsk.USE_MCP_SERVER,
		new_task: GuardianAsk.NEW_TASK,
		condense: GuardianAsk.CONDENSE,
		summarize_task: GuardianAsk.SUMMARIZE_TASK,
		report_bug: GuardianAsk.REPORT_BUG,
		use_subagents: GuardianAsk.USE_SUBAGENTS,
	}

	const result = mapping[ask]
	if (result === undefined) {
	}
	return result
}

// Helper function to convert GuardianAsk enum to string
function convertProtoEnumToGuardianAsk(ask: GuardianAsk): AppGuardianAsk | undefined {
	if (ask === GuardianAsk.UNRECOGNIZED) {
		return undefined
	}

	const mapping: Record<Exclude<GuardianAsk, GuardianAsk.UNRECOGNIZED>, AppGuardianAsk> = {
		[GuardianAsk.FOLLOWUP]: "followup",
		[GuardianAsk.PLAN_MODE_RESPOND]: "plan_mode_respond",
		[GuardianAsk.ACT_MODE_RESPOND]: "act_mode_respond",
		[GuardianAsk.COMMAND]: "command",
		[GuardianAsk.COMMAND_OUTPUT]: "command_output",
		[GuardianAsk.COMPLETION_RESULT]: "completion_result",
		[GuardianAsk.TOOL]: "tool",
		[GuardianAsk.API_REQ_FAILED]: "api_req_failed",
		[GuardianAsk.RESUME_TASK]: "resume_task",
		[GuardianAsk.RESUME_COMPLETED_TASK]: "resume_completed_task",
		[GuardianAsk.MISTAKE_LIMIT_REACHED]: "mistake_limit_reached",
		[GuardianAsk.BROWSER_ACTION_LAUNCH]: "browser_action_launch",
		[GuardianAsk.USE_MCP_SERVER]: "use_mcp_server",
		[GuardianAsk.NEW_TASK]: "new_task",
		[GuardianAsk.CONDENSE]: "condense",
		[GuardianAsk.SUMMARIZE_TASK]: "summarize_task",
		[GuardianAsk.REPORT_BUG]: "report_bug",
		[GuardianAsk.USE_SUBAGENTS]: "use_subagents",
	}

	return mapping[ask]
}

// Helper function to convert GuardianSay string to enum
function convertGuardianSayToProtoEnum(say: AppGuardianSay | undefined): GuardianSay | undefined {
	if (!say) {
		return undefined
	}

	const mapping: Record<AppGuardianSay, GuardianSay> = {
		task: GuardianSay.TASK,
		error: GuardianSay.ERROR,
		api_req_started: GuardianSay.API_REQ_STARTED,
		api_req_finished: GuardianSay.API_REQ_FINISHED,
		text: GuardianSay.TEXT,
		reasoning: GuardianSay.REASONING,
		completion_result: GuardianSay.COMPLETION_RESULT_SAY,
		user_feedback: GuardianSay.USER_FEEDBACK,
		user_feedback_diff: GuardianSay.USER_FEEDBACK_DIFF,
		api_req_retried: GuardianSay.API_REQ_RETRIED,
		command: GuardianSay.COMMAND_SAY,
		command_output: GuardianSay.COMMAND_OUTPUT_SAY,
		tool: GuardianSay.TOOL_SAY,
		shell_integration_warning: GuardianSay.SHELL_INTEGRATION_WARNING,
		shell_integration_warning_with_suggestion: GuardianSay.SHELL_INTEGRATION_WARNING,
		browser_action_launch: GuardianSay.BROWSER_ACTION_LAUNCH_SAY,
		browser_action: GuardianSay.BROWSER_ACTION,
		browser_action_result: GuardianSay.BROWSER_ACTION_RESULT,
		mcp_server_request_started: GuardianSay.MCP_SERVER_REQUEST_STARTED,
		mcp_server_response: GuardianSay.MCP_SERVER_RESPONSE,
		mcp_notification: GuardianSay.MCP_NOTIFICATION,
		use_mcp_server: GuardianSay.USE_MCP_SERVER_SAY,
		diff_error: GuardianSay.DIFF_ERROR,
		deleted_api_reqs: GuardianSay.DELETED_API_REQS,
		guardianignore_error: GuardianSay.CLINEIGNORE_ERROR,
		command_permission_denied: GuardianSay.COMMAND_PERMISSION_DENIED,
		checkpoint_created: GuardianSay.CHECKPOINT_CREATED,
		load_mcp_documentation: GuardianSay.LOAD_MCP_DOCUMENTATION,
		info: GuardianSay.INFO,
		task_progress: GuardianSay.TASK_PROGRESS,
		error_retry: GuardianSay.ERROR_RETRY,
		hook_status: GuardianSay.HOOK_STATUS,
		hook_output_stream: GuardianSay.HOOK_OUTPUT_STREAM,
		conditional_rules_applied: GuardianSay.CONDITIONAL_RULES_APPLIED,
		subagent: GuardianSay.SUBAGENT_STATUS,
		use_subagents: GuardianSay.USE_SUBAGENTS_SAY,
		subagent_usage: GuardianSay.SUBAGENT_USAGE,
		generate_explanation: GuardianSay.GENERATE_EXPLANATION,
	}

	const result = mapping[say]

	return result
}

// Helper function to convert GuardianSay enum to string
function convertProtoEnumToGuardianSay(say: GuardianSay): AppGuardianSay | undefined {
	if (say === GuardianSay.UNRECOGNIZED) {
		return undefined
	}

	const mapping: Record<Exclude<GuardianSay, GuardianSay.UNRECOGNIZED>, AppGuardianSay> = {
		[GuardianSay.TASK]: "task",
		[GuardianSay.ERROR]: "error",
		[GuardianSay.API_REQ_STARTED]: "api_req_started",
		[GuardianSay.API_REQ_FINISHED]: "api_req_finished",
		[GuardianSay.TEXT]: "text",
		[GuardianSay.REASONING]: "reasoning",
		[GuardianSay.COMPLETION_RESULT_SAY]: "completion_result",
		[GuardianSay.USER_FEEDBACK]: "user_feedback",
		[GuardianSay.USER_FEEDBACK_DIFF]: "user_feedback_diff",
		[GuardianSay.API_REQ_RETRIED]: "api_req_retried",
		[GuardianSay.COMMAND_SAY]: "command",
		[GuardianSay.COMMAND_OUTPUT_SAY]: "command_output",
		[GuardianSay.TOOL_SAY]: "tool",
		[GuardianSay.SHELL_INTEGRATION_WARNING]: "shell_integration_warning",
		[GuardianSay.BROWSER_ACTION_LAUNCH_SAY]: "browser_action_launch",
		[GuardianSay.BROWSER_ACTION]: "browser_action",
		[GuardianSay.BROWSER_ACTION_RESULT]: "browser_action_result",
		[GuardianSay.MCP_SERVER_REQUEST_STARTED]: "mcp_server_request_started",
		[GuardianSay.MCP_SERVER_RESPONSE]: "mcp_server_response",
		[GuardianSay.MCP_NOTIFICATION]: "mcp_notification",
		[GuardianSay.USE_MCP_SERVER_SAY]: "use_mcp_server",
		[GuardianSay.DIFF_ERROR]: "diff_error",
		[GuardianSay.DELETED_API_REQS]: "deleted_api_reqs",
		[GuardianSay.CLINEIGNORE_ERROR]: "guardianignore_error",
		[GuardianSay.COMMAND_PERMISSION_DENIED]: "command_permission_denied",
		[GuardianSay.CHECKPOINT_CREATED]: "checkpoint_created",
		[GuardianSay.LOAD_MCP_DOCUMENTATION]: "load_mcp_documentation",
		[GuardianSay.INFO]: "info",
		[GuardianSay.TASK_PROGRESS]: "task_progress",
		[GuardianSay.ERROR_RETRY]: "error_retry",
		[GuardianSay.GENERATE_EXPLANATION]: "generate_explanation",
		[GuardianSay.HOOK_STATUS]: "hook_status",
		[GuardianSay.HOOK_OUTPUT_STREAM]: "hook_output_stream",
		[GuardianSay.CONDITIONAL_RULES_APPLIED]: "conditional_rules_applied",
		[GuardianSay.SUBAGENT_STATUS]: "subagent",
		[GuardianSay.USE_SUBAGENTS_SAY]: "use_subagents",
		[GuardianSay.SUBAGENT_USAGE]: "subagent_usage",
	}

	return mapping[say]
}

/**
 * Convert application GuardianMessage to proto GuardianMessage
 */
export function convertGuardianMessageToProto(message: AppGuardianMessage): ProtoGuardianMessage {
	// For sending messages, we need to provide values for required proto fields
	const askEnum = message.ask ? convertGuardianAskToProtoEnum(message.ask) : undefined
	const sayEnum = message.say ? convertGuardianSayToProtoEnum(message.say) : undefined

	// Determine appropriate enum values based on message type
	let finalAskEnum: GuardianAsk = GuardianAsk.FOLLOWUP // Proto default
	let finalSayEnum: GuardianSay = GuardianSay.TEXT // Proto default

	if (message.type === "ask") {
		finalAskEnum = askEnum ?? GuardianAsk.FOLLOWUP // Use FOLLOWUP as default for ask messages
	} else if (message.type === "say") {
		finalSayEnum = sayEnum ?? GuardianSay.TEXT // Use TEXT as default for say messages
	}

	const protoMessage: ProtoGuardianMessage = {
		ts: message.ts,
		type: message.type === "ask" ? GuardianMessageType.ASK : GuardianMessageType.SAY,
		ask: finalAskEnum,
		say: finalSayEnum,
		text: message.text ?? "",
		reasoning: message.reasoning ?? "",
		images: message.images ?? [],
		files: message.files ?? [],
		partial: message.partial ?? false,
		lastCheckpointHash: message.lastCheckpointHash ?? "",
		isCheckpointCheckedOut: message.isCheckpointCheckedOut ?? false,
		isOperationOutsideWorkspace: message.isOperationOutsideWorkspace ?? false,
		conversationHistoryIndex: message.conversationHistoryIndex ?? 0,
		conversationHistoryDeletedRange: message.conversationHistoryDeletedRange
			? {
					startIndex: message.conversationHistoryDeletedRange[0],
					endIndex: message.conversationHistoryDeletedRange[1],
				}
			: undefined,
		// Additional optional fields for specific ask/say types
		sayTool: undefined,
		sayBrowserAction: undefined,
		browserActionResult: undefined,
		askUseMcpServer: undefined,
		planModeResponse: undefined,
		askQuestion: undefined,
		askNewTask: undefined,
		apiReqInfo: undefined,
		modelInfo: message.modelInfo ?? undefined,
	}

	return protoMessage
}

/**
 * Convert proto GuardianMessage to application GuardianMessage
 */
export function convertProtoToGuardianMessage(protoMessage: ProtoGuardianMessage): AppGuardianMessage {
	const message: AppGuardianMessage = {
		ts: protoMessage.ts,
		type: protoMessage.type === GuardianMessageType.ASK ? "ask" : "say",
	}

	// Convert ask enum to string
	if (protoMessage.type === GuardianMessageType.ASK) {
		const ask = convertProtoEnumToGuardianAsk(protoMessage.ask)
		if (ask !== undefined) {
			message.ask = ask
		}
	}

	// Convert say enum to string
	if (protoMessage.type === GuardianMessageType.SAY) {
		const say = convertProtoEnumToGuardianSay(protoMessage.say)
		if (say !== undefined) {
			message.say = say
		}
	}

	// Convert other fields - preserve empty strings as they may be intentional
	if (protoMessage.text !== "") {
		message.text = protoMessage.text
	}
	if (protoMessage.reasoning !== "") {
		message.reasoning = protoMessage.reasoning
	}
	if (protoMessage.images.length > 0) {
		message.images = protoMessage.images
	}
	if (protoMessage.files.length > 0) {
		message.files = protoMessage.files
	}
	if (protoMessage.partial) {
		message.partial = protoMessage.partial
	}
	if (protoMessage.lastCheckpointHash !== "") {
		message.lastCheckpointHash = protoMessage.lastCheckpointHash
	}
	if (protoMessage.isCheckpointCheckedOut) {
		message.isCheckpointCheckedOut = protoMessage.isCheckpointCheckedOut
	}
	if (protoMessage.isOperationOutsideWorkspace) {
		message.isOperationOutsideWorkspace = protoMessage.isOperationOutsideWorkspace
	}
	if (protoMessage.conversationHistoryIndex !== 0) {
		message.conversationHistoryIndex = protoMessage.conversationHistoryIndex
	}

	// Convert conversationHistoryDeletedRange from object to tuple
	if (protoMessage.conversationHistoryDeletedRange) {
		message.conversationHistoryDeletedRange = [
			protoMessage.conversationHistoryDeletedRange.startIndex,
			protoMessage.conversationHistoryDeletedRange.endIndex,
		]
	}

	return message
}
