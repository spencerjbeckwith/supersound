// Makes Web Audio API stub methods available in our tests

class AudioContext {
    createMediaElementSource() {
        return new AudioNode();
    }
}

class AudioNode {
    connect() {}
    disconnect() {}
}

class GainNode extends AudioNode {};

class AudioStub extends EventTarget {
    constructor() {
        super();
        this.currentTime = 0;
    }
    cloneNode() {
        return new AudioStub();
    }
    play() {
        this.currentTime = 1;
    }
    pause() {
        this.currentTime = 0;
    }
}

global.AudioContext = AudioContext;
global.AudioNode = AudioNode;
global.GainNode = GainNode;
global.Audio = AudioStub;