#!/usr/bin/env sh
# BOHEMIA - MAKE A FRESH CONTAINER ABLE TO RUN ITS OWN GATES.
#
# BACKLOG SOUNDS #5, open since 7/29 and marked "NON-COOK, any lane can take it":
# nine gates read PIXELS and need Pillow + numpy. A fresh container has neither,
# so they all die with ModuleNotFoundError at the END of a ~700 second suite run
# and read like nine real failures. It cost one session a full re-run to find out
# it was one pip install, and it has cost every session since a warning nobody
# can act on mid-run.
#
# bohemia_gates.py already SAYS it up front. Saying it is not fixing it.
#
# THIS SCRIPT IS DELIBERATELY BORING:
#   - it checks first and does nothing when there is nothing to do, so the
#     common case costs one python startup
#   - it NEVER exits non-zero. A session that cannot start is worse than a
#     session with a missing library, and this runs before any work happens
#   - it prints ONE line per stack it had to install, because a wall of pip
#     output at session start is noise in front of the actual task
set -u
cd "$(dirname "$0")/.." 2>/dev/null || exit 0

if ! python3 -c "import PIL, numpy" >/dev/null 2>&1; then
  echo "BOHEMIA: installing the gate image stack (Pillow + numpy) for this container..."
  python3 -m pip install --quiet --disable-pip-version-check \
    -r gates/requirements.txt >/dev/null 2>&1

  if python3 -c "import PIL, numpy" >/dev/null 2>&1; then
    echo "BOHEMIA: gate image stack ready. The nine pixel gates can run."
  else
    echo "BOHEMIA: could not install Pillow/numpy. The nine pixel gates WILL fail;"
    echo "         that is a real failure of this container, not of the art."
  fi
fi

# THE TOOLCHAIN'S AUDIO HALF (PLUMBER 10/19, row [the toolchain]): the sound leg and SOUNDS'
# recording chain need scipy, soundfile, Pedalboard and pyroomacoustics; a fresh container has
# none. Second on purpose: the image stack above is the one every pixel gate needs, so it goes
# first and this one can never delay it. About 20 s, once per container.
if ! python3 -c "import scipy, soundfile, pedalboard, pyroomacoustics" >/dev/null 2>&1; then
  python3 -m pip install --quiet --disable-pip-version-check \
    -r tools/requirements_toolchain.txt >/dev/null 2>&1
  if python3 -c "import scipy, soundfile, pedalboard, pyroomacoustics" >/dev/null 2>&1; then
    echo "BOHEMIA: the toolchain's audio half is ready (python3 tools/bohemia_toolchain.py doctor)."
  else
    echo "BOHEMIA: the toolchain's audio half did not install; python3 tools/bohemia_toolchain.py setup"
  fi
fi
exit 0
