import App from 'resource:///com/github/Aylur/ags/app.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import { execAsync } from 'resource:///com/github/Aylur/ags/utils.js';

const padding = windowName => Widget.EventBox({
	class_name: 'padding',
	hexpand: true,
	vexpand: true,
}).on("button-press-event", () => App.toggleWindow(windowName));

const backdrop = ({ name, child, width, height, ...rest }) => Widget.Window({
	name,
	class_names: ['backdrop', name],
	keymode: "on-demand",
	child: Widget.CenterBox({
		css: `min-width: ${width}px; min-height: ${height}px`,
		startWidget: padding(name),
		centerWidget: Widget.CenterBox({
			vertical: true,
			startWidget: padding(name),
			centerWidget: child,
			endWidget: padding(name),
		}),
		endWidget: padding(name)
	}),
	setup: (self) => self.keybind("Escape", () => App.closeWindow(name)),
	...rest
});

const poweroff = (windowName) => Widget.Button({
	class_names: ['poweroff-btn', 'power-btn'],
	child: Widget.Icon('system-shutdown-symbolic'),
	on_clicked: () => execAsync(['systemctl', 'poweroff'])
		.then(() => App.toggleWindow(windowName))
		.catch(console.error)
});

const reboot = (windowName) => Widget.Button({
	class_names: ['reboot-btn', 'power-btn'],
	child: Widget.Icon('system-reboot-symbolic'),
	on_clicked: () => execAsync(['systemctl', 'reboot'])
		.then(() => App.toggleWindow(windowName))
		.catch(console.error)
});

const hibernate = (windowName) => Widget.Button({
	class_names: ['hibernate-btn', 'power-btn'],
	child: Widget.Icon('system-hibernate-symbolic'),
	on_clicked: () => execAsync(['systemctl', 'hibernate'])
		.then(() => App.toggleWindow(windowName))
		.catch(console.error)
});

const suspend = (windowName) => Widget.Button({
	class_names: ['suspend-btn', 'power-btn'],
	child: Widget.Icon('system-suspend-symbolic'),
	on_clicked: () => execAsync(['systemctl', 'suspend'])
		.then(() => App.toggleWindow(windowName))
		.catch(console.error)
});

const logout = (windowName) => Widget.Button({
	class_names: ['logout-btn', 'power-btn'],
	child: Widget.Icon('system-log-out-symbolic'),
	on_clicked: () => execAsync(['logout'])
		.then(() => App.toggleWindow(windowName))
		.catch(console.error)
});

export default ({ monitor }) => {
	const name = `powermenu-${monitor}`;
	return backdrop({
		name,
		child: Widget.Box({
			class_name: 'powermenu',
			homogeneous: true,
			spacing: 32,
			children: [
				poweroff(name),
				reboot(name),
				suspend(name),
				logout(name),
			],
		}),
		width: 5000,
		height: 5000,
		visible: false,
	});
};
