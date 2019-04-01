import { h, render, Component } from 'preact';
import { algoMap, inverseColor } from './lib';

class Main extends Component {
    constructor() {
        super();

        this.state = {
            time: new Date(),
            algorithm: Object.keys(algoMap)[0],
            backgroundColor: '#000',
            inverseColor: '#000',
            textColor: '#000',
            colorName: 'black',
            textShadow: 'none',
            updateInterval: 3000,
            showMenu: false
        };

        this.displayMenu = this.displayMenu.bind(this);
        this.hideMenu = this.hideMenu.bind(this);
        this.onAlgoChange = this.onAlgoChange.bind(this);

        setTimeout(() => {
            this.update();
        }, 100);
    }

    componentDidMount() {
        this.clockTimer = setInterval(() => {
            this.setState({ time: new Date() });
        }, 1000);
    }

    update() {
        let colorInfo = algoMap[this.state.algorithm]();
        let inverseCol = inverseColor(colorInfo.r, colorInfo.g, colorInfo.b);
        let backgroundColor = colorInfo.hex;
        let colorName = colorInfo.name;
        let textColor = `rgb(${inverseCol.r},${inverseCol.g},${inverseCol.b})`;
        let textShadow = null;
        if (colorInfo.hsl[2] < 128) {
            // dark background, so light shadow
            textShadow = '0 2px 1px white';
            textShadow = '0 1px 0px white';
        } else {
            // ligh background, so dark shadow
            textShadow = '0 2px 1px black';
            textShadow = '0 1px 0px black';
        }

        this.setState({
            backgroundColor,
            inverseColor,
            textColor,
            colorName,
            textShadow
        });
        // refresh every n seconds (can be set by the user);
        if (this.updateTimer) {
            clearTimeout(this.updateTimer);
        }
        this.updateTimer = setTimeout(() => this.update(), this.state.updateInterval);
    }

    displayMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ showMenu: true });
    }

    hideMenu(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({ showMenu: false });
    }

    onAlgoChange(e) {
        this.setState({ algorithm: e.target.value }, () => this.update());
    }

    toggleFullscreen(e) {
        e.stopPropagation();
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            if (document.fullscreenEnabled) {
                document.body.requestFullscreen();
            }
        }
    }

    componentWillUnmount() {
        clearInterval(this.clockTimer);
    }

    render(
        {},
        { updateInterval, backgroundColor, inverseColor, textColor, colorName, textShadow, time, showMenu, algorithm }
    ) {
        let timeStr = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(
            2,
            '0'
        )}:${String(time.getSeconds()).padStart(2, '0')}`;
        let algoItems = Object.keys(algoMap).map(key => {
            return (
                <option value={key} key={key}>
                    {algoMap[key].description}
                </option>
            );
        });

        return (
            <div id="main" style={{ backgroundColor }} onClick={this.displayMenu}>
                <div id="time" style={{ color: textColor, textShadow }}>
                    {timeStr}
                </div>
                <div id="name" style={{ color: textColor, textShadow }}>
                    {colorName}
                    <br />
                    {backgroundColor}
                </div>
                <div id="settings-container" class={showMenu ? 'on' : ''} onClick={this.hideMenu}>
                    <div id="settings" onClick={e => e.stopPropagation()}>
                        <div style="display:flex;align-items:center;flex-direction:row;justify-content:space-between">
                            <span style="padding: 5px;font-size:0.7rem;">
                                colorclock by <a href="https://alexi.ch/">alexi.ch</a>
                            </span>
                            <a
                                href="#"
                                onClick={this.hideMenu}
                                style="width:20px;height:20px;display:block;text-align:center;margin:5px;padding:5px;border-radius:50%;border:2px solid black;font-family:'Oxygen Mono';text-decoration:none;color:black"
                            >
                                X
                            </a>
                        </div>
                        <div class="settings-form" style="flex-grow: 1">
                            <div>
                                <label>
                                    Color Algorithm
                                    <select value={algorithm} onChange={this.onAlgoChange}>
                                        {algoItems}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label>
                                    Update interval [s]
                                    <input
                                        type="number"
                                        min="1"
                                        value={updateInterval / 1000}
                                        onChange={e => this.setState({ updateInterval: Number(e.target.value) * 1000 })}
                                    />
                                </label>
                            </div>
                            <div>
                                <button type="button" onClick={this.toggleFullscreen}>
                                    toggle Fullscreen
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

render(<Main />, document.body);
