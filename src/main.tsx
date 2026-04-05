import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { App } from './app.tsx';
import './index.css';
import { setUpdateChecker } from './util/update';

let hasPendingUpdate = false;
let manualCheckResolver: ((value: boolean) => void) | null = null;

const updateSW = registerSW({
	immediate: true,
	onRegisteredSW(_swUrl: string, registration?: ServiceWorkerRegistration) {
		if (!registration) {
			setUpdateChecker(null);
			return;
		}

		setUpdateChecker(async () => {
			if (hasPendingUpdate || Boolean(registration.waiting)) {
				return true;
			}

			await registration.update();

			if (hasPendingUpdate || Boolean(registration.waiting)) {
				return true;
			}

			return await new Promise(resolve => {
				manualCheckResolver = resolve;
				window.setTimeout(() => {
					if (manualCheckResolver === resolve) {
						manualCheckResolver = null;
					}

					resolve(hasPendingUpdate || Boolean(registration.waiting));
				}, 1500);
			});
		});

		window.setInterval(() => {
			registration.update();
		}, 2 * 60 * 1000);
	},
	onNeedRefresh() {
		hasPendingUpdate = true;

		if (manualCheckResolver) {
			manualCheckResolver(true);
			manualCheckResolver = null;
		}

		const shouldUpdate = window.confirm(
			'A new version of QR Scout is available. Update now?',
		);

		if (shouldUpdate) {
			updateSW(true);
		}
	},
});

if ('serviceWorker' in navigator) {
	let reloading = false;
	navigator.serviceWorker.addEventListener('controllerchange', () => {
		if (reloading) {
			return;
		}

		reloading = true;
		window.location.reload();
	});
}

const root = createRoot(document.getElementById('app')!);

root.render(<App />);
