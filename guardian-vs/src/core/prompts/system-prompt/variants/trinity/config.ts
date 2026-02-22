import { isTrinityModelFamily } from "@utils/model-utils"
import { ModelFamily } from "@/shared/prompts"
import { Logger } from "@/shared/services/Logger"
import { GuardianDefaultTool } from "@/shared/tools"
import { SystemPromptSection } from "../../templates/placeholders"
import { createVariant } from "../variant-builder"
import { validateVariant } from "../variant-validator"
import { trinityComponentOverrides } from "./overrides"
import { baseTemplate } from "./template"

export const config = createVariant(ModelFamily.TRINITY)
	.description(
		"Prompt optimized for Trinity models with tool-use optimizations (explicit ask_followup_question question parameter, anti-looping reminder).",
	)
	.version(1)
	.tags("trinity", "stable")
	.labels({
		stable: 1,
		production: 1,
	})
	.matcher((context) => {
		return isTrinityModelFamily(context.providerInfo.model.id)
	})
	.template(baseTemplate)
	.components(
		SystemPromptSection.AGENT_ROLE,
		SystemPromptSection.TOOL_USE,
		SystemPromptSection.TASK_PROGRESS,
		SystemPromptSection.MCP,
		SystemPromptSection.EDITING_FILES,
		SystemPromptSection.ACT_VS_PLAN,
		SystemPromptSection.CAPABILITIES,
		SystemPromptSection.RULES,
		SystemPromptSection.SYSTEM_INFO,
		SystemPromptSection.OBJECTIVE,
		SystemPromptSection.USER_INSTRUCTIONS,
		SystemPromptSection.SKILLS,
	)
	.tools(
		GuardianDefaultTool.BASH,
		GuardianDefaultTool.FILE_READ,
		GuardianDefaultTool.FILE_NEW,
		GuardianDefaultTool.FILE_EDIT,
		GuardianDefaultTool.SEARCH,
		GuardianDefaultTool.LIST_FILES,
		GuardianDefaultTool.LIST_CODE_DEF,
		GuardianDefaultTool.BROWSER,
		GuardianDefaultTool.MCP_USE,
		GuardianDefaultTool.MCP_ACCESS,
		GuardianDefaultTool.ASK,
		GuardianDefaultTool.ATTEMPT,
		GuardianDefaultTool.PLAN_MODE,
		GuardianDefaultTool.MCP_DOCS,
		GuardianDefaultTool.TODO,
		GuardianDefaultTool.GENERATE_EXPLANATION,
		GuardianDefaultTool.USE_SKILL,
		GuardianDefaultTool.USE_SUBAGENTS,
	)
	.placeholders({
		MODEL_FAMILY: ModelFamily.TRINITY,
	})
	.config({})
	.overrideComponent(SystemPromptSection.TOOL_USE, trinityComponentOverrides[SystemPromptSection.TOOL_USE]!)
	.overrideComponent(SystemPromptSection.RULES, trinityComponentOverrides[SystemPromptSection.RULES]!)
	.build()

// Compile-time validation
const validationResult = validateVariant({ ...config, id: "trinity" }, { strict: true })
if (!validationResult.isValid) {
	Logger.error("Trinity variant configuration validation failed:", validationResult.errors)
	throw new Error(`Invalid Trinity variant configuration: ${validationResult.errors.join(", ")}`)
}

if (validationResult.warnings.length > 0) {
	Logger.warn("Trinity variant configuration warnings:", validationResult.warnings)
}

export type TrinityVariantConfig = typeof config
