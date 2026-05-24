from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models import Category, GlossaryTerm, Guide, GuideStep, Tag

GUIDES = [
    {
        "slug": "gmail-password-reset",
        "title": "How to reset your Gmail password",
        "description": "A simple guide to recover or change your Gmail password.",
        "category": "Email",
        "tags": ["gmail", "password", "account recovery"],
        "minutes": 5,
        "steps": [
            ("Open the sign-in page", "Go to the Google sign-in page in your browser."),
            ("Choose forgot password", "Click Forgot password and follow the prompts."),
            ("Verify it is you", "Use your recovery email, phone, or another method Google offers."),
            ("Set a new password", "Choose a password you have not used before."),
        ],
        "glossary": [("Recovery email", "A backup email address used to help you get back into your account.")],
    },
    {
        "slug": "strong-password",
        "title": "How to make a strong password",
        "description": "Learn how to create passwords that are easy for you to remember but hard for others to guess.",
        "category": "Security",
        "tags": ["security", "safety", "password"],
        "minutes": 4,
        "steps": [
            ("Use a long phrase", "Pick four or more unrelated words or a sentence only you know."),
            ("Avoid personal details", "Do not use your name, birthday, phone number, or pet name."),
            ("Use a password manager", "Let a password manager create and remember unique passwords."),
        ],
        "glossary": [("Password manager", "An app that securely stores your passwords for different accounts.")],
    },
    {
        "slug": "join-zoom-meeting",
        "title": "How to join a Zoom meeting",
        "description": "Join a Zoom call from a meeting link without getting stuck.",
        "category": "Zoom Calls",
        "tags": ["zoom", "video call", "meeting"],
        "minutes": 3,
        "steps": [
            ("Open the meeting link", "Click the Zoom link from your email or calendar invite."),
            ("Allow audio and video", "Choose whether Zoom can use your microphone and camera."),
            ("Join the meeting", "Type your name if asked, then click Join."),
        ],
        "glossary": [("Microphone permission", "Approval that lets Zoom use your computer or phone microphone.")],
    },
    {
        "slug": "share-google-drive-file",
        "title": "How to share a Google Drive file",
        "description": "Share a file with the right people and avoid making it public by mistake.",
        "category": "Productivity",
        "tags": ["google drive", "sharing", "files"],
        "minutes": 5,
        "steps": [
            ("Open Drive", "Go to Google Drive and find the file."),
            ("Click share", "Right-click the file and choose Share."),
            ("Add people", "Enter email addresses and choose Viewer, Commenter, or Editor."),
            ("Check link access", "Keep link access restricted unless you really want anyone with the link to open it."),
        ],
        "glossary": [("Restricted link", "A sharing setting where only selected people can open the file.")],
    },
    {
        "slug": "spot-scam-email",
        "title": "How to spot a scam email",
        "description": "Check suspicious emails before you click links or share private information.",
        "category": "Security",
        "tags": ["email", "phishing", "scam"],
        "minutes": 6,
        "steps": [
            ("Check the sender", "Look carefully at the email address, not only the display name."),
            ("Look for pressure", "Be cautious of urgent messages asking for money, passwords, or codes."),
            ("Do not click first", "Open the official website yourself instead of using suspicious links."),
        ],
        "glossary": [("Phishing", "A trick that tries to steal passwords, money, or personal information.")],
    },
    {
        "slug": "use-chatgpt-safely",
        "title": "How to use ChatGPT safely",
        "description": "Use AI tools without sharing private information or trusting every answer blindly.",
        "category": "AI",
        "tags": ["ai", "chatgpt", "privacy"],
        "minutes": 5,
        "steps": [
            ("Avoid secrets", "Do not paste passwords, private documents, or sensitive customer data."),
            ("Ask for sources", "For important facts, ask where the answer comes from."),
            ("Double-check decisions", "Verify medical, legal, financial, or security advice with trusted experts."),
        ],
        "glossary": [("AI hallucination", "When an AI gives an answer that sounds confident but is wrong.")],
    },
    {
        "slug": "install-android-app",
        "title": "How to install an app on Android",
        "description": "Install an app safely from the Google Play Store.",
        "category": "Mobile",
        "tags": ["android", "apps", "play store"],
        "minutes": 3,
        "steps": [
            ("Open Play Store", "Tap the Play Store app on your phone."),
            ("Search for the app", "Type the app name and check the developer name."),
            ("Install", "Tap Install and wait for the download to finish."),
        ],
        "glossary": [("Developer name", "The company or person who published the app.")],
    },
    {
        "slug": "update-iphone",
        "title": "How to update an iPhone",
        "description": "Update iOS so your phone gets the latest fixes and features.",
        "category": "Mobile",
        "tags": ["iphone", "ios", "update"],
        "minutes": 7,
        "steps": [
            ("Connect to Wi-Fi", "Use Wi-Fi and keep your phone charged."),
            ("Open settings", "Go to Settings, General, then Software Update."),
            ("Install update", "Tap Download and Install if an update is available."),
        ],
        "glossary": [("iOS", "The operating system that runs on iPhones.")],
    },
    {
        "slug": "create-pdf",
        "title": "How to create a PDF",
        "description": "Save a document as a PDF so it looks the same when shared.",
        "category": "Productivity",
        "tags": ["pdf", "documents", "export"],
        "minutes": 4,
        "steps": [
            ("Open the document", "Open your file in Word, Google Docs, or another editor."),
            ("Choose export or download", "Look for Export, Download, or Save As."),
            ("Select PDF", "Choose PDF and save it to your device."),
        ],
        "glossary": [("PDF", "A file format that keeps layout and text consistent across devices.")],
    },
    {
        "slug": "two-factor-authentication",
        "title": "How to use two-factor authentication",
        "description": "Add an extra sign-in step to make your accounts safer.",
        "category": "Security",
        "tags": ["2fa", "security", "authentication"],
        "minutes": 6,
        "steps": [
            ("Open account security", "Go to the security settings for your account."),
            ("Choose an extra method", "Use an authenticator app or security key when possible."),
            ("Save backup codes", "Store backup codes somewhere safe in case you lose your phone."),
        ],
        "glossary": [("Backup code", "A one-time code that can help you sign in if your main 2FA method is unavailable.")],
    },
]


def slugify(value: str) -> str:
    return value.lower().replace("&", "and").replace("/", " ").replace(" ", "-")


def get_or_create_category(db: Session, name: str) -> Category:
    slug = slugify(name)
    category = db.scalar(select(Category).where(Category.slug == slug))
    if category is None:
        category = Category(slug=slug, name=name, description=f"{name} guides for beginners.")
        db.add(category)
        db.flush()
    return category


def get_or_create_tag(db: Session, name: str) -> Tag:
    slug = slugify(name)
    tag = db.scalar(select(Tag).where(Tag.slug == slug))
    if tag is None:
        tag = Tag(slug=slug, name=name)
        db.add(tag)
        db.flush()
    return tag


def seed_guides() -> None:
    db = SessionLocal()
    try:
        for item in GUIDES:
            existing = db.scalar(select(Guide).where(Guide.slug == item["slug"]))
            if existing:
                continue
            guide = Guide(
                slug=item["slug"],
                title=item["title"],
                description=item["description"],
                audience="Beginner",
                difficulty="Easy",
                estimated_minutes=item["minutes"],
                last_updated=date(2026, 5, 23),
                category=get_or_create_category(db, item["category"]),
            )
            db.add(guide)
            db.flush()
            guide.tags = [get_or_create_tag(db, tag) for tag in item["tags"]]
            guide.steps = [GuideStep(order=i + 1, title=title, body=body) for i, (title, body) in enumerate(item["steps"])]
            guide.glossary = [GlossaryTerm(term=term, definition=definition) for term, definition in item["glossary"]]
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    seed_guides()
    print("Seeded beginner guides.")
