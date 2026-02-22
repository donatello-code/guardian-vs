import { Tool as AnthropicTool } from "@anthropic-ai/sdk/resources/index"
import { FunctionDeclaration as GoogleTool } from "@google/genai"
import { ChatCompletionTool as OpenAITool } from "openai/resources/chat/completions"

export type GuardianTool = OpenAITool | AnthropicTool | GoogleTool

// Define available tool ids
export enum GuardianDefaultTool {
	ASK = "ask_followup_question",
	ATTEMPT = "attempt_completion",
	BASH = "execute_command",
	FILE_EDIT = "replace_in_file",
	FILE_READ = "read_file",
	FILE_NEW = "write_to_file",
	SEARCH = "search_files",
	LIST_FILES = "list_files",
	LIST_CODE_DEF = "list_code_definition_names",
	BROWSER = "browser_action",
	MCP_USE = "use_mcp_tool",
	MCP_ACCESS = "access_mcp_resource",
	MCP_DOCS = "load_mcp_documentation",
	NEW_TASK = "new_task",
	PLAN_MODE = "plan_mode_respond",
	ACT_MODE = "act_mode_respond",
	TODO = "focus_chain",
	WEB_FETCH = "web_fetch",
	WEB_SEARCH = "web_search",
	CONDENSE = "condense",
	SUMMARIZE_TASK = "summarize_task",
	REPORT_BUG = "report_bug",
	NEW_RULE = "new_rule",
	APPLY_PATCH = "apply_patch",
	GENERATE_EXPLANATION = "generate_explanation",
	USE_SKILL = "use_skill",
	USE_SUBAGENTS = "use_subagents",
}

// Array of all tool names for compatibility
// Automatically generated from the enum values
export const toolUseNames = Object.values(GuardianDefaultTool) as GuardianDefaultTool[]

// Tools that are safe to run in parallel with the initial checkpoint commit
// These are tools that do not modify the workspace state
export const READ_ONLY_TOOLS = [
	GuardianDefaultTool.LIST_FILES,
	GuardianDefaultTool.FILE_READ,
	GuardianDefaultTool.SEARCH,
	GuardianDefaultTool.LIST_CODE_DEF,
	GuardianDefaultTool.BROWSER,
	GuardianDefaultTool.ASK,
	GuardianDefaultTool.WEB_SEARCH,
	GuardianDefaultTool.WEB_FETCH,
	GuardianDefaultTool.USE_SKILL,
	GuardianDefaultTool.USE_SUBAGENTS,
] as const
