import Battery from 'resource:///com/github/Aylur/ags/service/battery.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

export const batteryButton = () => Widget.Button({
	child: Widget.Icon().hook(Battery, self => {
		self.icon = Battery.icon_name;
		self.visible = Battery.available;
		self.tooltip_text = `${Battery.percent}%`;
		self.class_name = 'battery',
			self.toggleClassName('charging', Battery.charging);
		self.toggleClassName('charged', Battery.charged);
		self.toggleClassName('full', Battery.percent > 75);
		self.toggleClassName('alert', Battery.percent < 25);
	}),
});
