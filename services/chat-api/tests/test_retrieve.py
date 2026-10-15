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


def test_build_query_variants_expands_website_github_and_linkedin():
    website = _build_query_variants("what's your website")
    assert website[0] == "what's your website"
    assert "www.amark.fr" in website[1]

    github = _build_query_variants("github")
    assert "github.com/aMarkraMa" in github[1]

    linkedin = _build_query_variants("你的领英")
    assert "linkedin.com/in/shengqi-ma" in linkedin[1]

    french_site = _build_query_variants("ton site web")
    assert "www.amark.fr" in french_site[1]

    chinese_site = _build_query_variants("个人网站")
    assert "www.amark.fr" in chinese_site[1]


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
