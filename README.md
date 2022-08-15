A Book Template for Pandoc HTML Fragments
=========================================

Recreation of bookdown's [bs4_book][bs4] HTML template, with dependencies other 
than [pandoc][pd] & [pandoc-crossref][pd-crf] dropped. 
See a live example [here](https://yongfu.name/pandoc-bs4).


## Usage

The template is designed to work with HTML fragments generated with Pandoc. The 
top-level headings (chapters) must be `H1` (i.e., `# Your heading` in markdown). 
Texts preceding the first `H1` headings are ignored. An example build script 
can be found in `build.sh`.

```bash
bash build.sh
```

Note the options shown below should be kept unchanged in order for the compiled book 
to work as expected:

```bash
-o "content.html.txt"
--from markdown+smart+header_attributes+superscript+subscript 
--to html5 
--katex="https://cdn.jsdelivr.net/npm/katex@0.13.13/dist/" 
--filter="pandoc-crossref" 
--citeproc 
--strip-comments 
--section-divs 
--shift-heading-level-by=0 
```

Note that the markdown file `pd-styles/variables.md` should be placed as 
the **second last** markdown file (preceeding `pd-styles/references.md`) when 
the option `--file-scope` (i.e., parse-then-concat) is specified. Otherwise 
(concat-then-parse), `pd-styles/variables.md` should be placed as the **first** 
markdown file[^1].

[^1]: In this situation, make sure that **NO YAML headers** are present in
the markdown files except for the first one (or the YAMLs would be interpreted 
as markdown content since the files were concatinated before parsing).

[bs4]: https://github.com/rstudio/bookdown/blob/main/inst/templates/bs4_book.html
[pd]: https://pandoc.org
[pd-crf]: https://github.com/lierdakil/pandoc-crossref


## ToDo

- Figure/Table/Equation... cross-reference
- Enhancement
    1. Fix appendix cross-ref number (e.g., **3.1** should be **A.1**)