export interface StemsResponse {
  stemUrls: string[];
  trackName: string;
  status: string;
}

export interface MidiResponse {
  stemUrls: string[];
  trackName: string;
  status: string;
}

// engine_responses.ts

export interface StatusResponse {
  status: string;
  results?: {
    stems?: { [filename: string]: string };
    midi_files?: { [filename: string]: string };
  };
  message?: string;
  trackName?: string;
}
