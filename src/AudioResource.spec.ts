import { AudioEngine } from "./AudioEngine";
import { AudioResource } from "./AudioResource";
import expect from "expect";
import sinon from "sinon";

const wait = (time = 1) => new Promise((r) => setTimeout(r, time));

describe("AudioResource", () => {

    class AudioStub extends EventTarget {
        currentTime: number;
        constructor() {
            super();
            this.currentTime = 0;
            wait().then(() => this.dispatchEvent(new Event("canplay")));
        }
        cloneNode() {
            return new AudioStub();
        }
        play() {
            this.currentTime = 1;
        }
        pause() {}
    }
    // @ts-ignore
    globalThis.Audio = AudioStub;

    const ae = new AudioEngine();

    it("initializes with the provided options and no elements or nodes", () => {
        const r = new AudioResource(ae, "file", {
            channels: 5,
            loop: true,
            classification: "sound",
        });
        expect(r.engine).toBe(ae);
        expect(r.filename).toBe("file");
        expect(r.channels).toBe(5);
        expect(r.loop).toBe(true);
        expect(r.classification).toBe("sound");
        expect(r.elements.length).toBe(0);
        expect(r.nodes.length).toBe(0);
    });

    it("defaults to 1 channel", () => {
        const r = new AudioResource(ae, "");
        expect(r.channels).toBe(1);
    });

    it("defaults looping to false", () => {
        const r = new AudioResource(ae, "");
        expect(r.loop).toBe(false);
    });

    it("defaults classification to 'sound'", () => {
        const r = new AudioResource(ae, "");
        expect(r.classification).toBe("sound");
    });

    it("defaults looping audio classification to 'music'", () => {
        const r = new AudioResource(ae, "", {
            loop: true,
        });
        expect(r.classification).toBe("music");
    });

    it("initializes HTMLAudioElements and AudioNodes when loaded", async () => {
        const r = new AudioResource(ae, "", {
            channels: 3,
        });
        await wait();
        expect(r.elements.length).toBe(3);
        expect(r.nodes.length).toBe(3);
        for (const element of r.elements) {
            expect(element).toBeInstanceOf(AudioStub); // would be HTMLAudioNode in practice
        }
        for (const node of r.nodes) {
            expect(node).toBeInstanceOf(AudioNode);
        }
    });

    it("prints an error if a sound is played before it is loaded", () => {
        const r = new AudioResource(ae, "");
        const spy = sinon.spy(console, "error");
        r.play();
        expect(spy.called).toBe(true);
        spy.restore();
    });

    it("increments the channel when played", async () => {
        const r = new AudioResource(ae, "", {
            channels: 3,
        });
        await wait();
        await r.play();
        await r.play();
        await wait();
        expect(r.currentChannel).toBe(2);
    });

    it("prints an error if a channel fails to play", async () => {
        const r = new AudioResource(ae, "");
        await wait();
        const spy = sinon.spy(console, "error");
        r.elements[0].play = () => { throw new Error() }
        r.play();
        expect(spy.called).toBe(true);
        spy.restore();
    });

    it("resets channel to 0 when all channels have played", async () => {
        const r = new AudioResource(ae, "", {
            channels: 2,
        });
        await wait();
        expect(r.currentChannel).toBe(0);
        await r.play();
        expect(r.currentChannel).toBe(1);
        await r.play();
        expect(r.currentChannel).toBe(0);
    });

    it("stops all channels when stop() is called", async () => {
        const r = new AudioResource(ae, "", {
            channels: 3,
        });
        await wait();
        await r.play();
        await r.play();
        await r.play();
        await wait();
        expect(r.elements.length).toBe(3);
        expect(r.elements[0].currentTime).not.toBe(0);
        expect(r.elements[1].currentTime).not.toBe(0);
        expect(r.elements[2].currentTime).not.toBe(0);
        r.stop();
        expect(r.elements[0].currentTime).toBe(0);
        expect(r.elements[1].currentTime).toBe(0);
        expect(r.elements[2].currentTime).toBe(0);
    });
});