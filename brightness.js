import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

import Service from 'resource:///com/github/Aylur/ags/service.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js';

const writeFile = (path, data) => {
	const file = Gio.File.new_for_path(path);

    return new Promise((resolve, reject) => {
        file.replace_contents_bytes_async(
            new GLib.Bytes(new TextEncoder().encode(data)),
            null,
            false,
            Gio.FileCreateFlags.NONE,
            null,
            (_, res) => {
                try {
                    file.replace_contents_finish(res);
                    resolve(file);
                } catch (error) {
                    reject(error);
                }
            },
        );
    });
};

const readFile = (file) => {
    try {
        const f = typeof file === 'string'
            ? Gio.File.new_for_path(file)
            : file;

        const [, bytes] = f.load_contents(null);
        const data = new TextDecoder().decode(bytes);
		GLib.free(bytes);

		return data;
    } catch (_) {
        return '';
    }
}


export class Brightness extends Service {
	static {
		Service.register(this, {
			'screen-changed': ['float']
		},
		{
			'screen-raw': ['int', 'rw'],
			'screen-percent': ['float', 'rw']
		});
	}


	// The real screen brightness, differ from _screenValue during animation
	_screenCurrentValue = 0;
	
	// Target raw brightness
	_screenValue = 0;

	// One backlight only for now
	_driver = Utils.exec("sh -c 'ls -d /sys/class/backlight/* | head -1'");
	
	_max = Number(readFile(`${this._driver}/max_brightness`));
	_brightnessPath = `${this._driver}/brightness`;

	_brightnessMonitor = null;

	/// Time to change 1% of brightness, in ms
	_delay = 500; 

	constructor() {
		super();

		this._brightnessMonitor = Utils.monitorFile(this._brightnessPath, (file, ev) => {
			if(ev == Gio.FileMonitorEvent.CHANGES_DONE_HINT) {
				this._onChange();
			}
		});
		this._onChange();
	}

	get screen_raw() { return this._screenValue; }
	set screen_raw(raw) {
		const min = Math.floor(this._max * 0.1);
		if(raw > this._max) {
			raw = this._max;
		} else if (raw < min) {
			raw = min;
		}

		// Ignore no change
		if(raw == this._screenValue) {
			return;
		}

		this._screenValue = raw;
		writeFile(this._brightnessPath, `${this._screenValue}`)
			.then(() => {})
			.catch(err => console.error(err))
	}

	get screen_percent() { return (this._screenValue / this._max) * 100; }
	set screen_percent(percent) {
		const raw = Math.floor(percent * this._max / 100);
		this.screen_raw = raw;
	}

	_onChange() {
		// Unexpected brightness change (when this._screenValue == this._screenCurrentValue)
		// are probably from other application trying to override brightness and should be respected
		const override = this._screenValue == this._screenCurrentValue;

		Utils.readFileAsync(this._brightnessPath)
			.then((d) => {
				this._screenCurrentValue = Number(d)
				if(override) {
					this._screenValue = this._screenCurrentValue;
				}
				this.changed('screen-raw');
				this.changed('screen-percent');
				this.emit('screen-changed', this._screenValue);
			})
			.catch((err) => console.error(err));
	}

	connect(event = 'screen-changed', callback) {
		return super.connect(event, callback);
	}
}

export default new Brightness();
