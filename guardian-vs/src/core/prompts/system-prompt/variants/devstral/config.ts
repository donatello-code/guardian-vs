import { ModelFamily } from "@/shared/prompts"
import { Logger } from "@/shared/services/Logger"
import { GuardianDefaultTool } from "@/shared/tools"
import { isDevstralModelFamily } from "@/utils/model-utils"
import { SystemPromptSection } from "../../templates/placeholders"
import { createVariant } from "../variant-builder"
import { validateVariant } from "../variant-validator"
import { DEVSTRAL_AGENT_ROLE_TEMPLATE } from "./overrides"
import { baseTemplate } from "./template"

export const config = createVariant(ModelFamily.DEVSTRAL)
	.description("Baseline prompt for Devstral family models")
	.version(1)
	.tags("devstral", "stable")
	.labels({
		stable: 1,
		production: 1,
	})
	.matcher((context) => {
		return isDevstralModelFamily(context.providerInfo.model.id)
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
		GuardianDefaultTool.WEB_FETCH,
		GuardianDefaultTool.WEB_SEARCH,
		GuardianDefaultTool.MCP_USE,
		GuardianDefaultTool.MCP_ACCESS,
		GuardianDefaultTool.ASK,
		GuardianDefaultTool.ATTEMPT,
		GuardianDefaultTool.PLAN_MODE,
		GuardianDefaultTool.MCP_DOCS,
		GuardianDefaultTool.TODO,
		GuardianDefaultTool.USE_SKILL,
		GuardianDefaultTool.USE_SUBAGENTS,
	)
	.placeholders({
		MODEL_FAMILY: "devstral",
	})
	.config({})
	.overrideComponent(SystemPromptSection.AGENT_ROLE, {
		template: DEVSTRAL_AGENT_ROLE_TEMPLATE,
	})
	.build()

// Compile-time validation
const validationResult = validateVariant({ ...config, id: "devstral" }, { strict: true })
if (!validationResult.isValid) {
	Logger.error("Devstral variant configuration validation failed:", validationResult.errors)
	throw new Error(`Invalid Devstral variant configuration: ${validationResult.errors.join(", ")}`)
}

if (validationResult.warnings.length > 0) {
	Logger.warn("Devstral variant configuration warnings:", validationResult.warnings)
}

// Export type information for better IDE support
export type DevstralVariantConfig = typeof config
