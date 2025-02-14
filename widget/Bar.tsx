import { App, Astal, Gtk, Gdk } from "astal/gtk3"
import { bind, GLib, Variable } from "astal"
import Network from "gi://AstalNetwork"
import Wp from "gi://AstalWp"
import Mpris from "gi://AstalMpris"
import Hyprland from "gi://AstalHyprland"
import Tray from "gi://AstalTray"

const TIME = Variable<GLib.DateTime>(GLib.DateTime.new_now_local()).poll(1000, () => GLib.DateTime.new_now_local())

function LauncherButton(): JSX.Element {
	return <button className="launcher" onClicked="rofi -show drun">
		<icon icon="start-here-symbolic" />
	</button>
}

function Workspace({ ws }: { ws: Hyprland.Workspace }) {
	const hypr = Hyprland.get_default();
	const classNames = bind(hypr, "focusedWorkspace").as(fws => {
		let classes = "workspace";

		if (fws.id === ws.id) {
			classes = classes.concat(" focused");
		}
		if (hypr.get_workspace(ws.id)?.clients.length > 0) {
			classes = classes.concat(" occupied");
		}
		return classes;
	});
	return <button
		className={classNames}
		onClicked={() => ws.focus()} valign={Gtk.Align.CENTER}
	>
		{ws.id}
	</button>
}

function Workspaces(): JSX.Element {
	const hypr = Hyprland.get_default();

	return <box vertical className="tray">
		{Array.from({ length: 6 }, (_, key) => key).map((_, i) => (
			<Workspace ws={Hyprland.Workspace.dummy(i + 1, null)} />
		))}
	</box>
}

function SysTray() {
	const tray = Tray.get_default()

	return <box
		className="SysTray tray"
		vertical
		visible={bind(tray, "items").as(items => items.length > 0)}>
		{bind(tray, "items").as(items => items.map(item => (
			<menubutton
				direction={Gtk.ArrowType.RIGHT}
				tooltipMarkup={bind(item, "tooltipMarkup")}
				usePopover={false}
				//actionGroup={bind(item, "actionGroup").as(ag => ["dbusmenu", ag])}
				menuModel={bind(item, "menuModel")}>
				<icon gicon={bind(item, "gicon")} />
			</menubutton>
		)))}
	</box>
}

function Wifi(): JSX.Element {
	const network = Network.get_default();
	const wifi = bind(network, "wifi");
	return <button className="network" visible={wifi.as(Boolean)}>
		{wifi.as(wifi => wifi && (
			<icon
				tooltipText={bind(wifi, "ssid").as(String)}
				icon={bind(wifi, "iconName")}
			/>
		))}
	</button>
}

function Audio(): JSX.Element {
	const speaker = Wp.get_default()?.audio.defaultSpeaker!;

	return <button className="audio">
		<icon
			tooltipText={bind(speaker, "volume").as(v => `Volume ${(v * 100).toFixed(0)}%`)}
			icon={bind(speaker, "volumeIcon")}
		/>
	</button>
}

function SettingsTray(): JSX.Element {
	const settings: JSX.Element[] = [
		Wifi(),
		Audio(),
	];
	return <box vertical homogeneous spacing={12} className="tray">
		{settings.map(s => {
			return s;
		})}
	</box >

}

function Clock(): JSX.Element {
	return <box
		className="clock"
		halign={Gtk.Align.CENTER}
		vertical>
		<label label={TIME(t => t.format('%H')!)} />
		<label label={TIME(t => t.format('%M')!)} />
	</box>
}

function PowerButton(): JSX.Element {
	return <button className="powerbutton" onClicked={() => App.toggle_window("powermenu")}>
		<icon icon='system-shutdown-symbolic' />
	</button>
}

export default function Bar(gdkmonitor: Gdk.Monitor) {
	const { TOP, LEFT, BOTTOM } = Astal.WindowAnchor

	return <window
		className="Bar"
		gdkmonitor={gdkmonitor}
		exclusivity={Astal.Exclusivity.EXCLUSIVE}
		anchor={TOP | LEFT | BOTTOM}
		application={App}>
		<centerbox vertical>
			<box vertical valign={Gtk.Align.START}>
				<LauncherButton />
				<Workspaces />
			</box>
			<box />
			<box vertical valign={Gtk.Align.END}>
				<SysTray />
				<SettingsTray />
				<Clock />
				<PowerButton />
			</box>
		</centerbox>
	</window>
}
