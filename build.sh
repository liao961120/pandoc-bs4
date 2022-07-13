pandoc \
    chapters/0*.md chapters/ap*.md \
    pd-styles/variables.md pd-styles/references.md \
    --file-scope \
    -o "content.html.txt" \
    --from markdown+smart+header_attributes+superscript+subscript \
    --to html5 \
    --katex="https://cdn.jsdelivr.net/npm/katex@0.13.13/dist/" \
    --filter="pandoc-crossref" \
    --citeproc \
    --strip-comments \
    --section-divs \
    --shift-heading-level-by=0 \
    --metadata link-citations=true \
    --csl="pd-styles/apa.csl" \
    --bibliography="chapters/references.bib" \
    -V lang="zh-Hant" \
    --number-sections \
    -V indent


cp -r chapters/figures .
