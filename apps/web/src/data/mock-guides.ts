export interface GuideStep {
  order: number;
  title: string;
  body: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
}

export interface Guide {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  audience: string;
  difficulty: "Easy" | "Medium" | "Hard";
  estimatedMinutes: number;
  lastUpdated: string;
  steps: GuideStep[];
  glossary: GlossaryTerm[];
  tags: string[];
}

export const MOCK_GUIDES: Guide[] = [
  {
    id: "gmail-password-reset",
    slug: "gmail-password-reset",
    title: "How to reset your Gmail password",
    description: "A simple guide to recover or change your Gmail password when you can't log in.",
    category: "Email",
    audience: "Beginner",
    difficulty: "Easy",
    estimatedMinutes: 5,
    lastUpdated: "2026-05-23",
    steps: [
      {
        "order": 1,
        "title": "Open the Google Sign-in page",
        "body": "Go to the Google Sign-in page on your computer or phone. Type in your Gmail address (example@gmail.com) and click 'Next'."
      },
      {
        "order": 2,
        "title": "Click on 'Forgot password?'",
        "body": "On the screen where it asks for your password, look for the blue text at the bottom left that says 'Forgot password?'. Click on it."
      },
      {
        "order": 3,
        "title": "Select a recovery method",
        "body": "Google will offer to send a security code to your recovery email or recovery phone number. Choose the method that you have access to right now."
      },
      {
        "order": 4,
        "title": "Enter the security code",
        "body": "Check your phone's text messages or your other email account for a 6-digit code. Type this code into the box on the screen and click 'Next'."
      },
      {
        "order": 5,
        "title": "Create a brand new password",
        "body": "Type in a new password that you haven't used before. Type it twice to make sure there are no typos, then click 'Save password'."
      }
    ],
    glossary: [
      {
        "term": "Recovery email",
        "definition": "A backup email address used to help you get back into your account if you forget your password."
      },
      {
        "term": "Security code",
        "definition": "A temporary number sent to your phone or backup email to prove that you are the real owner of the account."
      }
    ],
    tags: ["gmail", "password", "account recovery", "google"]
  },
  {
    id: "strong-password",
    slug: "strong-password",
    title: "How to make a strong password",
    description: "Learn how to create passwords that are easy for you to remember but hard for hackers to guess.",
    category: "Security",
    audience: "Beginner",
    difficulty: "Easy",
    estimatedMinutes: 4,
    lastUpdated: "2026-05-24",
    steps: [
      {
        "order": 1,
        "title": "Think of a memorable sentence",
        "body": "Choose a simple sentence that is easy for you to remember but completely personal to you. For example: 'I love drinking tea in the morning!'"
      },
      {
        "order": 2,
        "title": "Use the first letters of each word",
        "body": "Take the first letter of each word in your sentence. From 'I love drinking tea in the morning!', you get: 'Ildtitm'."
      },
      {
        "order": 3,
        "title": "Add numbers and special symbols",
        "body": "Mix in numbers and symbols (like !, @, #, $, or &). Replace 'tea' with the number '3' or add an exclamation point at the end: 'Ild3itm!'"
      },
      {
        "order": 4,
        "title": "Avoid common mistakes",
        "body": "Never use your name, birthday, sequential numbers (like 1234), or the word 'password'. Hackers check for these first!"
      },
      {
        "order": 5,
        "title": "Write it down in a safe spot",
        "body": "Store it in a physical notebook at home (out of sight) or use a password manager. Never share it with anyone over email or text."
      }
    ],
    glossary: [
      {
        "term": "Password Manager",
        "definition": "A secure digital vault on your computer or phone that remembers all your complex passwords for you."
      },
      {
        "term": "Hacker",
        "definition": "A clever computer user who tries to break into other people's accounts or steal personal information."
      }
    ],
    tags: ["security", "safety", "password", "privacy"]
  },
  {
    id: "chatgpt-safety",
    slug: "chatgpt-safety",
    title: "How to use ChatGPT safely",
    description: "A beginner's guide to asking AI questions without sharing private information.",
    category: "AI & Tools",
    audience: "Beginner",
    difficulty: "Easy",
    estimatedMinutes: 5,
    lastUpdated: "2026-05-24",
    steps: [
      {
        "order": 1,
        "title": "Go to the official website",
        "body": "Always access ChatGPT through the real website (chatgpt.com) or download the official app. Avoid typing your credentials into third-party copycat sites."
      },
      {
        "order": 2,
        "title": "Ask questions like a normal search",
        "body": "Type in your questions in plain language. For example: 'What is a good recipe for apple pie?' or 'How do plants drink water?'"
      },
      {
        "order": 3,
        "title": "Do not share personal details",
        "body": "Never tell ChatGPT your home address, credit card numbers, passwords, bank accounts, or health details. AI models save conversations to improve their systems."
      },
      {
        "order": 4,
        "title": "Double-check the answers",
        "body": "AI can sometimes make up facts (called hallucinations). Always verify important health, legal, or financial advice with real experts."
      }
    ],
    glossary: [
      {
        "term": "Hallucination",
        "definition": "A mistake where an artificial intelligence confidently makes up a fact that is not true."
      },
      {
        "term": "AI (Artificial Intelligence)",
        "definition": "A computer program trained to understand, talk, and solve problems in a human-like way."
      }
    ],
    tags: ["ai", "chatgpt", "safety", "privacy"]
  },
  {
    id: "zoom-meeting-join",
    slug: "zoom-meeting-join",
    title: "How to join a Zoom meeting",
    description: "Step-by-step instructions to connect with family, friends, or colleagues on a Zoom video call.",
    category: "Communication",
    audience: "Beginner",
    difficulty: "Easy",
    estimatedMinutes: 6,
    lastUpdated: "2026-05-24",
    steps: [
      {
        "order": 1,
        "title": "Locate your invitation",
        "body": "Find the Zoom invitation sent to your email or text messages. It will contain a blue web address link (URL) that starts with 'https://zoom.us/j/'."
      },
      {
        "order": 2,
        "title": "Click the invitation link",
        "body": "Click or tap on the blue link. If it's your first time, your computer will prompt you to download the free Zoom application. Click 'Download' or 'Accept'."
      },
      {
        "order": 3,
        "title": "Select video and audio options",
        "body": "A box will pop up asking: 'Join with Video?'. Click 'Yes'. Next, select 'Join with Computer Audio' so you can hear and speak to others."
      },
      {
        "order": 4,
        "title": "Mute and unmute yourself",
        "body": "Look for the microphone icon in the bottom-left corner. Click it to 'Mute' (turns red) when you are not speaking, so background noise doesn't disturb the call. Click again to 'Unmute'."
      }
    ],
    glossary: [
      {
        "term": "Mute",
        "definition": "Turning off your microphone so that other people in the video call cannot hear you or your background noise."
      },
      {
        "term": "Zoom",
        "definition": "A popular computer and phone application that lets multiple people video-call each other at the same time."
      }
    ],
    tags: ["zoom", "video call", "communication", "meetings"]
  },
  {
    id: "share-google-drive",
    slug: "share-google-drive",
    title: "How to share a Google Drive file",
    description: "Send photos, documents, or spreadsheets to others safely using Google Drive.",
    category: "Productivity",
    audience: "Beginner",
    difficulty: "Easy",
    estimatedMinutes: 5,
    lastUpdated: "2026-05-24",
    steps: [
      {
        "order": 1,
        "title": "Find your file in Google Drive",
        "body": "Open Google Drive in your browser. Double-click the folder to locate the specific file (like a photo or document) you wish to share."
      },
      {
        "order": 2,
        "title": "Click on the three dots",
        "body": "Right-click the file, or click the 'three dots' icon next to the file name to open the options menu."
      },
      {
        "order": 3,
        "title": "Select the 'Share' option",
        "body": "Click on 'Share' (looks like a person outline with a '+' sign next to it). A sharing box will appear on your screen."
      },
      {
        "order": 4,
        "title": "Enter the recipient's email",
        "body": "Type in the email address of the person you want to send it to. You can also add a short note to describe what the file is."
      },
      {
        "order": 5,
        "title": "Set permissions and send",
        "body": "Decide if they can just view the file ('Viewer') or edit it ('Editor'). Click the blue 'Send' button to finish."
      }
    ],
    glossary: [
      {
        "term": "Permissions",
        "definition": "Settings that decide whether someone is allowed to edit, comment on, or only view a shared file."
      },
      {
        "term": "Google Drive",
        "definition": "An online storage cabinet provided by Google that lets you save files securely on the internet."
      }
    ],
    tags: ["google drive", "sharing", "productivity", "files"]
  },
  {
    id: "spot-scam-email",
    slug: "spot-scam-email",
    title: "How to spot a scam email",
    description: "Learn the primary warning signs of phishing emails trying to steal your bank details or passwords.",
    category: "Security",
    audience: "Beginner",
    difficulty: "Medium",
    estimatedMinutes: 6,
    lastUpdated: "2026-05-24",
    steps: [
      {
        "order": 1,
        "title": "Check the sender's full email address",
        "body": "Don't just look at the name (like 'Netflix'). Tap or click on the name to see the full email address. If it looks like 'netflix-support@secureserver-9.com', it is a fake!"
      },
      {
        "order": 2,
        "title": "Look for urgent or scary language",
        "body": "Scam emails often try to scare you. Watch out for phrases like: 'URGENT: Your bank account will be suspended in 24 hours!' or 'Your parcel could not be delivered, click here immediately!'"
      },
      {
        "order": 3,
        "title": "Inspect links before clicking",
        "body": "Hover your mouse cursor over any buttons or links without clicking them. Look at the web address that pops up at the bottom of the screen. If it doesn't match the company's real website, don't click it."
      },
      {
        "order": 4,
        "title": "Be suspicious of attachments",
        "body": "Never download attachments (like invoice.pdf.exe or invoice.zip) from people you don't know. They can contain viruses that infect your device."
      }
    ],
    glossary: [
      {
        "term": "Phishing",
        "definition": "A trick where scammers send fake emails disguised as legitimate companies to steal personal passwords or bank codes."
      },
      {
        "term": "Attachment",
        "definition": "A file (like a photo, document, or program) sent along inside an email that you can download to your device."
      }
    ],
    tags: ["security", "scam", "phishing", "email safety"]
  },
  {
    id: "install-android-app",
    slug: "install-android-app",
    title: "How to install an app on Android",
    description: "A beginner's guide to downloading games, social media, or tools onto your Android phone safely.",
    category: "Mobile",
    audience: "Beginner",
    difficulty: "Easy",
    estimatedMinutes: 4,
    lastUpdated: "2026-05-24",
    steps: [
      {
        "order": 1,
        "title": "Open the Google Play Store",
        "body": "Locate the 'Play Store' icon on your phone's home screen. It looks like a colorful sideways triangle. Tap on it."
      },
      {
        "order": 2,
        "title": "Search for your desired app",
        "body": "Tap the search bar at the very top of the screen. Type in the name of the app you want (for example, 'WhatsApp') and tap the magnifying glass on your keyboard."
      },
      {
        "order": 3,
        "title": "Tap the 'Install' button",
        "body": "Verify the app name and developer, then click the green 'Install' button. Your phone will download the app automatically."
      },
      {
        "order": 4,
        "title": "Open the new app",
        "body": "Once finished, the button will change to say 'Open'. You can click that, or find the new app icon now added to your phone's home screen."
      }
    ],
    glossary: [
      {
        "term": "Play Store",
        "definition": "The official digital shop pre-installed on Android phones where you can download apps and games safely."
      },
      {
        "term": "App (Application)",
        "definition": "A software program built for your phone that does a specific job, like a calculator, a game, or a messaging tool."
      }
    ],
    tags: ["android", "mobile", "app download", "smartphone"]
  },
  {
    id: "update-iphone",
    slug: "update-iphone",
    title: "How to update your iPhone",
    description: "Keep your Apple iPhone secure and running smoothly by installing the latest updates.",
    category: "Mobile",
    audience: "Beginner",
    difficulty: "Easy",
    estimatedMinutes: 5,
    lastUpdated: "2026-05-24",
    steps: [
      {
        "order": 1,
        "title": "Connect to Wi-Fi and plug in charger",
        "body": "Updates require a stable internet connection and take some battery. Connect your iPhone to your home Wi-Fi and plug it into a charger."
      },
      {
        "order": 2,
        "title": "Open the Settings app",
        "body": "Find the gear icon named 'Settings' on your home screen and tap it."
      },
      {
        "order": 3,
        "title": "Go to 'General' settings",
        "body": "Scroll down a little bit and tap on the option called 'General'."
      },
      {
        "order": 4,
        "title": "Tap 'Software Update'",
        "body": "Tap on 'Software Update' at the top of the General list. Your iPhone will scan to see if an update is available."
      },
      {
        "order": 5,
        "title": "Select 'Download and Install'",
        "body": "If an update is listed, click the blue 'Download and Install' text. Type in your passcode and let the phone complete the process. It will restart once done."
      }
    ],
    glossary: [
      {
        "term": "Software Update",
        "definition": "A package of improvements and security fixes released by Apple to keep your iPhone running safely and introducing new features."
      },
      {
        "term": "Wi-Fi",
        "definition": "Wireless internet that connects your phone or computer to your home router without any physical cables."
      }
    ],
    tags: ["iphone", "apple", "software update", "mobile"]
  },
  {
    id: "create-pdf-document",
    slug: "create-pdf-document",
    title: "How to create a PDF document",
    description: "Convert a standard Word document or web page into a secure, readable PDF format.",
    category: "Productivity",
    audience: "Beginner",
    difficulty: "Medium",
    estimatedMinutes: 5,
    lastUpdated: "2026-05-24",
    steps: [
      {
        "order": 1,
        "title": "Open your document",
        "body": "Open the document (such as a resume in Microsoft Word or a page in Google Docs) that you want to convert."
      },
      {
        "order": 2,
        "title": "Go to the 'File' menu",
        "body": "Look at the very top left corner of the screen and click on 'File' to open the main operations list."
      },
      {
        "order": 3,
        "title": "Choose 'Save As' or 'Export'",
        "body": "Look for the option that says 'Save As', 'Export', or 'Download'. Click it."
      },
      {
        "order": 4,
        "title": "Select PDF format",
        "body": "In the format dropdown list (where it might say Word Document), change it to 'PDF Document (.pdf)'."
      },
      {
        "order": 5,
        "title": "Choose save location and click Save",
        "body": "Pick a folder (like your Desktop or Documents folder), rename your file if you wish, and click the blue 'Save' or 'Export' button."
      }
    ],
    glossary: [
      {
        "term": "PDF (Portable Document Format)",
        "definition": "A digital file format that looks exactly the same on any screen, making it ideal for sharing resumes, forms, or official letters."
      },
      {
        "term": "Export",
        "definition": "Converting a file from one format (like a Word document) into a completely different format (like a PDF or image)."
      }
    ],
    tags: ["pdf", "documents", "productivity", "office"]
  },
  {
    id: "two-factor-authentication",
    slug: "two-factor-authentication",
    title: "How to use two-factor authentication",
    description: "Double your account security by requiring both your password and a temporary mobile code to log in.",
    category: "Security",
    audience: "Beginner",
    difficulty: "Medium",
    estimatedMinutes: 7,
    lastUpdated: "2026-05-24",
    steps: [
      {
        "order": 1,
        "title": "Go to account security settings",
        "body": "Log into your account (like Google, Facebook, or your bank). Go to 'Settings' and look for the 'Security' or 'Sign-in options' menu."
      },
      {
        "order": 2,
        "title": "Select 'Two-Factor Authentication'",
        "body": "Look for 'Two-Factor Authentication' (sometimes called 2FA or 2-Step Verification) and click 'Get Started' or 'Enable'."
      },
      {
        "order": 3,
        "title": "Choose your verification method",
        "body": "You can choose to get security codes sent via SMS (Text Message) to your phone number, or link an Authenticator App (like Google Authenticator)."
      },
      {
        "order": 4,
        "title": "Verify your setup",
        "body": "The website will send a test code to your phone. Type this code into the verification box on the screen to confirm your setup is active."
      },
      {
        "order": 5,
        "title": "Save your backup codes",
        "body": "The site will show a list of one-time backup codes. Write these down on a physical card and store them safely. You will need them if you ever lose your phone!"
      }
    ],
    glossary: [
      {
        "term": "Two-Factor Authentication (2FA)",
        "definition": "A security setup requiring two items to log in: your password (something you know) and a code sent to your phone (something you have)."
      },
      {
        "term": "Authenticator App",
        "definition": "A phone app that automatically generates new, temporary 6-digit security codes every 30 seconds for your secure logins."
      }
    ],
    tags: ["2fa", "security", "two-factor", "safety"]
  }
];
