import Widget from 'resource:///com/github/Aylur/ags/widget.js';

const hyprland = await Service.import("hyprland");

const focusedTitle = Widget.Label({
	label: hyprland.active.client.bind('title'),
	visible: hyprland.active.client.bind('address')
		.transform(addr => !!addr),
});

const dispatch = ws => hyprland.messageAsync(`dispatch workspace ${ws}`);
const dispatchRelative = ws => hyprland.messageAsync(`dispatch workspace ${ws >= 0 ? '+' : '-'}${ws}`);
const workspaces = (start, length) => Widget.Box({
	vertical: true,
	hpack: 'center',
	spacing: 6,
	homogeneous: true,
	children: Array.from({ length }, (_, i) => i + start + 1).map(i => Widget.Button({
		attribute: i,
		label: `${i}`,
		class_name: 'dot',
		hpack: 'center',
		onClicked: () => dispatch(i),
		setup: self => self.hook(hyprland, () => {
			self.toggleClassName('active', hyprland.active.workspace.id === i);
			self.toggleClassName('occupied', (hyprland.getWorkspace(i)?.windows || 0) > 0);
		}),
	}))
});

export default () => Widget.Button({
	class_name: 'tray',
	hpack: 'center',
	hexpand: true,
	onScrollUp: () => dispatchRelative(1),
	onScrollDown: () => dispatchRelative(-1),
	child: Widget.Stack({
		children: {
			'first': workspaces(0, 5),
			'second': workspaces(5, 5),
		},
		transition: 'slide_up_down',
		setup: self => self.hook(hyprland, () => {
			self.shown = hyprland.active.workspace.id < 6 ? 'first' : 'second';
		})

	})
});
