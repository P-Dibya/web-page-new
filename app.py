#!/usr/bin/env python3
"""
Author Profile & Blog Homepage Backend API
Author: Cyber Automation Engineer
Description: Flask and FastAPI backend for serving the technical blog homepage
             with dynamic blog posts, author profile, and SEO features.
"""

from datetime import datetime
from typing import List, Dict, Optional
import json
import xml.etree.ElementTree as ET
from urllib.parse import urljoin
import os

# Import Flask components
from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS

# Import FastAPI components
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response

# Blog posts data (dynamic content)
BLOG_POSTS = [
    {
        "id": 1,
        "title": "Introduction to SCADA Systems: Architecture and Security",
        "slug": "scada-intro-architecture-security",
        "excerpt": "Comprehensive overview of SCADA architecture, communication protocols, and cybersecurity best practices.",
        "content": "Full article content here...",
        "author": "Cyber Automation Engineer",
        "date": "2024-01-15",
        "updated": "2024-01-20",
        "category": "SCADA Development",
        "tags": ["SCADA", "ICS", "Security", "Architecture"],
        "read_time": 8,
        "thumbnail": "/images/scada-intro.jpg",
        "featured": True,
    },
    {
        "id": 2,
        "title": "PLC Programming: Best Practices and Common Pitfalls",
        "slug": "plc-programming-best-practices",
        "excerpt": "Deep dive into IEC 61131-3 programming standards and avoiding common mistakes.",
        "content": "Full article content here...",
        "author": "Cyber Automation Engineer",
        "date": "2024-01-10",
        "updated": "2024-01-12",
        "category": "PLC Programming",
        "tags": ["PLC", "IEC61131-3", "Programming", "Automation"],
        "read_time": 12,
        "thumbnail": "/images/plc-best-practices.jpg",
        "featured": True,
    },
    {
        "id": 3,
        "title": "OPC UA Communication Protocol: Implementation Guide",
        "slug": "opc-ua-implementation-guide",
        "excerpt": "Step-by-step guide to implementing OPC UA in industrial environments.",
        "content": "Full article content here...",
        "author": "Cyber Automation Engineer",
        "date": "2024-01-05",
        "updated": "2024-01-08",
        "category": "Industrial Protocols",
        "tags": ["OPC-UA", "Protocol", "Communication", "Interoperability"],
        "read_time": 10,
        "thumbnail": "/images/opc-ua.jpg",
        "featured": False,
    },
    {
        "id": 4,
        "title": "OT Cybersecurity: Threats and Mitigation Strategies",
        "slug": "ot-cybersecurity-threats-mitigation",
        "excerpt": "Analysis of emerging OT cyber threats and practical defense strategies.",
        "content": "Full article content here...",
        "author": "Cyber Automation Engineer",
        "date": "2024-01-01",
        "updated": "2024-01-03",
        "category": "OT Cybersecurity",
        "tags": ["Cybersecurity", "OT", "Defense", "Threats", "ICS"],
        "read_time": 15,
        "thumbnail": "/images/ot-cybersecurity.jpg",
        "featured": True,
    },
]

# Author profile data
AUTHOR_PROFILE = {
    "pseudonym": "Cyber Automation Engineer",
    "full_name": "Professional Automation & Cybersecurity Specialist",
    "bio": "20+ years of experience in industrial automation, ICS/SCADA systems, OT cybersecurity, and software development. Passionate about bridging the gap between IT and OT security.",
    "avatar": "/images/avatar.png",
    "location": "Remote",
    "professional_title": "ICS Security Researcher & Automation Engineer",
    "social_links": {
        "github": "https://github.com/P-Dibya",
        "linkedin": "https://www.linkedin.com/in/dibyajyoti-sahoo-127400300/",
        "twitter": "https://x.com/Dibyajy81971874",
        "email": "sahoodebu179@gmail.com",
    },
    "skills": [
        "PLC Programming",
        "SCADA Development",
        "OT Cybersecurity",
        "Python",
        "Java",
        "C/C++",
        "Modbus TCP/IP",
        "OPC UA",
        "Profinet",
        "Ethernet/IP",
        "LabVIEW",
        "Industry 4.0",
    ],
    "expertise_years": 20,
    "blog_posts_count": len(BLOG_POSTS),
    "projects_count": 15,
}

# Site metadata
SITE_METADATA = {
    "site_url": "https://cyberautomationengineer.com",
    "site_title": "Cyber Automation Engineer - Technical Blog",
    "site_description": "Professional blog on industrial automation, ICS/SCADA security, and OT cybersecurity.",
    "site_keywords": [
        "SCADA", "ICS", "PLC", "Industrial Automation", "OT Cybersecurity",
        "Modbus", "OPC UA", "Security", "Programming", "Engineering"
    ],
    "author": AUTHOR_PROFILE["pseudonym"],
}

# ============================================================================
# FLASK APP CONFIGURATION
# ============================================================================

flask_app = Flask(__name__)
CORS(flask_app)

# Serve static files
@flask_app.route("/")
def index():
    """Serve the main HTML file."""
    return send_from_directory(".", "index.html")

@flask_app.route("/<path:filename>")
def serve_static(filename):
    """Serve static assets (CSS, JS, images)."""
    return send_from_directory(".", filename)

@flask_app.route("/api/posts", methods=["GET"])
def get_posts():
    """
    API endpoint to retrieve blog posts.
    Query parameters:
      - limit: Max number of posts to return (default: 10)
      - featured: Only return featured posts (true/false)
      - category: Filter by category
    """
    limit = request.args.get("limit", 10, type=int)
    featured_only = request.args.get("featured", "false").lower() == "true"
    category = request.args.get("category", None, type=str)

    posts = BLOG_POSTS.copy()

    if featured_only:
        posts = [p for p in posts if p.get("featured", False)]

    if category:
        posts = [p for p in posts if p.get("category", "").lower() == category.lower()]

    return jsonify({
        "success": True,
        "data": posts[:limit],
        "total": len(posts),
        "limit": limit,
    })

@flask_app.route("/api/posts/<int:post_id>", methods=["GET"])
def get_post(post_id):
    """Retrieve a specific blog post by ID."""
    post = next((p for p in BLOG_POSTS if p["id"] == post_id), None)
    if not post:
        return jsonify({"success": False, "error": "Post not found"}), 404
    return jsonify({"success": True, "data": post})

@flask_app.route("/api/profile", methods=["GET"])
def get_profile():
    """Retrieve author profile information."""
    return jsonify({"success": True, "data": AUTHOR_PROFILE})

@flask_app.route("/api/health", methods=["GET"])
def health_check():
    """Health check endpoint for monitoring."""
    return jsonify({
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "Cyber Automation Engineer Blog API",
    })

@flask_app.route("/sitemap.xml", methods=["GET"])
def sitemap():
    """Generate XML sitemap for SEO."""
    xml_content = generate_sitemap_xml()
    return flask_app.response_class(response=xml_content, mimetype="application/xml")

@flask_app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return jsonify({"success": False, "error": "Resource not found"}), 404

@flask_app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    return jsonify({"success": False, "error": "Internal server error"}), 500

# ============================================================================
# FASTAPI APP CONFIGURATION
# ============================================================================

fastapi_app = FastAPI(
    title="Cyber Automation Engineer API",
    description="Technical blog API for industrial automation and OT security",
    version="1.0.0",
)

# Configure CORS for FastAPI
fastapi_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
static_dir = os.path.abspath(".")
if os.path.exists(static_dir):
    fastapi_app.mount("/static", StaticFiles(directory=static_dir), name="static")

@fastapi_app.get("/")
async def fastapi_index():
    """Serve the main HTML file via FastAPI."""
    return FileResponse("index.html", media_type="text/html")

@fastapi_app.get("/api/posts")
async def fastapi_get_posts(
    limit: int = 10,
    featured: bool = False,
    category: Optional[str] = None,
):
    """
    Retrieve blog posts via FastAPI.
    Query parameters:
      - limit: Max number of posts to return
      - featured: Only return featured posts
      - category: Filter by category
    """
    posts = BLOG_POSTS.copy()

    if featured:
        posts = [p for p in posts if p.get("featured", False)]

    if category:
        posts = [p for p in posts if p.get("category", "").lower() == category.lower()]

    return {
        "success": True,
        "data": posts[:limit],
        "total": len(posts),
        "limit": limit,
    }

@fastapi_app.get("/api/posts/{post_id}")
async def fastapi_get_post(post_id: int):
    """Retrieve a specific blog post by ID."""
    post = next((p for p in BLOG_POSTS if p["id"] == post_id), None)
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return {"success": True, "data": post}

@fastapi_app.get("/api/profile")
async def fastapi_get_profile():
    """Retrieve author profile information."""
    return {"success": True, "data": AUTHOR_PROFILE}

@fastapi_app.get("/api/health")
async def fastapi_health_check():
    """Health check endpoint for monitoring."""
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "service": "Cyber Automation Engineer Blog API (FastAPI)",
    }

@fastapi_app.get("/sitemap.xml")
async def fastapi_sitemap():
    """Generate XML sitemap for SEO."""
    xml_content = generate_sitemap_xml()
    return Response(content=xml_content, media_type="application/xml")

# ============================================================================
# UTILITY FUNCTIONS
# ============================================================================

def generate_sitemap_xml() -> str:
    """
    Generate a sitemap.xml file for search engines.
    Includes main page and all blog post URLs.
    """
    urlset = ET.Element("urlset")
    urlset.set("xmlns", "http://www.sitemaps.org/schemas/sitemap/0.9")

    base_url = SITE_METADATA["site_url"]

    # Add main page
    url_elem = ET.SubElement(urlset, "url")
    loc = ET.SubElement(url_elem, "loc")
    loc.text = base_url
    lastmod = ET.SubElement(url_elem, "lastmod")
    lastmod.text = datetime.utcnow().strftime("%Y-%m-%d")
    priority = ET.SubElement(url_elem, "priority")
    priority.text = "1.0"

    # Add blog posts
    for post in BLOG_POSTS:
        url_elem = ET.SubElement(urlset, "url")
        loc = ET.SubElement(url_elem, "loc")
        loc.text = f"{base_url}/blog/{post['slug']}"
        lastmod = ET.SubElement(url_elem, "lastmod")
        lastmod.text = post.get("updated", post["date"])
        priority = ET.SubElement(url_elem, "priority")
        priority.text = "0.8"

    return ET.tostring(urlset, encoding="unicode")

def inject_seo_meta_tags() -> str:
    """
    Generate SEO meta tags to be injected into HTML head.
    Returns HTML string with meta tags.
    """
    meta_tags = f"""
    <meta name="description" content="{SITE_METADATA['site_description']}">
    <meta name="keywords" content="{', '.join(SITE_METADATA['site_keywords'])}">
    <meta name="author" content="{SITE_METADATA['author']}">
    <meta name="theme-color" content="#0a0a0f">
    <meta property="og:title" content="{SITE_METADATA['site_title']}">
    <meta property="og:description" content="{SITE_METADATA['site_description']}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{SITE_METADATA['site_url']}">
    <link rel="canonical" href="{SITE_METADATA['site_url']}">
    """
    return meta_tags

# ============================================================================
# MAIN EXECUTION
# ============================================================================

if __name__ == "__main__":
    import uvicorn

    print("=" * 70)
    print("Cyber Automation Engineer - Blog API Server")
    print("=" * 70)
    print()
    print("Available backends:")
    print("  1. Flask  : python app.py --flask")
    print("  2. FastAPI: uvicorn app:fastapi_app --reload")
    print()
    print("API Endpoints:")
    print("  GET  /api/posts           - Retrieve blog posts")
    print("  GET  /api/posts/{id}      - Get specific post")
    print("  GET  /api/profile         - Get author profile")
    print("  GET  /api/health          - Health check")
    print("  GET  /sitemap.xml         - SEO sitemap")
    print()

    import sys

    if len(sys.argv) > 1 and sys.argv[1] == "--flask":
        print("Starting Flask server on http://localhost:5000")
        print("Press Ctrl+C to stop")
        flask_app.run(debug=True, port=5000)
    else:
        print("Starting FastAPI server on http://localhost:8000")
        print("Docs available at http://localhost:8000/docs")
        print("Press Ctrl+C to stop")
        uvicorn.run(fastapi_app, host="0.0.0.0", port=8000)
