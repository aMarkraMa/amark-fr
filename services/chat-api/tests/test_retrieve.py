from app.rag.retrieve import _build_query_variants, _rank_documents


def test_build_query_variants_expands_education_questions():
    variants = _build_query_variants("whats your school")

    assert variants[0] == "whats your school"
    assert len(variants) == 2
    assert "university" in variants[1]
    assert "institution" in variants[1]
    assert "master" in variants[1]


def test_build_query_variants_keeps_unrelated_questions_unchanged():
    assert _build_query_variants("what projects did you build") == [
        "what projects did you build"
    ]


def test_rank_documents_deduplicates_by_best_distance():
    ranked = _rank_documents(
        documents_batch=[
            ["education chunk", "project chunk"],
            ["education chunk", "other chunk"],
        ],
        distances_batch=[
            [0.5, 0.3],
            [0.2, 0.4],
        ],
    )

    assert ranked == [
        ("education chunk", 0.2),
        ("project chunk", 0.3),
        ("other chunk", 0.4),
    ]
