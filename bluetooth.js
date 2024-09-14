import Bluetooth from 'resource:///com/github/Aylur/ags/service/bluetooth.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

export const bluetoothButton = () => Widget.Button({
	onClicked: () => {
		Bluetooth.toggle();
	},
	child: Widget.Icon({
		icon: Bluetooth.bind('enabled').as(on =>
			`bluetooth-${on ? 'active' : 'disabled'}-symbolic`)
	}),
});
