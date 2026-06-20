#!/usr/bin/env python3
"""Transcribe a video/audio file using OpenAI Whisper."""

import argparse
import sys
import os


def main():
    parser = argparse.ArgumentParser(description="Transcribe video/audio using Whisper")
    parser.add_argument("file", help="Path to the video/audio file")
    parser.add_argument(
        "--model",
        default="medium",
        choices=["tiny", "base", "small", "medium", "large", "large-v2", "large-v3"],
        help="Whisper model size (default: medium)",
    )
    parser.add_argument(
        "--language", default=None, help="Language code (e.g. 'he' for Hebrew, 'en' for English). Auto-detected if not set."
    )
    parser.add_argument(
        "--output", default=None, help="Output file path (default: same name as input with .txt extension)"
    )
    args = parser.parse_args()

    if not os.path.isfile(args.file):
        print(f"Error: File not found: {args.file}")
        sys.exit(1)

    try:
        import whisper
    except ImportError:
        print("Whisper is not installed. Installing...")
        os.system(f"{sys.executable} -m pip install openai-whisper")
        import whisper

    print(f"Loading Whisper model '{args.model}'...")
    model = whisper.load_model(args.model)

    print(f"Transcribing: {args.file}")
    result = model.transcribe(args.file, language=args.language, verbose=True)

    output_path = args.output or os.path.splitext(args.file)[0] + ".txt"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(result["text"])

    print(f"\n{'='*60}")
    print(f"Detected language: {result.get('language', 'unknown')}")
    print(f"Full transcription saved to: {output_path}")
    print(f"{'='*60}")
    print(f"\nTranscription:\n")
    print(result["text"])


if __name__ == "__main__":
    main()
