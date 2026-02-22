import { Empty, StringRequest } from "@shared/proto/guardian/common"
import * as vscode from "vscode"

export async function openExternal(request: StringRequest): Promise<Empty> {
	const uri = vscode.Uri.parse(request.value)
	await vscode.env.openExternal(uri) // ← Routes to local browser in remote setups!
	return Empty.create({})
}
