import { ModelFamily } from "@/shared/prompts"
import { GuardianDefaultTool } from "@/shared/tools"
import type { GuardianToolSpec } from "../spec"

// HACK: Placeholder to act as tool dependency
const generic: GuardianToolSpec = {
	variant: ModelFamily.GENERIC,
	id: GuardianDefaultTool.TODO,
	name: "focus_chain",
	description: "",
	contextRequirements: (context) => context.focusChainSettings?.enabled === true,
}

export const focus_chain_variants = [generic]
