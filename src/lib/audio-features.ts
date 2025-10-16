import type { AudioFeatures } from './types';

/**
 * Analyzes audio buffer to extract features like pauses, volume, etc.
 */
export class AudioFeaturesAnalyzer {
  private static readonly SILENCE_THRESHOLD = 0.01; // Amplitude threshold for silence
  private static readonly MIN_PAUSE_DURATION = 0.3; // Minimum pause duration in seconds
  private static readonly FRAME_SIZE = 2048; // Samples per frame for analysis

  /**
   * Analyze an audio buffer to extract speech features
   */
  static analyzeAudio(audioBuffer: AudioBuffer): AudioFeatures {
    const channelData = audioBuffer.getChannelData(0); // Use first channel
    const sampleRate = audioBuffer.sampleRate;
    const duration = audioBuffer.duration;

    // Detect pauses (silence segments)
    const pauses = this.detectPauses(channelData, sampleRate);

    // Calculate volume metrics
    const { averageVolume, volumeVariance } =
      this.calculateVolumeMetrics(channelData);

    // Calculate speech vs silence duration
    const silenceDuration = pauses.reduce(
      (sum, pause) => sum + pause.duration,
      0
    );
    const speechDuration = duration - silenceDuration;

    return {
      pauses,
      averageVolume,
      volumeVariance,
      speechDuration,
      silenceDuration,
    };
  }

  /**
   * Detect pauses (silent segments) in audio
   */
  private static detectPauses(
    channelData: Float32Array,
    sampleRate: number
  ): Array<{ start: number; end: number; duration: number }> {
    const pauses: Array<{ start: number; end: number; duration: number }> = [];
    let silenceStart: number | null = null;
    let isSilent = false;

    const frameCount = Math.floor(channelData.length / this.FRAME_SIZE);

    for (let i = 0; i < frameCount; i++) {
      const frameStart = i * this.FRAME_SIZE;
      const frameEnd = Math.min(
        frameStart + this.FRAME_SIZE,
        channelData.length
      );

      // Calculate RMS (Root Mean Square) for this frame
      let sum = 0;
      for (let j = frameStart; j < frameEnd; j++) {
        const sample = channelData[j] ?? 0;
        sum += sample * sample;
      }
      const rms = Math.sqrt(sum / (frameEnd - frameStart));

      const currentTime = frameStart / sampleRate;

      // Check if this frame is silent
      if (rms < this.SILENCE_THRESHOLD) {
        if (!isSilent) {
          // Start of silence
          silenceStart = currentTime;
          isSilent = true;
        }
      } else {
        if (isSilent && silenceStart !== null) {
          // End of silence
          const silenceDuration = currentTime - silenceStart;

          // Only record if it's long enough to be considered a pause
          if (silenceDuration >= this.MIN_PAUSE_DURATION) {
            pauses.push({
              start: silenceStart,
              end: currentTime,
              duration: silenceDuration,
            });
          }

          isSilent = false;
          silenceStart = null;
        }
      }
    }

    // Handle case where audio ends during silence
    if (isSilent && silenceStart !== null) {
      const endTime = channelData.length / sampleRate;
      const silenceDuration = endTime - silenceStart;

      if (silenceDuration >= this.MIN_PAUSE_DURATION) {
        pauses.push({
          start: silenceStart,
          end: endTime,
          duration: silenceDuration,
        });
      }
    }

    return pauses;
  }

  /**
   * Calculate average volume and variance
   */
  private static calculateVolumeMetrics(channelData: Float32Array): {
    averageVolume: number;
    volumeVariance: number;
  } {
    const frameCount = Math.floor(channelData.length / this.FRAME_SIZE);
    const volumeLevels: number[] = [];

    for (let i = 0; i < frameCount; i++) {
      const frameStart = i * this.FRAME_SIZE;
      const frameEnd = Math.min(
        frameStart + this.FRAME_SIZE,
        channelData.length
      );

      // Calculate RMS for this frame
      let sum = 0;
      for (let j = frameStart; j < frameEnd; j++) {
        const sample = channelData[j] ?? 0;
        sum += sample * sample;
      }
      const rms = Math.sqrt(sum / (frameEnd - frameStart));
      volumeLevels.push(rms);
    }

    // Calculate average volume
    const averageVolume =
      volumeLevels.reduce((sum, vol) => sum + vol, 0) / volumeLevels.length;

    // Calculate variance
    const squaredDiffs = volumeLevels.map(vol =>
      Math.pow(vol - averageVolume, 2)
    );
    const variance =
      squaredDiffs.reduce((sum, diff) => sum + diff, 0) / volumeLevels.length;

    // Volume consistency: inverse of coefficient of variation (normalized)
    // Higher value = more consistent volume
    const volumeVariance =
      averageVolume > 0 ? Math.sqrt(variance) / averageVolume : 1;

    return {
      averageVolume,
      volumeVariance,
    };
  }

  /**
   * Calculate volume consistency score (0-1, higher is better)
   */
  static calculateVolumeConsistency(volumeVariance: number): number {
    // Convert variance to consistency score
    // Lower variance = higher consistency
    // Using inverse exponential to map variance to 0-1 scale
    return Math.max(0, Math.min(1, Math.exp(-volumeVariance * 2)));
  }
}
