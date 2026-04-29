#!/bin/bash

# ===== STUDENT DETAILS (EDIT THIS) =====
TITLE="DevOps Lab Report"
AUTHOR="Kinjal"
SAPID="500123394"

# ===== URLs (ADD/REMOVE AS NEEDED) =====
URLS=(
  "https://kinjalsri.github.io/Containerization-DevOps-/"
  "https://kinjalsri.github.io/Containerization-DevOps-/Lab/Exp1/"
  "https://kinjalsri.github.io/Containerization-DevOps-/Lab/Exp2/"
  "https://kinjalsri.github.io/Containerization-DevOps-/Lab/Exp3/docker3/"
)

# ===== GENERATE PDF =====
pandoc "${URLS[@]}" \
  -o output.pdf \
  --pdf-engine=xelatex \
  --toc \
  --number-sections \
  -V geometry:margin=1in \
  -M title="$TITLE" \
  -M author="$AUTHOR ($SAPID)"

echo "PDF generated: output.pdf"
