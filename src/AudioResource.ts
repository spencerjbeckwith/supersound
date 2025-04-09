/** Basic parent class of other types of sounds */
export class AudioResource {

    /** The element that plays when this AudioResource plays */
    element: HTMLAudioElement;

    /** The node from this resource that should connect to the appropriate node in the AudioEngine or another audio context */
    node: AudioNode;

    constructor(context: AudioContext, src: string) {
        // Create a new HTMLAudioElement
        this.element = new Audio(src);
        this.node = context.createMediaElementSource(this.element);

        // Loading will complete at some point asynchronously after an instance is created.
    }

    /** Plays the AudioResource */
    play() {
        this.element.currentTime = 0;
        this.element.play();
    }

    /** Stops all channels of this AudioResource */
    stop() {
        this.element.currentTime = 0;
        this.element.pause();
    }
}