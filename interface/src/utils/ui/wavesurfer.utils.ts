// File: src/utils/WaveSurferModule.ts

import WaveSurfer, {
  WaveSurferOptions,
  RegionsPlugin,
  Region,
} from "wavesurfer.js";
import Regions from "wavesurfer.js/dist/plugins/regions.esm.js"; // Ensure correct path based on version

export interface WaveSurferModuleOptions extends WaveSurferOptions {
  // Extend with any additional options if needed
}

export default class WaveSurferModule {
  public waveSurfer: WaveSurfer;
  private container: HTMLElement;

  constructor(container: HTMLElement, options?: WaveSurferModuleOptions) {
    if (!container) {
      throw new Error("WaveSurferModule requires a container element.");
    }
    console.log("WaveSurferModule initialized with container:", container);
    this.container = container;

    const defaultOptions: WaveSurferModuleOptions = {
      waveColor: "#999",
      progressColor: "#555",
      height: 80,
      responsive: true,
      backend: "WebAudio",
      plugins: [
        Regions.create({
          dragSelection: {
            slop: 5,
            color: "rgba(0, 123, 255, 0.1)",
          },
        }),
      ],
      ...options,
    };

    this.waveSurfer = WaveSurfer.create(defaultOptions);

    // Bind event listeners
    this.bindEvents();
  }

  private bindEvents() {
    this.waveSurfer.on("ready", () => {
      console.log("WaveSurfer is ready");
    });

    this.waveSurfer.on("error", (e) => {
      console.error("WaveSurfer error:", e);
    });

    this.waveSurfer.on("play", () => {
      console.log("Playback started");
    });

    this.waveSurfer.on("pause", () => {
      console.log("Playback paused");
    });

    // Handle region events
    const regions = this.waveSurfer.regions;

    regions.on("region-created", (region) => {
      console.log("Region created:", region);
      // Optionally, remove previous regions if you want only one active region
      regions.list.forEach((r) => {
        if (r.id !== region.id) {
          r.remove();
          console.log("Removed previous region:", r.id);
        }
      });
    });

    regions.on("region-click", (region, e) => {
      e.stopPropagation();
      console.log("Region clicked:", region);
      this.playRegion(region);
    });

    regions.on("out", (region) => {
      console.log("Playback exited the region");
      // Handle looping if needed
    });
  }

  public load(file: File | Blob) {
    console.log("Loading file:", file);
    this.waveSurfer.loadBlob(file);
  }

  public play() {
    this.waveSurfer.play();
  }

  public pause() {
    this.waveSurfer.pause();
  }

  public playPause() {
    this.waveSurfer.playPause();
  }

  public setPlaybackRate(rate: number) {
    this.waveSurfer.setPlaybackRate(rate);
    console.log(`Playback rate set to: ${rate}`);
  }

  public toggleLoop(region: Region) {
    region.update({ loop: !region.loop });
    console.log(`Looping ${region.loop ? "enabled" : "disabled"}`);
  }

  public restartPlayback() {
    const regions = this.waveSurfer.regions.list;
    const activeRegion = Object.values(regions)[0]; // Assuming one active region
    if (activeRegion) {
      this.waveSurfer.play(activeRegion.start);
      console.log("Restarted playback at region start:", activeRegion.start);
    } else {
      this.waveSurfer.play(0);
      console.log("Restarted playback at beginning");
    }
  }

  private playRegion(region: Region) {
    this.waveSurfer.play(region.start, region.end);
  }

  public async extractRegion(region: Region): Promise<Blob | null> {
    const originalBuffer = this.waveSurfer.backend.buffer;
    if (!originalBuffer) {
      console.error("No audio buffer available");
      return null;
    }

    const audioContext = this.waveSurfer.backend.ac;
    const sampleRate = originalBuffer.sampleRate;
    const startSample = Math.floor(region.start * sampleRate);
    const endSample = Math.floor(region.end * sampleRate);
    const frameCount = endSample - startSample;

    const numChannels = originalBuffer.numberOfChannels;
    const newBuffer = audioContext.createBuffer(
      numChannels,
      frameCount,
      sampleRate
    );

    for (let channel = 0; channel < numChannels; channel++) {
      const originalData = originalBuffer.getChannelData(channel);
      const newData = newBuffer.getChannelData(channel);
      newData.set(originalData.slice(startSample, endSample));
    }

    // Convert the buffer to a WAV Blob
    const wavBlob = await this.bufferToWave(newBuffer, newBuffer.length);
    return wavBlob;
  }

  private bufferToWave(abuffer: AudioBuffer, len: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const numOfChan = abuffer.numberOfChannels;
      const length = len * numOfChan * 2 + 44;
      const buffer = new ArrayBuffer(length);
      const view = new DataView(buffer);
      let offset = 0;
      let pos = 0;

      // Write WAV header
      const setUint32 = (data: number) => {
        view.setUint32(pos, data, true);
        pos += 4;
      };

      const setUint16 = (data: number) => {
        view.setUint16(pos, data, true);
        pos += 2;
      };

      // RIFF identifier 'RIFF'
      setUint32(0x46464952);
      // file length minus RIFF identifier length and file description length
      setUint32(length - 8);
      // RIFF type 'WAVE'
      setUint32(0x45564157);
      // format chunk identifier 'fmt '
      setUint32(0x20746d66);
      // format chunk length
      setUint32(16);
      // sample format (raw)
      setUint16(1);
      // channel count
      setUint16(numOfChan);
      // sample rate
      setUint32(abuffer.sampleRate);
      // byte rate (sample rate * block align)
      setUint32(abuffer.sampleRate * numOfChan * 2);
      // block align (channel count * bytes per sample)
      setUint16(numOfChan * 2);
      // bits per sample
      setUint16(16);
      // data chunk identifier 'data'
      setUint32(0x61746164);
      // data chunk length
      setUint32(length - pos - 4);

      // Write interleaved data
      for (let i = 0; i < abuffer.length; i++) {
        for (let channel = 0; channel < numOfChan; channel++) {
          // Clamp the sample to [-1, 1]
          let sample = Math.max(
            -1,
            Math.min(1, abuffer.getChannelData(channel)[i])
          );
          // Scale to 16-bit integer
          sample = sample < 0 ? sample * 32768 : sample * 32767;
          view.setInt16(pos, sample, true);
          pos += 2;
        }
      }

      resolve(new Blob([buffer], { type: "audio/wav" }));
    });
  }

  public destroy() {
    if (this.waveSurfer) {
      this.waveSurfer.destroy();
      console.log("WaveSurfer instance destroyed");
    }
  }
}
