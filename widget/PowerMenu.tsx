import { App, Astal, Gdk, Gtk } from "astal/gtk3";

function PowerButton(props: { className: string, icon: string, callback: string | (() => void) }) {
	return <button
		className={`power-btn ${props.className}`}
		onClicked={props.callback}
	>
		<icon icon={props.icon} />
	</ button>
}

function ShutdownButton() {
	return <PowerButton
		className="shutdown-btn"
		icon="system-shutdown-symbolic"
		callback="systemctl poweroff"
	/>
}

function SuspendButton() {
	return <PowerButton
		className="suspend-btn"
		icon="system-suspend-symbolic"
		callback="systemctl suspend"
	/>
}

function HibernateButton() {
	return <PowerButton
		className="hibernate-btn"
		icon="system-hibernate-symbolic"
		callback="systemctl hibernate"
	/>
}

function LogoutButton() {
	return <PowerButton
		className="logout-btn"
		icon="system-log-out-symbolic"
		callback="logout"
	/>
}

function RebootButton() {
	return <PowerButton
		className="reboot-btn"
		icon="system-reboot-symbolic"
		callback="systemctl reboot"
	/>
}

export default function PowerMenu(gdkmonitor: Gdk.Monitor) {
	const name = "powermenu";
	const { TOP, LEFT, BOTTOM, RIGHT } = Astal.WindowAnchor;
	return <window
		visible={false}
		gdkmonitor={gdkmonitor}
		application={App}
		name={name}
		layer={Astal.Layer.TOP}
		anchor={TOP | LEFT | BOTTOM | RIGHT}
		keymode={Astal.Keymode.EXCLUSIVE}
		exclusivity={Astal.Exclusivity.IGNORE}
		onKeyPressEvent={(_, press) => {
			if (press.get_keyval()[1] === Gdk.KEY_Escape) {
				App.toggle_window(name);
			}
		}}
	>
		<box valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}>
			<ShutdownButton />
			<RebootButton />
			<SuspendButton />
			<LogoutButton />
		</box>
	</window>
}
