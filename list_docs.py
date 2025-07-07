import os
import json

EXCLUDED_DIRS = {'node_modules', 'vendor', 'third_party', 'extern', '__pycache__'}
DOC_EXT = '.md'
OUTPUT_FILE = 'docs_index.json'

def should_exclude_dir(dirname):
    return dirname in EXCLUDED_DIRS

def list_markdown_files(root_dir):
    md_files = []
    for dirpath, dirnames, filenames in os.walk(root_dir):
        dirnames[:] = [d for d in dirnames if not should_exclude_dir(d)]
        for f in filenames:
            if f.lower().endswith(DOC_EXT):
                rel_dir = os.path.relpath(dirpath, root_dir)
                rel_path = os.path.normpath(os.path.join(rel_dir, f)) if rel_dir != '.' else f
                md_files.append(rel_path)
    return md_files

def main():
    docs = list_markdown_files('.')
    with open(OUTPUT_FILE, 'w') as out:
        json.dump(docs, out, indent=2)
    print(f'Indexed {len(docs)} Markdown docs and wrote {OUTPUT_FILE}')

if __name__ == '__main__':
    main()

