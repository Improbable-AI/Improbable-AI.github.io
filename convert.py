import requests
from bs4 import BeautifulSoup
import re
import os

BASE_PAGE = "https://people.csail.mit.edu/pulkitag/"

def fetch_html(url):
    resp = requests.get(url)
    resp.raise_for_status()
    return resp.text

def make_full_url(src):
    if src.startswith(("http:", "https:")):
        return src
    return BASE_PAGE + src.lstrip("/")

def parse_paper_rows(section):
    articles = []
    rows = section.find_all("tr")
    for row in rows:
        cols = row.find_all("td")
        if len(cols) != 2:
            continue
        thumb_td, content_td = cols

        # Thumbnail
        media = thumb_td.find(["img", "video"])
        if not media: continue
        if "src" not in media.attrs: continue  # Skip if no src attribute
        thumb_src = make_full_url(media["src"])
        
        # Title and link
        title_node = content_td.find("papertitle")
        if not title_node: continue
        title = title_node.get_text(strip=True)
        link = title_node.find_parent("a")["href"]

        # Authors (completely rewritten)
        # First, get all text content and find the author section
        text_content = content_td.get_text(" ")
        
        # Find the position after the title
        title_pos = text_content.find(title)
        if title_pos != -1:
            # Get text after title
            after_title = text_content[title_pos + len(title):]
            
            # Look for venue indicators to find where author section ends
            venue_indicators = ["workshop", "conference", "arxiv", "neurips", "icra", "iclr", "cvpr", "eccv", "icml", "oral", "poster", "in submission", "submitted", "under review", "preprint", "iros", "corl"]
            venue_pos = -1
            for indicator in venue_indicators:
                pos = after_title.lower().find(indicator)
                if pos != -1 and (venue_pos == -1 or pos < venue_pos):
                    venue_pos = pos
            
            # Look for resource links to find where author section ends
            resource_keywords = ["paper", "code", "bibtex", "project page", "website", "slides", "video", "talk", "data"]
            resource_pos = -1
            for kw in resource_keywords:
                pos = after_title.lower().find(kw)
                if pos != -1 and (resource_pos == -1 or pos < resource_pos):
                    resource_pos = pos
            
            # Determine where author section ends
            end_pos = -1
            if venue_pos != -1 and resource_pos != -1:
                end_pos = min(venue_pos, resource_pos)
            elif venue_pos != -1:
                end_pos = venue_pos
            elif resource_pos != -1:
                end_pos = resource_pos
            
            if end_pos != -1:
                author_text = after_title[:end_pos].strip()
            else:
                # If no clear end found, take first few lines
                lines = after_title.split('\n')
                author_text = lines[0].strip() if lines else ""
            
            # Clean up author text
            author_text = re.sub(r'[*†]', '', author_text)  # Remove asterisks and daggers
            author_text = re.sub(r'\([^)]*\)', '', author_text)  # Remove parenthetical notes
            author_text = re.sub(r',\s*,', ',', author_text)  # Remove double commas
            author_text = author_text.strip(' ,')
            
            # Extract author names
            authors = []
            if author_text:
                for name in author_text.split(','):
                    name = name.strip()
                    if name and len(name) > 2 and not any(kw in name.lower() for kw in resource_keywords):
                        authors.append(name)
            
            # Also get linked authors (those in <a> tags that are not resources)
            author_links = content_td.find_all("a")
            for a in author_links:
                if a.find("papertitle"): continue
                name = a.get_text(strip=True)
                href = a["href"]
                
                # Skip resource links based on both text and href
                if any(kw in name.lower() for kw in resource_keywords):
                    continue
                
                # Skip if href contains resource indicators
                resource_href_indicators = ["arxiv.org", "data/", "github.com", "project", "slides", "video"]
                if any(indicator in href.lower() for indicator in resource_href_indicators):
                    continue
                
                # Check if this name is already in our plain text authors
                if not any(name in author for author in authors):
                    authors.append(f'<a href="{href}" target="_blank">{name}</a>')
            
            authors_html = ", ".join(authors) if authors else "Unknown Authors"
        else:
            authors_html = "Unknown Authors"

        # Year & Venue
        text = content_td.get_text(" ")
        year = next((w for w in text.split() if w.isdigit() and len(w)==4), "")
        venue = ""
        if "arXiv" in text:
            venue = "arXiv"
        elif year:
            # Find the year and extract the text after it (up to a period, comma, or end of line)
            match = re.search(rf"{year}([^\n\r\.,]*)", text)
            if match:
                venue = match.group(1).strip()
                # Clean up venue: remove leading/trailing separators and extra spaces
                venue = re.sub(r"^[·\-:]*", "", venue).strip()
                # Remove status indicators like (Oral), (Poster), etc.
                venue = re.sub(r'\([^)]*\)', '', venue).strip()
                # If venue is empty or just 'paper', try to look for known venues
                if not venue or venue.lower() == "paper":
                    # Look for venue patterns in the text
                    venue_patterns = [
                        r'Workshop on [^,]+',
                        r'Conference on [^,]+', 
                        r'International Conference on [^,]+',
                        r'[A-Z]{2,}(?:[A-Z]+)?',  # Acronyms like ICLR, ICRA, etc.
                    ]
                    
                    for pattern in venue_patterns:
                        matches = re.findall(pattern, text)
                        for match in matches:
                            if match not in ['Oral', 'Poster', 'Paper'] and len(match) > 2:
                                venue = match
                                break
                        if venue:
                            break
                    
                    # If still no venue, try the known venues list
                    if not venue:
                        known_venues = ["ICRA", "ICLR", "NeurIPS", "CVPR", "ECCV", "ICML", "Workshop", "IROS", "CoRL"]
                        for v in known_venues:
                            if v in text and v not in ['Oral', 'Poster']:
                                venue = v
                                break

        # Links (paper, code, bibtex)
        links_html = []
        for a in content_td.find_all("a", href=True):
            t = a.get_text(strip=True).lower()
            if "paper" in t:
                links_html.append(f'<a href="{a["href"]}" class="paper-link">Paper PDF</a>')
            elif "code" in t:
                links_html.append(f'<a href="{a["href"]}" class="paper-link">Code</a>')
            elif "bib" in t:
                links_html.append(f'<a href="{a["href"]}" class="paper-link">BibTeX</a>')

        # Abstract
        p_tags = content_td.find_all("p")
        abstract = p_tags[-1].get_text(strip=True) if p_tags else ""

        # Compose card
        card = f'''
<article class="paper-card">
  <div class="paper-thumbnail">
    <a href="{link}" target="_blank">
      <img src="{thumb_src}" alt="{title}" style="border-radius:8px; width:100%; object-fit:cover;">
    </a>
  </div>
  <div class="paper-content">
    <h3 class="paper-title">
      <a href="{link}" target="_blank">{title}</a>
    </h3>
    <div class="paper-authors">{authors_html}</div>
    <div class="paper-meta">
      <span class="paper-date">{year}</span> <span class="paper-venue">{venue}</span>
    </div>
    <div class="paper-links">{' '.join(links_html)}</div>
    <p class="paper-abstract">{abstract}</p>
  </div>
</article>'''
        articles.append(card.strip())
    return "\n\n".join(articles)

def main():
    html = fetch_html(BASE_PAGE)
    soup = BeautifulSoup(html, "html.parser")
    
    # Remove existing sample.html if it exists
    if os.path.exists("sample.html"):
        os.remove("sample.html")
    
    out = []
    for heading in soup.find_all("heading"):
        text = heading.get_text(strip=True).lower()
        if text in ("pre-prints", "publications"):
            section = heading.find_parent("table")
            out.append(parse_paper_rows(section))
    full_html = "\n\n".join(out)
    
    # Write to sample.html
    with open("sample.html", "w", encoding="utf-8") as f:
        f.write(full_html)
    print("HTML content written to sample.html")

if __name__ == "__main__":
    main()
