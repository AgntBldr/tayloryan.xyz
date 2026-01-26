# Archive Portfolio Directive

## Goal
Archive writing portfolio by crawling URLs from a CSV file, verifying they are live, and capturing full-page screenshots as compressed PDFs.

## Inputs
- **Input File**: `Ref Docs/Writing Port Taylor - Antigravity - Writing.csv`
- **Output Directory**: `Ref Docs/Archived_PDFs` (to be created)

## Tools/Scripts
- `execution/archive_articles.py`: Main script to process the CSV.
    - libraries: `csv`, `playwright`, `os`, `re`

## Process
1.  **Read CSV**: Load the CSV file.
2.  **Iterate**: Process each row.
3.  **Check Live**: Verify URL returns a 200 OK status (or similar successful status). Update 'Live?' column.
    - If 404 or verify failed -> Mark 'Dead' or 'No'. Skip PDF.
4.  **Capture PDF**: If live:
    - Open in headless browser (Playwright).
    - Handle cookie/popups if possible (try/except blocks for common selectors).
    - Scroll to bottom to ensure lazy loading triggers.
    - Screenshot/PDF full page.
5.  **Save**:
    - Name: First 7 words of title + " - Taylor [PDF].pdf"
    - Location: `Ref Docs/Archived_PDFs`
    - Compress: Use simple PDF compression (or valid playwright args for size). Warning: `pdf` file size depends on content.
6.  **Update CSV**: Mark 'PDF Saved' as 'Yes'.
7.  **Limit**: Process max 3 articles for testing.

## Output
- Updated CSV.
- PDF files in `Ref Docs/Archived_PDFs`.
