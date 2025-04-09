import { AudioResource } from "./AudioResource";

/** Central engine to control gain and other effects for a series of AudioResources over time */
export class AudioEngine {

    /** Base AudioContext this engine is connected to */
    context: AudioContext;

    /** Gain nodes that can be configured to adjust volume settings */
    gain: {
        /** Controls gain of all audio: both sound effects and music tracks */
        main: GainNode;

        /** Controls gain of sound effects only */
        sound: GainNode;

        /** Controls gain of music tracks only */
        music: GainNode;
    };

    constructor() {
        this.context = new AudioContext();
        this.gain = {
            main: new GainNode(this.context),
            sound: new GainNode(this.context),
            music: new GainNode(this.context),
        };

        this.gain.main.connect(this.context.destination);
        this.gain.sound.connect(this.gain.main);
        this.gain.music.connect(this.gain.main);
    }

    connect(resource: AudioResource) {
        // TODO
        // Connect the resource's node to the correct GainNode
    }

    // TODO functions that handle fading music out, setting gain, and other kinds of effects?
}