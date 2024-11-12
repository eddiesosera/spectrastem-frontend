// src/services/audioExtraction.ts

import WaveSurfer from "wavesurfer.js";

export const extractSegment = async (
  wavesurfer: WaveSurfer,
  start: number,
  end: number
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const audioBuffer = wavesurfer.backend
      .getAudioContext()
      .createBuffer(
        start,
        end,
        wavesurfer.backend.getAudioContext().sampleRate
      );
    if (!audioBuffer) {
      reject(new Error("No audio buffer found"));
      return;
    }

    const sampleRate = audioBuffer.sampleRate;
    const startSample = Math.floor(start * sampleRate);
    const endSample = Math.floor(end * sampleRate);
    const length = endSample - startSample;

    // Create a new AudioBuffer for the extracted segment
    const newBuffer = wavesurfer.backend
      .getAudioContext()
      .createBuffer(audioBuffer.numberOfChannels, length, sampleRate);

    // Copy each channel's data
    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const channelData = audioBuffer
        .getChannelData(channel)
        .slice(startSample, endSample);
      newBuffer.copyToChannel(channelData, channel, 0);
    }

    // Convert the AudioBuffer to a WAV Blob
    const wavBlob = bufferToWave(newBuffer, length);
    resolve(wavBlob);
  });
};

/**
 * Converts an AudioBuffer to a WAV Blob
 * @param abuffer - The AudioBuffer to convert
 * @param len - The length of the audio in samples
 * @returns A Promise that resolves to a WAV Blob
 */
const bufferToWave = (abuffer: AudioBuffer, len: number): Blob => {
  const numOfChan = abuffer.numberOfChannels;
  const length = len * numOfChan * 2 + 44;
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);
  const channels = [];
  const sampleRate = abuffer.sampleRate;
  const bitDepth = 16;

  // Write WAV header
  writeUTFBytes(view, 0, "RIFF");
  view.setUint32(4, 44 + len * numOfChan * 2, true);
  writeUTFBytes(view, 8, "WAVE");
  writeUTFBytes(view, 12, "fmt ");
  view.setUint32(16, 16, true); // PCM
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, numOfChan, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, (sampleRate * numOfChan * bitDepth) / 8, true);
  view.setUint16(32, (numOfChan * bitDepth) / 8, true);
  view.setUint16(34, bitDepth, true);
  writeUTFBytes(view, 36, "data");
  view.setUint32(40, len * numOfChan * 2, true);

  // Write interleaved data
  for (let i = 0; i < abuffer.numberOfChannels; i++) {
    channels.push(abuffer.getChannelData(i));
  }

  let offset = 44;
  for (let i = 0; i < len; i++) {
    for (let channel = 0; channel < numOfChan; channel++) {
      const sample = Math.max(-1, Math.min(1, channels[channel][i]));
      view.setInt16(
        offset,
        sample < 0 ? sample * 0x8000 : sample * 0x7fff,
        true
      );
      offset += 2;
    }
  }

  return new Blob([buffer], { type: "audio/wav" });
};

/**
 * Writes UTF-8 bytes to a DataView
 * @param view - The DataView to write to
 * @param offset - The offset to start writing at
 * @param string - The string to write
 */
const writeUTFBytes = (view: DataView, offset: number, string: string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};

/**
 * Extracts the duration of an audio file in seconds.
 * @param file The audio file.
 * @returns A promise that resolves to the duration in seconds.
 */
export const getAudioDuration = (file: File): Promise<number> => {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const objectUrl = URL.createObjectURL(file);

    audio.src = objectUrl;
    audio.addEventListener("loadedmetadata", () => {
      resolve(audio.duration);
      URL.revokeObjectURL(objectUrl);
    });

    audio.addEventListener("error", () => {
      reject(new Error("Failed to load audio metadata"));
      URL.revokeObjectURL(objectUrl);
    });
  });
};
