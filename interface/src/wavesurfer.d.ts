// File: src/wavesurfer.d.ts

// import WaveSurfer from "wavesurfer.js";

declare module "wavesurfer.js" {
  interface WaveSurfer {
    regions: Regions;
  }

  namespace WaveSurfer {
    interface Regions {
      addRegion(options: RegionOptions): Region;
      clear(): void;
      on(
        event: "region-click",
        callback: (region: Region, e: MouseEvent) => void
      ): void;
      on(event: "region-created", callback: (region: Region) => void): void;
      on(event: "region-updated", callback: (region: Region) => void): void;
      // Add other event signatures as needed
    }

    interface Region {
      start: number;
      end: number;
      color: string;
      loop: boolean;
      drag: boolean;
      resize: boolean;
      on(event: string, callback: () => { return }): void;
      remove(): void;
      update(options: Partial<RegionOptions>): void;
      // Add other methods as needed
    }

    interface RegionOptions {
      start: number;
      end: number;
      color: string;
      loop?: boolean;
      drag?: boolean;
      resize?: boolean;
      content?: string;
    }

    interface DragSelectionOptions {
      slop?: number;
      color?: string;
    }
  }
}
