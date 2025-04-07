import expect from "expect";
import { AudioEngine } from "./AudioEngine";
import sinon from "sinon";

describe("AudioEngine", () => {
    it("creates main, sound, and music GainNodes", () => {
        const myFake = sinon.fake();
        class GainNode {
            connect() {
                myFake();
            }
        }
        // @ts-ignore
        globalThis.GainNode = GainNode;

        const ae = new AudioEngine();
        expect(ae.gain.main).toBeTruthy();
        expect(ae.gain.music).toBeTruthy();
        expect(ae.gain.sound).toBeTruthy();
        expect(myFake.getCalls().length).toBe(3);
    });
});