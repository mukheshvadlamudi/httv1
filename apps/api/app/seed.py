from __future__ import annotations
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
    {
        "slug": "phone-scams",
        "title": "How to spot and block phone scam texts",
        "description": "A beginner's guide to identifying text message scams (smishing) and blocking numbers on iPhone or Android.",
        "category": "Security",
        "tags": ["security", "safety", "phone scams", "blocking"],
        "minutes": 5,
        "steps": [
            ("Look for urgent warnings and sketchy links", "Scammers often send fake messages pretending to be USPS, UPS, Netflix, or your bank. They will claim a parcel could not be delivered or your account is suspended. Look at the link: if it doesn't end with the official website (like usps.com), it is a scam!"),
            ("Never click links or call back the sender", "Clicking a link can install silent virus software or direct you to a fake website designed to steal your passwords or credit card numbers. If you think the message might be real, open your browser and go directly to the official site yourself."),
            ("Block the number on iPhone", "Open the message, tap the sender's circular profile icon at the top of the screen, tap 'Info', and select the red option 'Block this Caller' at the bottom of the list. Confirm your block."),
            ("Block the number on Android", "Open the message, tap the three dots icon in the top right corner, select 'Details' or 'Options', and tap 'Block & report spam'. Tap 'OK' to confirm."),
        ],
        "glossary": [
            ("Smishing", "A form of phishing where scammers send fraudulent text messages to trick you into sharing sensitive bank or login details."),
            ("Spam reporting", "Sending a notification to your mobile carrier (or phone manufacturer) about a scam sender to help them block the number for everyone."),
        ],
    },
    {
        "slug": "backup-photos",
        "title": "How to back up photos to Google Photos or iCloud",
        "description": "Ensure your precious memories are safely backed up in the cloud so you never lose them if your phone breaks.",
        "category": "Mobile",
        "tags": ["photos", "backup", "icloud", "google photos", "mobile"],
        "minutes": 6,
        "steps": [
            ("Connect to your home Wi-Fi", "Uploading hundreds of high-quality photos can take a lot of internet data. Make sure your phone is connected to your home Wi-Fi network and plugged into a charger."),
            ("Enable iCloud Photo Backup on iPhone", "Open the 'Settings' app, tap your name at the very top of the list, tap 'iCloud', tap 'Photos', and toggle the switch for 'Sync this iPhone' to green."),
            ("Enable Google Photos Backup on Android", "Open the Google Photos app (looks like a colorful pinwheel), tap your profile picture in the top-right corner, tap 'Photos settings', select 'Backup', and turn on the 'Backup' toggle toggle switch."),
            ("Verify your upload progress", "Keep the app open for a few minutes. You will see a small circular arrow icon spin, showing that photos are copying to the cloud. A checkmark means everything is backed up!"),
        ],
        "glossary": [
            ("iCloud", "Apple's cloud storage service that automatically keeps your iPhone photos, notes, and documents backed up safely online."),
            ("Google Photos", "An app by Google that stores and organizes your photos in your online Google Account."),
        ],
    },
    {
        "slug": "android-security",
        "title": "How to manage phone app permissions and location privacy",
        "description": "Stop apps from spying on your camera, microphone, or tracking your location in the background.",
        "category": "Security",
        "tags": ["security", "privacy", "location tracking", "android", "iphone"],
        "minutes": 5,
        "steps": [
            ("Open the Permission Manager inside Settings", "Open your phone's 'Settings' app. Scroll down and tap on 'Privacy' or 'Apps', then look for 'Permission manager' or 'App permissions'."),
            ("Check which apps track your Location", "Tap on 'Location'. You will see a list of apps split by permissions: 'Allowed all the time', 'Allowed only while in use', and 'Not allowed'. Check if any games or calculators have location access."),
            ("Disable location tracking for suspicious apps", "Tap on any app that doesn't need to know where you are. Change the setting to 'Don't allow'. For apps like maps or weather, choose 'Allow only while using the app'."),
            ("Review Camera and Microphone access", "Go back to the Permission Manager. Tap on 'Camera' and 'Microphone'. Turn off permissions for any app that has no business listening in or watching you."),
        ],
        "glossary": [
            ("App permissions", "Security settings that govern whether a phone app is allowed to access features like your camera, contact list, files, or microphone."),
            ("Location tracking", "A phone feature that uses GPS coordinates to pinpoint exactly where you are standing in the world."),
        ],
    },
    {
        "slug": "block-ads",
        "title": "How to block online ads and web trackers",
        "description": "Stop annoying pop-up ads, block trackers, and protect your privacy while speeding up your web browsing.",
        "category": "Productivity",
        "tags": ["ad blocker", "browser", "privacy", "productivity"],
        "minutes": 4,
        "steps": [
            ("Open your web browser extension store", "Open your web browser (Chrome, Edge, or Firefox). Click the menu button (three dots or lines in the top right), select 'Extensions', and click 'Open Chrome Web Store' or 'Add-ons'."),
            ("Search for uBlock Origin", "Type 'uBlock Origin' in the search bar of the store. uBlock Origin is widely recommended because it is completely free, open-source, and does not slow down your computer."),
            ("Click Add to Browser", "Tap the blue button that says 'Add to Chrome', 'Get', or 'Add to Firefox'. A small window will pop up asking for confirmation. Click 'Add extension'."),
            ("Confirm it is active", "You will see a small red shield icon appear in the top-right corner of your browser toolbar. This shield automatically blocks ads. When you visit websites, you will notice clean pages with no flashing banners!"),
        ],
        "glossary": [
            ("Browser extension", "A small add-on program you install inside your web browser to give it extra features, like ad-blockers or price comparison tools."),
            ("Web tracker", "A hidden script on websites that records your clicks, search history, and shopping habits to show you targeted ads."),
        ],
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
