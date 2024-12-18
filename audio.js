import Widget from 'resource:///com/github/Aylur/ags/widget.js';

const audio = await Service.import('audio');

export const audioPopup = () => Widget.Window({
	name: 'audioPopup',
	exclusivity: 'exclusive',
	child: Widget.Slider({
		css: "min-height: 2px; min-width: 2px;",
		value: 15,
		min: 0,
		max: 120,
	})
});

export const volumeSlider = () => Widget.Slider({
	vertical: true,
	min: 0,
	max: 100,
	value: 50,
	height_request: 50
});

export const speakerIcon = () => Widget.Button({
	className: 'audio',
	on_primary_click_release: () => audio.speaker.is_muted = !audio.speaker.is_muted,
	onScrollUp: () => audio.speaker.volume += 0.02,
	onScrollDown: () => audio.speaker.volume -= 0.02,
	child: Widget.Icon().hook(audio, self => {
		if (!audio.speaker) {
			return;
		}
		const vol = audio.speaker.volume * 100;
		const icon = audio.speaker.is_muted ?
			'muted' :
			[
				{ threshold: 101, icon: 'overamplified' },
				{ threshold: 67, icon: 'high' },
				{ threshold: 34, icon: 'medium' },
				{ threshold: 1, icon: 'low' },
				{ threshold: 0, icon: 'muted' },
			].find(({ threshold }) => threshold <= vol)?.icon ?? 'muted';


		self.icon = `audio-volume-${icon}-symbolic`;
		self.tooltip_text = `Volume ${Math.floor(vol)}%`;
	}),
});
