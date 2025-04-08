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

global.AudioContext = AudioContext;
global.AudioNode = AudioNode;
global.GainNode = GainNode;