"""Prepare the owner's fillable character sheet for the local browser exporter."""
from argparse import ArgumentParser
from pathlib import Path
from pypdf import PdfReader, PdfWriter

def main():
    parser = ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path)
    parser.add_argument('--replace', action='store_true')
    args = parser.parse_args()
    target = Path(__file__).resolve().parent / 'private' / 'character-record-sheet.pdf'
    if target.exists() and not args.replace:
        parser.error('Prepared template already exists. Use --replace to replace it.')
    reader = PdfReader(args.source)
    if reader.is_encrypted and not reader.decrypt(''):
        parser.error('This file needs a password. Choose an unprotected fillable copy.')
    fields = reader.get_fields() or {}
    if len(reader.pages) != 2 or not {'Introduction.0', 'ArmorClass.4'}.issubset(fields):
        parser.error('Choose the supplied two-page Advanced Fantasy Character Record Sheet.')
    writer = PdfWriter()
    writer.clone_document_from_reader(reader)
    target.parent.mkdir(parents=True, exist_ok=True)
    with target.open('wb') as output:
        writer.write(output)
    check = PdfReader(target)
    assert not check.is_encrypted and set(check.get_fields() or {}) == set(fields)
    print(f'Prepared {len(fields)} named form entries; original source unchanged. Run npm run build.\n{target}')

if __name__ == '__main__':
    main()
