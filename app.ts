import { App } from "astal/gtk3"
import style from "./style.scss"
import Bar from "./widget/Bar"
import PowerMenu from "./widget/PowerMenu"

const windows = [
	Bar,
	PowerMenu
];

App.start({
	css: style,
	main() {
		windows.map(w => App.get_monitors().map(w));
	},
})
