import expect from "expect";
import { AudioEngine } from "./AudioEngine";
import sinon from "sinon";

describe("AudioEngine", () => {
    it("creates main, sound, and music GainNodes", () => {
        const spy = sinon.spy(GainNode.prototype, "connect");
        new AudioEngine();
        expect(spy.getCalls().length).toBe(3);
        spy.restore();
    });
});