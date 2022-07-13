<!-- No visible contents would appear above the first chapter -->

Introduction
=============


Template Setup
--------------

## Order of Markdown Files

The order of the content could be specified in the build script `build.sh`.
It is recommended to use filenames with number prefixes to indicate the 
order of the files  (e.g., `01-intro.md`, `02-method.md`, ...). If filenames 
are specified with such conventions, wildcards could be easily applied in 
the build command include multiple files without writing down each of their
filenames.


## Book Info Variables

The variables of the book template are set in the file `bookinfo.html`.


## Reference Title

The title of the reference is set by the markdown file in 
`pd-styles/references.md`.



Text Formatting
-----------------

## Popovers

Footnotes[^footnote] and bibliographies [@dunning1993] are shown as popovers when clicked.


[^footnote]: Footnotes and references are shown as popovers when clicked.


## Citation

Citations could be added and formatted with [pandoc-citeproc][cite]. See
@dunning1993 for instance.


## Figures and Tables

To properly display figures, figure paths should be specified 
**relative to** `index.html`. Hence, manipulation of the `figures/` directory
may be needed in the build script[^2].

![Figure caption here](figures/sliding-window.png){#fig:ref-label}


You can refer to the figure with [pandoc-crossref][pd-crf]'s syntax: see 
@fig:ref-label. To customized the prefix of figure (and table) captions, 
modify the YAML header in `pd-styles/variables.md`. Refer to 
[pandoc-crossref][pd-crf]'s documentation for the meaning of the variables

To cross-reference a table, also refer to [pandoc-crossref][pd-crf].



[cite]: https://github.com/jgm/pandoc-citeproc
[pd-crf]: https://github.com/lierdakil/pandoc-crossref

[^2]: For instance, the figure directory (`chapters/figures`) could be copied
to the same directory where `index.html` is found.
    
    ```bash
    cp -r chapters/figures .
    ```


## Custom Box

You can define a box area with a custom title.

::: {.Box title="Custom Box Title"}
Markdown content and other blocks are enabled, e.g., code:

```python
print("Custom code block")
```
:::::::::::
