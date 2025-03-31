import re

def clean_query(raw_query: str) -> list[str]:
    """
    Clean and simplify query strings for fuzzy product search.
    Returns a list of progressively broader search terms.
    """
    original = raw_query.lower()

    # Remove unnecessary context
    cleaned = re.sub(r"\(.*?\)", "", original)  # remove parentheses
    cleaned = re.sub(r"\b(to taste|your choice of|optional|as needed)\b", "", cleaned)
    cleaned = re.sub(r"[^a-zA-Z0-9\s]", "", cleaned)  # remove non-alphanumerics
    cleaned = re.sub(r"\s+", " ", cleaned).strip()

    variants = [cleaned]

    # Split into useful fallback queries
    keywords = cleaned.split()
    if len(keywords) > 1:
        variants.append(" ".join(keywords[:2]))  # first two words
        variants.append(keywords[0])             # first word
        if len(keywords) >= 2:
            variants.append(" ".join(reversed(keywords[:2])))  # reverse two-word combo

    return list(dict.fromkeys(variants))  # deduplicate in order