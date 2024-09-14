import Network from 'resource:///com/github/Aylur/ags/service/network.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

const wifiIcon = () => Widget.Icon({
	icon: Network.wifi.bind('icon_name'),
	tooltipText: Network.wifi.bind('ssid')
});

const wiredIcon = () => Widget.Icon({
	icon: Network.wired.bind('icon_name'),
});

const networkIcon = () => Widget.Stack({
	hpack: 'center',
	children: {
		'wifi': wifiIcon(),
		'wired': wiredIcon(),
	},
	shown: Network.bind('primary').transform(p => p || 'wifi')
});

export const networkButton = () => Widget.Button({
	className: 'network',
	child: networkIcon(),
});
