from app.rag.indexer import _iter_document_paths
from pathlib import Path
from app.config import RAG_ALLOWED_EXTENSIONS

def test_iter_document_paths(tmp_path):
    (tmp_path / "a.txt").write_text("text file")
    (tmp_path / "b.md").write_text("markdown file")
    (tmp_path / "c.pdf").write_text("pdf file")

    sub_dir = tmp_path / "sub_dir"
    sub_dir.mkdir()
    (sub_dir / "d.txt").write_text("sub dir text file")

    list_filename = [p.name for p in _iter_document_paths(tmp_path, RAG_ALLOWED_EXTENSIONS)]
    list_filename.sort()

    assert list_filename == ["a.txt", "b.md", "c.pdf", "d.txt"]