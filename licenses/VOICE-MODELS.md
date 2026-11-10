# Voice models and runtime

- VieNeu-TTS-v3-Turbo, Phạm Nguyễn Ngọc Bảo / pnnbao-ump: https://huggingface.co/pnnbao-ump/VieNeu-TTS-v3-Turbo — Apache2.0. Bundled snapshot61b85e3d937fbbacb387714180e8182823512523.
- MOSS-Audio-Tokenizer-Nano-ONNX, OpenMOSS-Team: https://huggingface.co/OpenMOSS-Team/MOSS-Audio-Tokenizer-Nano-ONNX — Apache2.0. Bundled snapshotceff0d0749bfb3fa2d61149794ec6feef0d1e1ae.
- Original MOSS model: https://huggingface.co/OpenMOSS-Team/MOSS-Audio-Tokenizer-Nano — Apache2.0.

The public model metadata was checked on10/11/2026: all three are public, ungated and declare apache-2.0. Apache2 text is included alongside this file.

The original wedding voice reference and compiled worker are included at the tool owner's request, without changing their hashes. Owner settings: backend onnx, temperature0.65, denoisefalse, useRefCodestrue,48kHz, loudness I=-14:TP=-1:LRA=7. The default selected online voice is Nam Minh at1.15; all model/reference settings remain available.

Python and installed libraries retain their original license metadata in resources/runtime/python. Node's license is included here. FFmpeg source/build references are in THIRD-PARTY.txt.
