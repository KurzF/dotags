import { App } from "astal/gtk3"
import style from "./style.scss"
import Bar from "./widget/Bar"
import PowerMenu from "./widget/PowerMenu"
import NotificationPopups from "./widget/notification/NotificationPopups";

const windows = [
	Bar,
	PowerMenu,
	NotificationPopups
];

App.start({
	css: style,
	main() {
		windows.map(w => App.get_monitors().map(w));
	},
})
