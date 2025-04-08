import { AudioEngine } from "./AudioEngine";

export type AudioClassification = "sound" | "music";

export class AudioResource {

    /** AudioEngine that this resource will emit through */
    engine: AudioEngine;

    /** File to read audio data from */
    filename: string;

    /** Number of times this audio may be playing simultaneously */
    channels: number;

    /** If the audio should repeat when it completes */
    loop: boolean;

    /** If this audio should be treated as a sound effect or a music track */
    classification: AudioClassification;

    /**
     * The loaded audio elements, each corresponding to a channel.
     * 
     * This array remains unpopulated until the file is loaded, at which point the file is cloned to the number of specified channels.
     */
    elements: HTMLAudioElement[];

    /**
     * The audio nodes created from the HTML elements, each corresponding to a channel.
     * 
     * This array remains unpopulated until the file is loaded, at which point a node is created for each cloned HTMLMediaElement in #elements.
     */
    nodes: AudioNode[];
    
    /** Which channel most recently played */
    currentChannel: number;

    constructor(engine: AudioEngine, filename: string, options?: {
        /** 
         * Number of times this audio may be playing simultaneously.
         * 
         * If more plays are requested than channels are available, and all channels are currently plauing, then the
         * longest-running play will stop and restart from the top. More channels means the audio can play frequently
         * and overlap, at the expense of using more memory. Useful for sounds that repeat a lot in a short time and
         * are long enough to be noticable if it restarted too much.
         * 
         * Defaults to 1.
         */
        channels?: number;

        /**
         * If the audio should repeat when it completes.
         * 
         * Typically would be set to `true` for music tracks and `false` for sound effects.
         * 
         * Defaults to false.
         */
        loop?: boolean;

        /**
         * If this audio should be treated as a sound effect or a music track.
         * 
         * If not set, will be inferred based on the `loop` property, or if that is not set, will default to "sound".
         */
        classification?: AudioClassification;

    }) {
        this.engine = engine;
        this.filename = filename;
        this.channels = Math.max(1, options?.channels || 1);
        this.loop = options?.loop || false;
        this.classification = options?.classification || (this.loop ? "music" : "sound");
        this.elements = [];
        this.nodes = [];
        this.currentChannel = 0;

        this.load();
    }

    async load() {
        // Create a new HTMLAudioElement
        const audio = new Audio(this.filename);
        audio.loop = this.loop;
        audio.crossOrigin = "anonymous";
        audio.preload = "auto";
        await new Promise((resolve, reject) => {
            audio.addEventListener("canplay", resolve);
            audio.addEventListener("error", reject);
            audio.addEventListener("abort", reject);
        });

        // Loaded successfully, set up our channels (an element and node for each)
        let c = 0;
        while (c < this.channels) {
            if (c === 0) {
                this.elements[c] = audio;
            } else {
                this.elements[c] = audio.cloneNode() as HTMLAudioElement;
            }
            this.nodes[c] = this.engine.context.createMediaElementSource(this.elements[c]);
            this.nodes[c].connect(this.engine.gain[this.classification]);
            c++;
        }
    }

    /** Plays the AudioResource */
    async play() {
        try {
            const element = this.elements[this.currentChannel];
            element.currentTime = 0;
            await element.play();
            this.currentChannel++;
            if (this.currentChannel >= this.channels) {
                this.currentChannel = 0;
            }
        } catch (err) {
            console.error(`Failed to play AudioResource with filename "${this.filename}"!`);
            console.error(err);
        }
    }

    /** Stops all channels of this AudioResource */
    stop() {
        for (const element of this.elements) {
            element.pause();
            element.currentTime = 0;
        }
    }
}