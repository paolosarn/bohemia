#!/usr/bin/env bash
# BOHEMIA: ASEPRITE BUILT HEADLESS FROM ITS PUBLIC SOURCE (PLUMBER 10/18/26, VAMILY row [aseprite in the pipe]).
#
# Paolo bought Aseprite (10/11, his one word, $19.99). Its source is public at github.com/aseprite/aseprite and its
# EULA lets a user compile it for their own use; it does NOT allow redistributing the binary. So the binary is
# built here, on a box we own (GitHub's free runner, .github/workflows/aseprite.yml, or a chat's container), cached
# there, and NEVER committed (gates/aseprite_pipe_gate.py checks the tree). No UI: -DENABLE_UI=OFF -DLAF_BACKEND=none,
# batch mode and Lua scripting only, which is everything a chat needs (aseprite -b --script tools/aseprite/<job>.lua).
#
# LICENCE LINES (they ride with this script): Aseprite, Copyright (C) 2018-2026 Igara Studio S.A., Copyright (C)
# 2001-2018 David Capello; source under the Aseprite EULA (EULA.txt in the source tree: compiling for your own
# use is allowed, redistribution of the build is not). Its third-party libraries carry their own licences in
# docs/LICENSES.md of the source tree.
#
#   tools/aseprite/build_headless.sh <aseprite source dir> <out dir>
#
# The source is cloned by the caller at a pinned tag with its submodules:
#   git clone --depth 1 --branch v1.3.18.6 --recurse-submodules --shallow-submodules https://github.com/aseprite/aseprite SRC
# A box whose proxy refuses GitHub's archive URLs (the chats' container: 403, measured 10/17 and 10/18) sets
# ASEPRITE_JPEG_TURBO_DIR to a git checkout of libjpeg-turbo 3.0.2; the runner leaves it unset and builds upstream
# unchanged. Ubuntu packages it needs: build-essential cmake ninja-build libx11-dev libxcursor-dev libxi-dev
# libxrandr-dev libgl1-mesa-dev libfontconfig1-dev.
set -euo pipefail
SRC=$(cd "$1" && pwd); OUT=$2
if [ -n "${ASEPRITE_JPEG_TURBO_DIR:-}" ]; then
  sed -i -e "s#URL https://github.com/libjpeg-turbo/libjpeg-turbo/archive/refs/tags/3.0.2.zip#SOURCE_DIR $(cd "$ASEPRITE_JPEG_TURBO_DIR" && pwd)#" \
         -e '/URL_HASH SHA512=c048c041/d' "$SRC/cmake/FindJpegTurbo.cmake"
fi
BUILD="$SRC/build-headless"
cmake -S "$SRC" -B "$BUILD" -G Ninja -DCMAKE_BUILD_TYPE=Release \
  -DENABLE_UI=OFF -DLAF_BACKEND=none -DENABLE_SCRIPTING=ON \
  -DENABLE_NEWS=OFF -DENABLE_UPDATER=OFF -DENABLE_CCACHE=OFF -DENABLE_TESTS=OFF -DENABLE_DRM=OFF
cmake --build "$BUILD" -j "$(nproc)"
mkdir -p "$OUT"
cp -r "$BUILD/bin/." "$OUT/"
"$OUT/aseprite" --version
