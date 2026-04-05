let updateChecker: (() => Promise<boolean>) | null = null;

export function setUpdateChecker(checker: (() => Promise<boolean>) | null) {
	updateChecker = checker;
}

export async function checkForUpdate() {
	if (!updateChecker) {
		window.alert('Update checking is not available right now.');
		return;
	}

	const hasUpdate = await updateChecker();

	if (!hasUpdate) {
		window.alert('No update available.');
	}
}