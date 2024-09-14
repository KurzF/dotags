import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import App from 'resource:///com/github/Aylur/ags/app.js';
import Variable from 'resource:///com/github/Aylur/ags/variable.js';
import { interval, execAsync } from 'resource:///com/github/Aylur/ags/utils.js';
import Powermenu from './powermenu.js';

import { speakerIcon } from './audio.js';
import { batteryButton } from './battery.js';
import { bluetoothButton } from './bluetooth.js';
import { networkButton } from './network.js';
import Brightness from './brightness.js';

import SystemTray from 'resource:///com/github/Aylur/ags/service/systemtray.js';
import Workspaces from './workspace.js';

const time = Variable({
	hour: "00",
	minute: "00",
});

interval(1000, () => {
	execAsync(['date', '+%H %M'])
		.then(date => {
			const parse = date.split(' ');
			time.value = {
				hour: parse[0],
				minute: parse[1],
			};
		}).catch(console.error);
});

const clock = () => Widget.Button({
	child: Widget.Box({
		className: "clock",
		vertical: true,
		vpack: 'end',
		children: [
			Widget.Label({
				label: time.bind().as(time => `${time.hour}`)
			}),
			Widget.Label({
				label: time.bind().as(time => `${time.minute}`)
			})
		]
	}),
});

const launcher = () => Widget.Button({
	className: 'launcher',
	onClicked: () => execAsync('rofi -show drun'),
	child: Widget.Icon('start-here-symbolic')
});

const powerbutton = () => Widget.Button({
	className: 'powerbutton',
	child: Widget.Icon('system-shutdown-symbolic'),
	on_clicked: () => App.openWindow('powermenu-0'),
});

const preference = () => Widget.Button({
	className: 'preference',
	child: Widget.Icon('preferences-system-symbolic'),
});

const brightness = () => Widget.Button({
	className: 'brightness',
	onClicked: () => Brightness.screen_percent = 100.0,
	onScrollUp: () => Brightness.screen_percent += 5.0,
	onScrollDown: () => Brightness.screen_percent -= 5.0,
	child: Widget.Icon({
		icon: Brightness.bind('screen_percent').transform(p => {
			const icon = [
				{ threshold: 90, icon: 'high' },
				{ threshold: 60, icon: 'medium' },
				{ threshold: 30, icon: 'low' },
				{ threshold: 0, icon: 'off' },
			].find(({ threshold }) => threshold <= p)?.icon ?? 'off';

			return `display-brightness-${icon}-symbolic`;
		}),
		tooltipText: Brightness.bind('screen_percent').transform(p => `${Math.round(p)}%`),
	}),
});

const settingsTray = () => Widget.Box({
	class_name: "tray",
	spacing: 12,
	homogeneous: true,
	vertical: true,
	children: [
		preference(),
		bluetoothButton(),
		batteryButton(),
		networkButton(),
		brightness(),
		speakerIcon(),
	],
});

const SysTrayItem = item => Widget.Button({
	child: Widget.Icon({
		icon: item.bind("icon"),
		tooltipMarkup: item.bind('tooltip-markup'),
	}),
	onPrimaryClick: (_, event) => item.activate(event),
	onSecondaryClick: (_, event) => item.openMenu(event),
});

const systemTray = () => Widget.Box().hook(SystemTray, (self) => {
	self.spacing = 12,
		self.class_name = "tray",
		self.vertical = true,
		self.children = SystemTray.items.map(SysTrayItem);
	self.visible = SystemTray.items.length > 0;
});

const startWidget = () => Widget.Box({
	vertical: true,
	vpack: 'start',
	children: [launcher(), Workspaces()],
});

const endWidget = () => Widget.Box({
	vertical: true,
	vpack: 'end',
	children: [systemTray(), settingsTray(), clock(), powerbutton()],
});

const bar = (monitor) => Widget.Window({
	name: `bar-${monitor}`,
	monitor,
	className: 'bar',
	anchor: ['left', 'top', 'bottom'],
	exclusivity: 'exclusive',
	vexpand: true,
	child: Widget.CenterBox({
		vertical: true,
		start_widget: startWidget(),
		end_widget: endWidget(),
	}),
});

App.config({
	style: './style.css',
	windows: [bar(0), bar(1), Powermenu({ monitor: 0 })]
});

