import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

const focusedTitle = Widget.Label({
	label: Hyprland.active.client.bind('title'),
	visible: Hyprland.active.client.bind('address')
		.transform(addr => !!addr),
});

const dispatch = ws => Hyprland.messageAsync(`dispatch workspace ${ws}`);
const dispatchRelative = ws => Hyprland.messageAsync(`dispatch workspace ${ws >= 0 ? '+' : '-'}${ws}`);
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
		setup: self => self.hook(Hyprland, () => {
			self.toggleClassName('active', Hyprland.active.workspace.id === i);
			self.toggleClassName('occupied', (Hyprland.getWorkspace(i)?.windows || 0) > 0);
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
		setup: self => self.hook(Hyprland, () => {
			self.shown = Hyprland.active.workspace.id < 6 ? 'first' : 'second';
		})

	})
});
